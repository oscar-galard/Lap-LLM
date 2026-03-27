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
        self.load_models_from_json("/app/infrastructure/models.json")

    def load_models_from_json(self, json_file_path: str):
        # Load models from JSON file (properly formatted JSON array)
        with open(json_file_path, 'r') as f:
            try:
                data = json.load(f)

                for model_data in data:
                    model_name = model_data["model"]
                    link = model_data["link"]
                    quantizations = model_data["quantizations"]

                    # Create ModelSpecs for each quantization
                    for quant in quantizations:
                        # Convert MB to GB for storage (since we're working with GB in the rest of the system)
                        size_mb = quant["size_mb"]
                        size_gb = size_mb / 1024
                        
                        self.models.append(ModelSpecs(
                            model_name=model_name,
                            quantization=quant["method"],
                            offload_size=size_gb  # Store as GB for consistency with VRAM calculations
                        ))
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON: {e}")
                # Initialize with empty list if parsing fails
                self.models = []

    def get_model_specs(self, hardware_specs: HardwareSpecs) -> list[ModelSpecs]:
        # Filter models based on hardware specs (RAM constraint)
        filtered_models = []
        free_ram_gb = hardware_specs.free_ram / 1024

        for model in self.models:
            # Only include models that fit within available RAM
            if model.offload_size <= free_ram_gb:
                filtered_models.append(model)

        return filtered_models
