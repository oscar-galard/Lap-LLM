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

class InMemoryModelSpecsRepository(ModelSpecsRepository):
    def __init__(self):
        self.models = []
        self.load_models_from_json("/home/oscar/projects/lap-llm/backend/infrastructure/models.json")

    def load_models_from_json(self, json_file_path: str):
        # Load models from JSON file (handling the format with multiple objects)
        with open(json_file_path, 'r') as f:
            content = f.read()
            
            # Split by double newlines to separate individual JSON objects
            objects = content.strip().split('\n\n')
            
            for obj_str in objects:
                if obj_str.strip():
                    try:
                        model_data = json.loads(obj_str)
                        model_name = model_data["model"]
                        link = model_data["link"]
                        quantizations = model_data["quantizations"]

                        # Create ModelSpecs for each quantization
                        for quant in quantizations:
                            self.models.append(ModelSpecs(
                                model_name=model_name,
                                quantization=quant["method"],
                                offload_size=int(float(quant["size"].split()[0]))  # Extract numeric size
                            ))
                    except json.JSONDecodeError:
                        # Skip invalid JSON lines
                        continue

    def get_model_specs(self, hardware_specs: HardwareSpecs) -> list[ModelSpecs]:
        # Filter models based on hardware specs (RAM constraint)
        filtered_models = []
        free_ram_gb = hardware_specs.free_ram / 1024
        
        for model in self.models:
            # Only include models that fit within available RAM
            if model.offload_size <= free_ram_gb:
                filtered_models.append(model)
        
        return filtered_models
