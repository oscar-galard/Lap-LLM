from dataclasses import dataclass
from typing import Optional, List

@dataclass
class HardwareSpecs:
    cpu_model: str
    total_ram: int
    used_ram: int
    free_ram: int
    os: str
    free_storage: int
    gpu_model: str
    is_dual_channel: Optional[bool]

@dataclass
class ModelSpecs:
    model_name: str
    quantization: str
    offload_size: float

@dataclass
class VRAMCalculationResult:
    usable_vram: float  # GB
    required_vram: float  # GB
    ttm_pages: int  # Number of 4KB pages
    recommended_models: List[ModelSpecs]
    memory_info: str
