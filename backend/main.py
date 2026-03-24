from fastapi import FastAPI
from presentation.api import app
from presentation.adapters import InMemoryHardwareSpecsRepository, InMemoryModelSpecsRepository
from application.use_cases import RegisterHardwareSpecs
from infrastructure.langchain_integration import load_and_store_pdf_content

# Initialize repositories
hardware_repo = InMemoryHardwareSpecsRepository()
model_repo = InMemoryModelSpecsRepository()

# Initialize use case with dependencies
register_specs_use_case = RegisterHardwareSpecs(hardware_repo, model_repo)

# Pre-load PDF content into vector database
# This ensures the vector store is initialized when the application starts
load_and_store_pdf_content()

# Inject the use case into the API (optional - you could also pass it directly in routes)
# For now, we'll keep it in the API module as shown above

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
