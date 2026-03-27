from pydantic import BaseModel, Field, field_validator
from typing import Optional

class HardwareSpecsDTO(BaseModel):
    cpu_model: str = Field(..., max_length=100, description="Modelo del CPU")
    total_ram: int = Field(..., ge=0, le=1024*1024, description="RAM Total en MB")
    used_ram: int = Field(..., ge=0, le=1024*1024, description="RAM Usada en MB")
    free_ram: int = Field(..., ge=0, le=1024*1024, description="RAM Libre en MB")
    os: str = Field(..., max_length=100, description="Sistema Operativo")
    free_storage: int = Field(..., ge=0, le=500000, description="Almacenamiento libre")
    gpu_model: str = Field(..., max_length=100, description="Modelo de la GPU")
    is_dual_channel: bool = Field(..., description="¿Es Dual Channel?")
    performance_preference: Optional[str] = Field("trustability", max_length=20)

    @field_validator("performance_preference")
    @classmethod
    def validate_preference(cls, v):
        if v and v not in ("speed", "trustability"):
            raise ValueError("performance_preference must be 'speed' or 'trustability'")
        return v
