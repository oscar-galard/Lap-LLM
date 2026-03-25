from pydantic import BaseModel
from typing import Optional

class HardwareSpecsDTO(BaseModel):
    cpu_model: str
    total_ram: int
    used_ram: int
    free_ram: int
    os: str
    free_storage: int
    gpu_model: str
    is_dual_channel: bool
    performance_preference: Optional[str] = "trustability"  # "speed" or "trustability"
