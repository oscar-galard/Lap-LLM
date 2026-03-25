# LAP-LLM Backend

Backend service for LLM optimization recommendations based on hardware specifications.

## Features

- Hardware specification analysis
- Model recommendations based on available resources
- RAG system with pgvector for PDF processing
- Deterministic VRAM calculation for AMD and Intel GPUs

## Setup

### Prerequisites

1. Python 3.13+
2. PostgreSQL with pgvector extension
3. Docker (optional, for easy setup)

### Installation

1. Install dependencies:
```bash
pip install -e .
```

2. Set up environment variables in `.env`:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/lap_llm
PDF_PATH=/path/to/your/research.pdf
```

3. Set up PostgreSQL with pgvector:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Running the Application

```bash
uvicorn main:app --reload
```

## API Endpoints

- `POST /hardware-specs/` - Register hardware specifications and get recommendations
- `GET /models/` - Get recommended models for current hardware
- `GET /models/recommendations/?preference=speed` - Get model recommendations based on preference (speed/trustability)

## Mathematical Framework for Memory Management

For AMD GPUs, we implement a deterministic VRAM calculation framework that:
1. Calculates dynamic availability (RAM_free - safety_margin)
2. Computes total inference requirements (model_weights + KV_cache + overhead)
3. Converts to TTM pages for AMD-specific memory management
4. Provides recommendations based on available VRAM

For Intel GPUs, we provide theoretical recommendations since BIOS modification is required for VRAM increases.

## RAG System with pgvector

This system uses a RAG (Retrieval-Augmented Generation) approach with pgvector for processing PDF research documents:

1. PDF content is loaded and split into chunks
2. Each chunk is embedded using OpenAI embeddings
3. Embeddings are stored in PostgreSQL with pgvector extension
4. When generating recommendations, relevant chunks are retrieved based on hardware specifications
5. These chunks are then used as context for generating recommendations

### Database Setup

To set up PostgreSQL with pgvector:

1. Install PostgreSQL
2. Install pgvector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PDF_PATH`: Path to the research PDF file

## Curl Command and Output example JSON
```bash
curl -X POST "http://localhost:8000/hardware-specs/" \
     -H "Content-Type: application/json" \
     -d '{
           "cpu_model": "Intel Core i3-10110U",
           "total_ram": 8192,
           "used_ram": 3800,
           "free_ram": 4392,
           "os": "Ubuntu 24.04 LTS",
           "free_storage": 52,
           "gpu_model": "Intel Corporation CometLake-U GT2 [UHD Graphics]",
           "is_dual_channel": false
         }'
```

```json
{
"message":"Hardware specifications registered successfully",
"memory_info":"Especificaciones Técnicas del Hardware:\n- Memoria RAM Total: 8.0GB\n- Memoria RAM Libre (Steady State): 4.3GB\n- Margen de Seguridad del Sistema: 0.2GB\n- Presupuesto Efectivo para IA: 4.0GB\n- Nivel de GPU (Tier): 0.4\n- Fabricante Detectado: Intel\n\nRecomendaciones de Asignación de Memoria:\n- Límite TTM (AMD Optimizado): 0.0GB\n- Límite PPGTT (Intel Iris/Xe): 0.0GB\n- Límite GTT (Intel Legacy): 4.0GB\n\nCálculos Específicos para el Modelo:\n- Requisito Total de VRAM: 18.9GB\n- Límite TTM (AMD Optimizado): N/A\n- Límite PPGTT (Intel Iris/Xe): N/A\n- Límite GTT (Intel Legacy): 4.0GB\n\nRecomendación de Ejecución:\n- El modelo puede ejecutarse en este hardware: NO\n\nRecomendaciones de Modelos:\nSe recomiendan los siguientes modelos para mayor confiabilidad:\n- Qwen2.5-Coder-7B-Instruct-GGUF (Q3_K_M) - 3.8GB\n- deepseek-coder (Ollama) (6.7b) - 3.8GB\n- StarCoder2-3B-GGUF (Q8_0) - 3.2GB\n\nNota: El límite de VRAM asignable es de aproximadamente 4.0GB. Estos modelos utilizan el máximo espacio disponible para ofrecer la mejor calidad.",
"recommendations":"1. **Modelos a Utilizar:**\n * **Qwen2.5-Coder-7B-Instruct-GGUF (Q3_K_M) - 3.8GB**\n * **deepseek-coder (Ollama) (6.7b) - 3.8GB**\n * **StarCoder2-3B-GGUF (Q8_0) - 3.2GB**\n * Estos modelos caben en el presupuesto de **4.0GB** porque su tamaño de archivo es menor o igual a ese límite.\n\n2. **Configuración del Sistema y GPU (Intel):**\n * **Límite de VRAM:** La iGPU Intel está limitada a usar aproximadamente el **50% de la RAM física total** como memoria gráfica máxima.\n * **Configuración del Kernel:** El límite es configurable mediante parámetros del kernel. Para un sistema con 8GB de RAM, el límite práctico sería ~4GB (50% de 8GB).\n * **Parámetro a ajustar:** Debes configurar el parámetro del kernel `i915` para aumentar la asignación de memoria GTT (Graphics Translation Table) hasta el máximo permitido (~80% de la RAM, pero el límite efectivo reportado es del 50%).\n * **Ejemplo de configuración:** Añadir `i915.gtt_size=<tamaño_en_MB>` a los parámetros de arranque del kernel (ej. en GRUB). Para acercarte al límite de 4GB, podrías probar con `i915.gtt_size=3072` (3GB) o `i915.gtt_size=3584` (3.5GB), ya que el límite absoluto del hardware es 4.0GB."
}
```
