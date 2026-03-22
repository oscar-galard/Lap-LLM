from domain.entities import HardwareSpecs, ModelSpecs
from domain.ports import HardwareSpecsRepository, ModelSpecsRepository
from presentation.dto import HardwareSpecsDTO

class RegisterHardwareSpecs:
    def __init__(self, hardware_repo: HardwareSpecsRepository, model_repo: ModelSpecsRepository):
        self.hardware_repo = hardware_repo
        self.model_repo = model_repo

    def execute(self, hardware_dto: HardwareSpecsDTO) -> list[ModelSpecs]:
        hardware = HardwareSpecs(
            cpu_model=hardware_dto.cpu_model,
            total_ram=hardware_dto.total_ram,
            used_ram=hardware_dto.used_ram,
            free_ram=hardware_dto.free_ram,
            os=hardware_dto.os,
            free_storage=hardware_dto.free_storage
        )
        self.hardware_repo.save(hardware)
        return self.model_repo.get_model_specs(hardware)
