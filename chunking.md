```python
import re
from langchain_text_splitters import RecursiveCharacterTextSplitter

def semantic_pdf_chunker(text):

    headers_to_split_on = [
        (r"I\.\s+Fundamentos", "Fundamentos"),
        (r"II\.\s+Implementación", "AMD_Implementation"),
        (r"III\.\s+Estrategias\s+para\s+iGPUs\s+Intel", "Intel_Hypothesis"),
        (r"IV\.\s+Configuración\s+Recomendada", "Specs")
    ]
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = splitter.split_text(text)
    
    final_chunks = []
    for i, chunk in enumerate(chunks):
        metadata = {"chunk_id": i}
        if "AMD" in chunk or "TTM" in chunk:
            metadata["platform"] = "AMD"
        elif "Intel" in chunk or "PPGTT" in chunk:
            metadata["platform"] = "Intel"
            
        final_chunks.append({"content": chunk, "metadata": metadata})
        
    return final_chunks
```
