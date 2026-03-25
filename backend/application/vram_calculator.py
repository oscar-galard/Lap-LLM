from typing import Dict, Tuple, List
from dataclasses import dataclass
from domain.entities import HardwareSpecs, ModelSpecs, VRAMCalculationResult

def calculate_dynamic_availability(hardware: HardwareSpecs) -> float:
    free_ram_gb = hardware.free_ram / 1024
    total_ram_gb = hardware.total_ram / 1024
    safety_margin = total_ram_gb * 0.03
    return free_ram_gb - safety_margin

def calculate_total_inference_requirement(model_size_gb: float, kv_cache_gb: float, 
                                        overhead_gb: float = 1.0) -> float:
    return model_size_gb + kv_cache_gb + overhead_gb

def convert_to_ttm_pages(vram_gb: float) -> int:
    # Convert GB to KB, then to pages (4KB = 4096 bytes = 4KB)
    return int((vram_gb * 1024 * 1024) / 4)

def calculate_amd_vram_limits(hardware: HardwareSpecs) -> Dict[str, float]:
    # Simplified GPU tier classification for AMD
    gpu_name = hardware.gpu_model.lower()
    
    # Determine GPU tier based on model name
    if "rx" in gpu_name or "ai" in gpu_name:
        # High-end AMD GPUs
        tier = 1.0
    elif "radeon" in gpu_name:
        # Mid-range AMD GPUs
        tier = 0.7
    else:
        # Low-end or unknown AMD GPUs
        tier = 0.4
    
    # Calculate TTM limit (up to 90% of usable VRAM for high-tier GPUs)
    usable_vram = calculate_dynamic_availability(hardware)
    if tier >= 0.7:
        ttm_limit = usable_vram * 0.9
    else:
        # Conservative limit for lower-tier GPUs
        ttm_limit = usable_vram * 0.5
    
    return {
        "ttm_limit": ttm_limit,
        "gpu_tier": tier
    }


def calculate_intel_vram_limits(hardware: HardwareSpecs) -> Dict[str, float]:
    gpu_name = hardware.gpu_model.lower()
    
    # Check for Iris Xe or Arc GPUs (which support PPGTT)
    if any(x in gpu_name for x in ["iris xe", "arc"]):
        # For newer Intel GPUs, use PPGTT limit (70% of usable VRAM)
        usable_vram = calculate_dynamic_availability(hardware)
        ppgtt_limit = usable_vram * 0.7
        return {
            "ppgtt_limit": ppgtt_limit,
            "gtt_limit": 0.0,
            "gpu_tier": 0.7 if "iris xe" in gpu_name else 1.0
        }
    else:
        # For legacy Intel GPUs, use fixed 50% of total RAM
        total_ram_gb = hardware.total_ram / 1024
        gtt_limit = total_ram_gb * 0.5
        return {
            "ppgtt_limit": 0.0,
            "gtt_limit": gtt_limit,
            "gpu_tier": 0.4
        }

def generate_hardware_memory_info(hardware: HardwareSpecs) -> str:
    usable_vram = calculate_dynamic_availability(hardware)
    total_ram_gb = hardware.total_ram / 1024
    free_ram_gb = hardware.free_ram / 1024
    safety_margin = total_ram_gb * 0.03
    
    vendor = "AMD" if "amd" in hardware.gpu_model.lower() else "Intel" if "intel" in hardware.gpu_model.lower() else "Unknown"
    
    ttm_limit = 0.0
    ppgtt_limit = 0.0
    gtt_limit = 0.0
    gpu_tier = 0.4
    
    if vendor == "AMD":
        limits = calculate_amd_vram_limits(hardware)
        ttm_limit = limits.get("ttm_limit", 0.0)
        gpu_tier = limits.get("gpu_tier", 0.4)
    elif vendor == "Intel":
        limits = calculate_intel_vram_limits(hardware)
        ppgtt_limit = limits.get("ppgtt_limit", 0.0)
        gtt_limit = limits.get("gtt_limit", 0.0)
        gpu_tier = limits.get("gpu_tier", 0.4)
        
    memory_info = f"""Especificaciones Técnicas del Hardware:
- Memoria RAM Total: {total_ram_gb:.1f}GB
- Memoria RAM Libre (Steady State): {free_ram_gb:.1f}GB
- Margen de Seguridad del Sistema: {safety_margin:.1f}GB
- Presupuesto Efectivo para IA: {usable_vram:.1f}GB
- Nivel de GPU (Tier): {gpu_tier}
- Fabricante Detectado: {vendor}

Recomendaciones de Asignación de Memoria:
- Límite TTM (AMD Optimizado): {ttm_limit:.1f}GB
- Límite PPGTT (Intel Iris/Xe): {ppgtt_limit:.1f}GB
- Límite GTT (Intel Legacy): {gtt_limit:.1f}GB"""

    return memory_info.strip()

