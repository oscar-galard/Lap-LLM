from fastapi import FastAPI
from presentation.dto import HardwareSpecsDTO
from domain.entities import HardwareSpecs
from application.use_cases import RegisterHardwareSpecs
from infrastructure.repositories import InMemoryHardwareSpecsRepository, InMemoryModelSpecsRepository

# Initialize repositories
hardware_repo = InMemoryHardwareSpecsRepository()
model_repo = InMemoryModelSpecsRepository()

# Initialize use case with dependencies
register_specs_use_case = RegisterHardwareSpecs(hardware_repo, model_repo)

# Create FastAPI app
app = FastAPI(title="LAP-LLM Backend API")

# Define routes
@app.post("/hardware-specs/")
async def register_hardware_specs(specs: HardwareSpecsDTO):
    # Convert DTO to entity
    hardware_entity = HardwareSpecs(
        cpu_model=specs.cpu_model,
        total_ram=specs.total_ram,
        used_ram=specs.used_ram,
        free_ram=specs.free_ram,
        os=specs.os,
        free_storage=specs.free_storage
    )
    
    # Register specs using use case
    register_specs_use_case.execute(hardware_entity)
    
    return {"message": "Hardware specifications registered successfully"}

@app.get("/models/")
async def get_models():
    # Get hardware specs
    hardware_specs = hardware_repo.get_hardware_specs()
    
    # Get model specs based on hardware
    model_specs = model_repo.get_model_specs(hardware_specs)
    
    return {"models": model_specs}