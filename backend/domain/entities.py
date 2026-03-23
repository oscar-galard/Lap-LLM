from dataclasses import dataclass
from typing import Optional

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
    offload_size: int
