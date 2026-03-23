from domain.entities import HardwareSpecs, ModelSpecs
from domain.ports import HardwareSpecsRepository, ModelSpecsRepository
from presentation.dto import HardwareSpecsDTO

def classify_gpu_tier(gpu_name: str, is_dual_channel: bool) -> float:
    gpu_name = gpu_name.lower()
    
    # Check for Tier 0.4 (Low-end/Bottlenecked)
    if any(x in gpu_name for x in ["athlon", "ryzen 3"]) and "cu" in gpu_name:
        # Extract CU count and check if less than 6
        import re
        cu_match = re.search(r'(\d+)\s*cu', gpu_name)
        if cu_match and int(cu_match.group(1)) < 6:
            return 0.4
    elif any(x in gpu_name for x in ["uhd"]):
        # Check for older Intel UHD < Gen 11
        if "gen 11" not in gpu_name and "gen 12" not in gpu_name and "gen 13" not in gpu_name:
            return 0.4
    elif not is_dual_channel:
        # Single channel RAM is a 50% bandwidth penalty
        return 0.4
    
    # Check for Tier 1.0 (High-end)
    if any(x in gpu_name for x in ["780m", "680m", "arc", "iris xe"]):
        return 1.0
        
    # Check for Tier 0.7 (Mid-range)
    if any(x in gpu_name for x in ["vega", "uhd gen 11", "uhd gen 12", "uhd gen 13"]):
        return 0.7
        
    # Default to Tier 0.4 for unknown GPUs
    return 0.4

def calculate_memory_allocation(hardware: HardwareSpecs) -> str:
    # Base all VRAM allocation calculations on Free RAM (hardware.free_ram), not Total RAM
    total_ram_gb = hardware.total_ram / 1024
    free_ram_gb = hardware.free_ram / 1024
    
    # Calculate safety margin: at least 10% of Total RAM or 1.5GB (whichever is higher)
    safety_margin = max(total_ram_gb * 0.1, 1.5)
    
    # Effective budget calculation
    effective_budget = free_ram_gb - safety_margin
    
    # Calculate GPU tier
    gpu_tier = classify_gpu_tier(hardware.gpu_model, hardware.is_dual_channel)
    
    # Determine vendor
    vendor = "AMD" if "amd" in hardware.gpu_model.lower() else "Intel" if "intel" in hardware.gpu_model.lower() else "Unknown"
    
    # Initialize variables for memory limits
    ttm_limit = 0.0
    ppgtt_limit = 0.0
    gtt_limit = 0.0
    
    # Apply deterministic allocation logic based on vendor
    if vendor == "AMD":
        # For AMD: Calculate ttm_limit (up to 90% of effective_budget if Tier >= 0.7)
        if gpu_tier >= 0.7:
            ttm_limit = effective_budget * 0.9
        else:
            # For lower tiers, use a conservative limit
            ttm_limit = effective_budget * 0.5
    elif vendor == "Intel":
        # For Intel: Calculate ppgtt_limit (up to 70% of effective_budget for Iris/Arc) 
        # or gtt_limit (fixed 50% of Total RAM for legacy)
        if any(x in hardware.gpu_model.lower() for x in ["iris xe", "arc"]):
            ppgtt_limit = effective_budget * 0.7
        else:
            # Legacy Intel GPUs - fixed 50% of Total RAM
            gtt_limit = total_ram_gb * 0.5
    
    # Build clean, structured string for downstream LLM + RAG prompt
    memory_info = f"""Especificaciones Técnicas del Hardware:
- Memoria RAM Total: {total_ram_gb:.1f}GB
- Memoria RAM Libre (Steady State): {free_ram_gb:.1f}GB
- Margen de Seguridad del Sistema: {safety_margin:.1f}GB
- Presupuesto Efectivo para IA: {effective_budget:.1f}GB
- Nivel de GPU (Tier): {gpu_tier}
- Fabricante Detectado: {vendor}

Recomendaciones de Asignación de Memoria:
- Límite TTM (AMD Optimizado): {ttm_limit:.1f}GB
- Límite PPGTT (Intel Iris/Xe): {ppgtt_limit:.1f}GB
- Límite GTT (Intel Legacy): {gtt_limit:.1f}GB"""

    return memory_info.strip()

class RegisterHardwareSpecs:
    def __init__(self, hardware_repo: HardwareSpecsRepository, model_repo: ModelSpecsRepository):
        self.hardware_repo = hardware_repo
        self.model_repo = model_repo

    def execute(self, hardware_dto: HardwareSpecsDTO) -> tuple[list[ModelSpecs], str]:
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
        models = self.model_repo.get_model_specs(hardware)
        memory_info = calculate_memory_allocation(hardware)
        return models, memory_info
