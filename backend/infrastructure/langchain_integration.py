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

        # Apply custom chunking logic from chunking.md
        chunks = []
        for doc in documents:
            # Split the document text
            split_docs = text_splitter.split_documents([doc])

            # Apply custom metadata tagging
            for i, split_doc in enumerate(split_docs):
                metadata = {"chunk_id": i}

                # Tag based on content
                if "AMD" in split_doc.page_content or "TTM" in split_doc.page_content:
                    metadata["platform"] = "AMD"
                elif "Intel" in split_doc.page_content or "PPGTT" in split_doc.page_content:
                    metadata["platform"] = "Intel"

                split_doc.metadata = metadata
                chunks.append(split_doc)

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
    3. **Resumen** Breve resumen con la informacion importante para el usuario, por ejemplo dependiendo del ({vendor}) informacion relacionada a amdttm (amd) o gtt/ppgtt(intel), que es? y como funciona para crear nuestro pool de memoria. 
    """

    return PromptTemplate.from_template(template)

# Main function to process hardware info and generate recommendations
def generate_optimization_recommendations(hardware_info: str, vendor: str, pdf_path: str) -> str:
    """Generate optimization recommendations based on hardware specs and research"""
    try:
        # Initialize vector store and load PDF content if needed
        db = initialize_vector_store()
        load_and_store_pdf_content()

        # Create the prompt template specifically for this vendor
        prompt = create_optimization_prompt(vendor)

        # Perform similarity search filtering by platform (metadata tag added during chunking)
        search_kwargs = {"k": 3}
        if vendor in ["AMD", "Intel"]:
            search_kwargs["filter"] = {"platform": vendor}

        relevant_docs = db.similarity_search(hardware_info, **search_kwargs)

        # Get the content of the relevant documents
        research_context = "\n".join([doc.page_content for doc in relevant_docs])

        # Create a chain that combines the prompt with the retrieved context
        from langchain_openai import ChatOpenAI
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
