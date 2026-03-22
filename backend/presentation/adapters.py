from domain.entities import HardwareSpecs, ModelSpecs
from domain.ports import HardwareSpecsRepository, ModelSpecsRepository

class InMemoryHardwareSpecsRepository(HardwareSpecsRepository):
    def __init__(self):
        self.specs = {}

    def save(self, specs: HardwareSpecs):
        self.specs["current"] = specs

    def get_hardware_specs(self) -> HardwareSpecs:
        return self.specs.get("current")

class InMemoryModelSpecsRepository(ModelSpecsRepository):
    def __init__(self):
        self.models = [
            ModelSpecs(model_name="llama3-8b", quantization="Q4", offload_size=4000),
            ModelSpecs(model_name="mistral-7b", quantization="Q5", offload_size=3000),
        ]

    def get_model_specs(self, hardware_specs: HardwareSpecs) -> list[ModelSpecs]:
        # You can filter models based on hardware
        return self.models
