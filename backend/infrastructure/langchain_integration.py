import os
from typing import Dict, List, Any
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.runnables import RunnablePassthrough
from langchain_core.documents import Document
from langchain_postgres import PGVector
from langchain_postgres.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from infrastructure.settings import settings

# Global variable to hold the vector store
vector_store = None

def initialize_vector_store():
    """Initialize the vector store with PostgreSQL and pgvector"""
    global vector_store

    if vector_store is None:
        # Create embeddings using OpenAI (since we have the key)
        # This will be used for indexing documents into the vector database
        embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)

        # Initialize PGVector with the database connection
        # Note: embedding_function is passed as a parameter to the constructor
        vector_store = PGVector(
            connection=settings.DATABASE_URL,
            embeddings=embeddings,
            collection_name="research_documents",
        )

    return vector_store

def load_and_store_pdf_content():
    """Load PDF content and store it in the vector database"""
    try:
        # Initialize vector store
        db = initialize_vector_store()
        
        # Check if we already have stored documents
        existing_docs = db.similarity_search("test", k=1)
        if len(existing_docs) > 0:
            # Documents already exist, skip loading
            return True
            
        # Load the research PDF
        loader = PyPDFLoader(settings.PDF_PATH)
        documents = loader.load()

        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )

        # Apply custom chunking logic
        chunks = []
        for doc in documents:
            # Split the document text
            split_docs = text_splitter.split_documents([doc])

            # Apply custom metadata tagging
            for i, split_doc in enumerate(split_docs):
                content = split_doc.page_content.lower()

                is_amd = any(keyword in content for keyword in ["amd", "ttm", "rocm", "gfx90c", "gfx900", "vega", "amdgpu"])
                is_intel = any(keyword in content for keyword in ["intel", "ppgtt", "sycl", "oneapi", "i915", "gtt", "gem"])

                if not is_amd and not is_intel:
                    split_doc.metadata = {"chunk_id": i, "platform": "General"}
                    chunks.append(split_doc)
                else:
                    if is_amd:
                        from copy import deepcopy
                        amd_doc = deepcopy(split_doc)
                        amd_doc.metadata = {"chunk_id": i, "platform": "AMD"}
                        chunks.append(amd_doc)
                    if is_intel:
                        from copy import deepcopy
                        intel_doc = deepcopy(split_doc)
                        intel_doc.metadata = {"chunk_id": i, "platform": "Intel"}
                        chunks.append(intel_doc)

        # Store chunks in vector database
        db.add_documents(chunks)
        return True
        
    except Exception as e:
        print(f"Error loading and storing PDF content: {str(e)}")
        return False

# Create a prompt template for optimization recommendations
def create_optimization_prompt(vendor: str) -> PromptTemplate:
    """Create a prompt template for generating optimization recommendations based on vendor"""
    
    template = f"""
    Eres un experto en optimización de LLMs. Tu objetivo es dar una guía rápida, directa y accionable. No uses introducciones, ve directo al grano.

    Especificaciones de Hardware, Límites y Modelos Pre-calculados:
    {{hardware_info}}

    Contexto de Investigación Extraído (RAG):
    {{research_context}}

    Instrucciones (Responde en ESPAÑOL usando viñetas y sé extremadamente conciso):
    1. **Modelos a Utilizar:** 
       - Limítate EXCLUSIVAMENTE a mencionar los modelos que ya vienen recomendados en las "Especificaciones de Hardware". NO inventes ni sugieras modelos nuevos. 
       - Solo comenta por qué esos modelos caben en el "Presupuesto Efectivo para IA".
    2. **Configuración del Sistema y GPU ({vendor}):** 
       - Basándote ÚNICAMENTE en el "Contexto de Investigación", extrae y lista las configuraciones necesarias para este hardware.
       - Si el contexto menciona parámetros del kernel (ej. ajustes de RAM/VRAM), variables de entorno, o configuraciones de BIOS necesarias para este fabricante, indícalas claramente.
       - Si el contexto menciona flags de compilación o trucos específicos para esta arquitectura, lístalos.
    3. **Guía de Configuración Paso a Paso ({vendor}):** 
       - Proporciona una guía clara con pasos específicos (incluyendo comandos si aplican o se deducen del contexto) sobre qué debe hacer el usuario a continuación.
       - Explica específicamente cómo configurar el pool de memoria para ESTE fabricante (por ejemplo, TTM para AMD o GTT/PPGTT para Intel).
       - Explica brevemente qué es esta tecnología específica de {vendor} y cómo ajustarla para maximizar la VRAM en este sistema. NO menciones tecnologías de otros fabricantes.
    """

    return PromptTemplate.from_template(template)

# Main function to process hardware info and generate recommendations
def generate_optimization_recommendations(hardware_info: str, vendor: str) -> str:
    """Generate optimization recommendations based on hardware specs and research"""
    try:
        # Initialize vector store and load PDF content if needed
        db = initialize_vector_store()
        load_and_store_pdf_content()

        # Create the prompt template specifically for this vendor
        prompt = create_optimization_prompt(vendor)

        # Mejorar el query de búsqueda: en lugar de buscar por las especificaciones,
        # buscamos explícitamente conceptos de optimización para el hardware.
        search_query = f"Configuración, optimización de memoria VRAM, parámetros del kernel y pool de memoria para GPU {vendor}"
        if vendor == "AMD":
            search_query += " ROCm amdttm"
        elif vendor == "Intel":
            search_query += " GTT PPGTT i915"

        # Perform similarity search filtering by platform (metadata tag added during chunking)
        search_kwargs = {"k": 5}
        
        # Primero intentamos buscar con el filtro estricto por plataforma
        filter_kwargs = search_kwargs.copy()
        if vendor in ["AMD", "Intel"]:
            filter_kwargs["filter"] = {"platform": vendor}

        relevant_docs = db.similarity_search(search_query, **filter_kwargs)
        
        # Si el filtro estricto no devuelve resultados (por ejemplo, si los chunks no se taggearon bien),
        # hacemos un fallback sin filtro
        if not relevant_docs:
            relevant_docs = db.similarity_search(search_query, **search_kwargs)

        # Get the content of the relevant documents
        research_context = "\n".join([doc.page_content for doc in relevant_docs])

        # Create a chain that combines the prompt with the retrieved context
        from langchain_openai import ChatOpenAI
        
        # Select LLM based on provider setting
        if settings.LLM_PROVIDER.lower() == "openrouter":
            llm = ChatOpenAI(
                model=settings.OPENROUTER_MODEL,
                api_key=settings.OPENROUTER_API_KEY,
                base_url="https://openrouter.ai/api/v1",
                default_headers={
                    "HTTP-Referer": "https://vestaagentic.com", # Required by OpenRouter for some free models
                    "X-Title": "LAP-LLM Project"
                }
            )
        else:
            # Default to DeepSeek
            llm = ChatOpenAI(
                model="deepseek-chat", 
                api_key=settings.DEEPSEEK_API_KEY, 
                base_url="https://api.deepseek.com/v1"
            )
            
        chain = prompt | llm | StrOutputParser()

        # Generate the response using the chain
        response = chain.invoke({
            "hardware_info": hardware_info,
            "research_context": research_context
        })
        
        # Convert response to string to prevent StringPromptValue issues
        if hasattr(response, 'to_string'):
            # If it's a StringPromptValue or similar, convert it properly
            return response.to_string().strip()
        elif hasattr(response, 'text'):
            # If it's a StringPromptValue with text attribute
            return response.text.strip()
        else:
            # Regular string response
            return str(response).strip()
            
    except Exception as e:
        return f"Error generating recommendations: {str(e)}"