def calculate_vram_requirements(hardware: HardwareSpecs, model: ModelSpecs) -> VRAMCalculationResult:
    # Model-specific constants (based on study analysis)
    # For Qwen3-30B with 8k context and FP16 precision
    model_weights_gb = 16.4  # W_model
    kv_cache_gb = 1.5  # KV_cache for 8k context, FP16
    overhead_gb = 1.0  # Buffer overhead
    
    # Calculate total VRAM requirement
    required_vram = calculate_total_inference_requirement(
        model_weights_gb, kv_cache_gb, overhead_gb
    )
    
    # Calculate usable VRAM
    usable_vram = calculate_dynamic_availability(hardware)
    
    # Convert to TTM pages for AMD systems
    ttm_pages = convert_to_ttm_pages(required_vram)
    
    # Determine vendor and calculate appropriate limits
    vendor = "AMD" if "amd" in hardware.gpu_model.lower() else "Intel" if "intel" in hardware.gpu_model.lower() else "Unknown"
    
    # Initialize recommendation flag
    can_run = required_vram <= usable_vram
    
    ttm_limit_str = 'N/A'
    ppgtt_limit_str = 'N/A'
    gtt_limit_str = 'N/A'
    
    if vendor == "AMD":
        limits = calculate_amd_vram_limits(hardware)
        ttm_limit_str = f"{limits.get('ttm_limit', 0.0):.1f}GB (máximo), requiriendo {ttm_pages:,} páginas (4KB cada una)"
    elif vendor == "Intel":
        limits = calculate_intel_vram_limits(hardware)
        if limits.get("ppgtt_limit", 0.0) > 0:
            ppgtt_limit_str = f"{limits.get('ppgtt_limit', 0.0):.1f}GB"
        if limits.get("gtt_limit", 0.0) > 0:
            gtt_limit_str = f"{limits.get('gtt_limit', 0.0):.1f}GB"

    # Reutilizamos la función base para el texto del hardware
    base_memory_info = generate_hardware_memory_info(hardware)

    # Añadimos los detalles específicos del modelo
    model_specific_info = f"""
Cálculos Específicos para el Modelo:
- Requisito Total de VRAM: {required_vram:.1f}GB
- Límite TTM (AMD Optimizado): {ttm_limit_str}
- Límite PPGTT (Intel Iris/Xe): {ppgtt_limit_str}
- Límite GTT (Intel Legacy): {gtt_limit_str}

Recomendación de Ejecución:
- El modelo puede ejecutarse en este hardware: {'SÍ' if can_run else 'NO'}
"""
    
    memory_info = f"{base_memory_info}\n{model_specific_info}"
    
    # Return result with recommended models
    recommended_models = [model] if can_run else []
    
    return VRAMCalculationResult(
        usable_vram=usable_vram,
        required_vram=required_vram,
        ttm_pages=ttm_pages,
        recommended_models=recommended_models,
        memory_info=memory_info.strip()
    )


def get_model_recommendations(hardware: HardwareSpecs, models: List[ModelSpecs], 
                             preference: str = "trustability") -> Tuple[List[ModelSpecs], str]:
    # Calculate VRAM for each model
    model_results = []
    usable_vram = calculate_dynamic_availability(hardware)
    
    # Determine the appropriate limit based on GPU vendor
    gpu_name = hardware.gpu_model.lower()
    if "amd" in gpu_name:
        # For AMD, we can use the TTM limit concept
        # Using 50% of usable VRAM as a balanced threshold
        limit_threshold = usable_vram * 0.5
    elif "intel" in gpu_name:
        # For Intel, use 70% of usable VRAM as a conservative limit
        limit_threshold = usable_vram * 0.7
    else:
        # Default to 50% for unknown vendors
        limit_threshold = usable_vram * 0.5
    
    for model in models:
        # Check if model can run on this hardware
        can_run = model.offload_size <= usable_vram
        
        model_results.append({
            "model": model,
            "required_vram": model.offload_size,
            "can_run": can_run
        })
    
    # Filter models that can run
    runnable_models = [result["model"] for result in model_results if result["can_run"]]
    
    # Sort models based on preference
    if preference == "speed":
        # For speed preference, we want models that are reasonably sized
        # but still offer good performance - not just the smallest ones
        runnable_models.sort(key=lambda m: m.offload_size)
        
        # Filter models to be within 50% of the usable VRAM limit
        # This gives us a balanced approach - not too small, not too large
        filtered_models = [m for m in runnable_models if m.offload_size <= limit_threshold]
        
        # If we have models within the threshold, select the best 3
        # Otherwise, select the first 3 models that fit
        if filtered_models:
            recommended_models = filtered_models[:3]
        else:
            # If no models fit within the threshold, take the first 3 that fit
            recommended_models = runnable_models[:3] if runnable_models else []
    else:  # trustability
        # Sort by size descending (largest first) for trustability
        runnable_models.sort(key=lambda m: m.offload_size, reverse=True)
        recommended_models = runnable_models[:3]  # Top 3 largest models
    
    # Create explanation text
    if not recommended_models:
        explanation = "No hay modelos que puedan ejecutarse en este hardware con las especificaciones actuales."
    else:
        if preference == "speed":
            explanation = f"Se recomiendan los siguientes modelos para un buen equilibrio entre velocidad y capacidad:\n"
            explanation += "\n".join([f"- {m.model_name} ({m.quantization}) - {m.offload_size:.1f}GB" 
                                    for m in recommended_models])
            # Add note about VRAM considerations
            explanation += f"\n\nNota: El límite de VRAM asignable es de aproximadamente {usable_vram:.1f}GB. "
            explanation += f"Los modelos recomendados están dentro del rango de 0 a {limit_threshold:.1f}GB para optimizar el rendimiento."
        else:  # trustability
            explanation = f"Se recomiendan los siguientes modelos para mayor confiabilidad:\n"
            explanation += "\n".join([f"- {m.model_name} ({m.quantization}) - {m.offload_size:.1f}GB" 
                                    for m in recommended_models])
            # Add note about VRAM considerations
            explanation += f"\n\nNota: El límite de VRAM asignable es de aproximadamente {usable_vram:.1f}GB. "
            explanation += "Estos modelos utilizan el máximo espacio disponible para ofrecer la mejor calidad."
    
    return recommended_models, explanation
