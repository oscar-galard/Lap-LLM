from domain.entities import HardwareSpecs, ModelSpecs
from domain.ports import HardwareSpecsRepository, ModelSpecsRepository
import json

class InMemoryHardwareSpecsRepository(HardwareSpecsRepository):
    def __init__(self):
        self.specs = {}

    def save(self, specs: HardwareSpecs):
        self.specs["current"] = specs

    def get_hardware_specs(self) -> HardwareSpecs:
        return self.specs.get("current")