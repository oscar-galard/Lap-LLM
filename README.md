# lap-llm 💻🧠 [Hacker Edition]

![Lap-LLM imagen](https://i.postimg.cc/QNwYHtnf/2026-03-25-215323-scrot.png)

> **"Hackeando los límites del Kernel para ejecutar modelos de 30B en la laptop que ya tienes."**

---

## 🚀 La Visión: Soberanía o Renta

¿Qué pasa si no tienes una GPU de $2,000 USD? ¿Qué pasa si lo único que tienes es una laptop normal con gráficos integrados (iGPU)? 

En la mayor parte de internet, la respuesta es: "Paga una suscripción o usa la nube". **Lap-LLM dice: NO.**

Logré ejecutar **Qwen3-Coder** localmente en mi laptop y lo uso cada día para programar software real. No es solo un reto técnico; es **Soberanía Digital**. Ser dueño de tus herramientas en lugar de rentarlas.

Este proyecto es la culminación de meses de investigación en **arquitectura de memoria unificada (UMA)**, optimización de drivers en Linux y despliegue de modelos cuantizados en hardware modesto.

---

## 🧠 El Motor: Knowledge-Base RAG

A diferencia de un validador estático, **lap-llm** utiliza un sistema de **Generación Aumentada por Recuperación (RAG)**. El asistente no "adivina"; consulta una base de conocimientos técnica curada por meses que incluye:

* **Papers de Ingeniería de Memoria:** Estrategias para bypass de límites de BIOS en asignación de VRAM.
* **Linux Kernel Tuning:** Documentación profunda sobre `amdgpu.pages_limit`, `ttm_pages_limit` y gestión de buffers GTT/PPGTT.
* **Lista Curada de Modelos:** Una lista curada personalmente, con modelos pensados para el programador.
* **Soberanía de Hardware:** Guías de configuración para ROCm/SYCL y Ollama optimizados para iGPUs.

---

## 🛠️ Qué hace lap-llm

![Lap-LLM workflow](https://i.postimg.cc/MZ0221Gt/2026-03-25-215351-scrot.png)

Es un **Orquestador de Viabilidad** que analiza tu hardware y, mediante el RAG, te entrega un diagnóstico de grado de ingeniería:

* **VRAM Expansion Logic:** Te guía para reclamar hasta el 90% de tu RAM física como memoria de video funcional.
* **Model Selection Matrix:** Filtra modelos específicos (como Qwen3, Phi-4 o MoE avanzados) que tu máquina puede manejar con dignidad.
* **Diagnóstico de Kernel:** Genera serie de recomendaciones para tunear tu sistema (Gentoo, Arch, Ubuntu) y optimizar el driver de video.
* **Optimización de Contexto:** Calcula el tamaño de ventana (KV Cache) óptimo para evitar el *swapping* y mantener la velocidad.

> **"No son benchmarks teóricos de servidor. Es orientación real para laptops reales."**

---

## 🔧 Hardcore Features

* **Análisis Directo del sistema:** Lee el estado real de tu hardware, no lo que dice el marketing.
* **Integración ROCm/Ollama:** Te da las recomendaciones para optimizar tu sistema.
* **Algebraic Core:** El cálculo de los límites de asignación de RAM, el tamaño del KV Cache y la ventana de contexto no son "opiniones" de un LLM. He desarrollado un motor algebraico que resuelve estas variables de forma determinista antes de la inferencia, asegurando estabilidad y evitando el *Kernel Panic*.

---

## 🚧 Estado del Proyecto

Actualmente en desarrollo activo para la **Hackatón CubePath 2026**.  
*Basado en la investigación de optimización de memoria para el proyecto de IA.*

---

## ⚖️ Filosofía

Si tu computadora puede programar, navegar o reproducir video... **debería poder pensar.** La IA local no es un lujo, es un derecho técnico. **Lap-LLM es el interruptor para despertar tu hardware.**

---

## 📄 Licencia

MIT License. 2026 Oscar Rodrigo Gallardo López.
