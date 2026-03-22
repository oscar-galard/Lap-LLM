from dataclases import dataclass

@dataclass
class HardwareSpecs:
    cpu_model: str
    total_ram: int
    used_ram: int
    free_ram: int
    os: str
    free_storage: int

@dataclass
class ModelSpecs:
    model_name: str
    quantization: str
    offload_size: int
