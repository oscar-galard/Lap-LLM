from fastapi import FastAPI
from presentation.api import app
from presentation.adapters import InMemoryHardwareSpecsRepository, InMemoryModelSpecsRepository
from application.use_cases import RegisterHardwareSpecs

# Initialize repositories
hardware_repo = InMemoryHardwareSpecsRepository()
model_repo = InMemoryModelSpecsRepository()

# Initialize use case with dependencies
register_specs_use_case = RegisterHardwareSpecs(hardware_repo, model_repo)

# Inject the use case into the API (optional - you could also pass it directly in routes)
# For now, we'll keep it in the API module as shown above

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
