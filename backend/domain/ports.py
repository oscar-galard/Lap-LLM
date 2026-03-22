from abc import ABC, abstractmethod
from typing import List
from domain.entities import HardwareSpecs, ModelSpecs

class HardwareSpecsRepository(ABC):
    @abstractmethod
    def get_hardware_specs(self) -> HardwareSpecs:
        pass

class ModelSpecsRepository(ABC):
    @abstractmethod
    def get_model_specs(self, hardware_specs: HardwareSpecs) -> List[ModelSpecs]:
        pass
