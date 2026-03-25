from domain.entities import HardwareSpecs, ModelSpecs
from domain.ports import HardwareSpecsRepository, ModelSpecsRepository
from presentation.dto import HardwareSpecsDTO
from infrastructure.langchain_integration import generate_optimization_recommendations
from application.vram_calculator import (
    calculate_vram_requirements, 
    get_model_recommendations,
    VRAMCalculationResult,
    calculate_dynamic_availability,
    generate_hardware_memory_info
)

class RegisterHardwareSpecs:
    def __init__(self, hardware_repo: HardwareSpecsRepository, model_repo: ModelSpecsRepository):
        self.hardware_repo = hardware_repo
        self.model_repo = model_repo

    def execute(self, hardware_dto: HardwareSpecsDTO) -> tuple[list[ModelSpecs], str, str]:
        hardware = HardwareSpecs(
            cpu_model=hardware_dto.cpu_model,
            total_ram=hardware_dto.total_ram,
            used_ram=hardware_dto.used_ram,
            free_ram=hardware_dto.free_ram,
            os=hardware_dto.os,
            free_storage=hardware_dto.free_storage,
            gpu_model=hardware_dto.gpu_model,
            is_dual_channel=hardware_dto.is_dual_channel
        )
        self.hardware_repo.save(hardware)
        
        # Calculate VRAM requirements for the first model as an example
        # In a real implementation, we'd calculate for all models
        models = self.model_repo.get_model_specs(hardware)
        
        # Generar únicamente la información base de recursos del hardware,
        # sin evaluar un modelo específico al azar.
        memory_info = generate_hardware_memory_info(hardware)

        # Add model recommendations to the memory info for LLM context
        # This will be included in the LLM prompt to provide recommendations
        recommended_models, explanation = get_model_recommendations(
            hardware, models, hardware_dto.performance_preference
        )
        
        # Append model recommendations to memory info
        memory_info += f"\n\nRecomendaciones de Modelos:\n{explanation}"

        # Extract vendor to pass for LangChain filtering
        vendor = "AMD" if "amd" in hardware.gpu_model.lower() else "Intel" if "intel" in hardware.gpu_model.lower() else "Unknown"

        # Generate optimization recommendations using LangChain
        # We now pass the detailed memory_info instead of a basic string
        recommendations = generate_optimization_recommendations(
            memory_info,
            vendor,
            "/home/oscar/projects/lap-llm/backend/Inferencia-LLM-en-dispositivos.pdf"
        )

        return models, memory_info, recommendations
