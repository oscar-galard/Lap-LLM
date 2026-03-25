from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from presentation.dto import HardwareSpecsDTO
from domain.entities import HardwareSpecs, ModelSpecs
from application.use_cases import RegisterHardwareSpecs
from infrastructure.repositories import InMemoryHardwareSpecsRepository, InMemoryModelSpecsRepository
from application.vram_calculator import get_model_recommendations

# Initialize repositories
hardware_repo = InMemoryHardwareSpecsRepository()
model_repo = InMemoryModelSpecsRepository()

# Initialize use case with dependencies
register_specs_use_case = RegisterHardwareSpecs(hardware_repo, model_repo)

# Create FastAPI app
app = FastAPI(title="LAP-LLM Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define routes
@app.post("/hardware-specs/")
async def register_hardware_specs(specs: HardwareSpecsDTO):
    # Register specs using use case
    models, memory_info, recommendations = register_specs_use_case.execute(specs)

    return {
        "message": "Hardware specifications registered successfully",
        "memory_info": memory_info,
        "recommendations": recommendations
    }

@app.get("/models/")
async def get_models():
    # Get hardware specs
    hardware_specs = hardware_repo.get_hardware_specs()

    # Get model specs based on hardware
    model_specs = model_repo.get_model_specs(hardware_specs)

    return {"models": model_specs}


