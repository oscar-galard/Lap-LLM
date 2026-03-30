# lap-llm 💻🧠 [Linux Hacker Edition]

**🌐 [Visita el sitio web →](https://lap-llm.vestaagentic.com/)**

![Lap-LLM imagen](https://i.postimg.cc/QNwYHtnf/2026-03-25-215323-scrot.png)

> **"Hackeando los límites del Kernel para ejecutar modelos de 30B en la laptop que ya tienes."**

---

## 🚀 La Visión: Soberanía o Renta

¿Qué pasa si no tienes una GPU de $2,000 USD? ¿Qué pasa si lo único que tienes es una laptop normal con gráficos integrados (iGPU)? 

En la mayor parte de internet, la respuesta es: "Paga una suscripción o usa la nube". **Lap-LLM dice: NO.**

Logré ejecutar **Qwen3-Coder** localmente en mi laptop y lo uso cada día para programar software real. No es solo un reto técnico; es **Soberanía Digital**. Ser dueño de tus herramientas en lugar de rentarlas.

### 🐧 Por qué Linux es el "Game Changer"
Este proyecto es la culminación de meses de investigación en **arquitectura de memoria unificada (UMA)**, optimización de drivers en Linux y despliegue de modelos cuantizados en hardware modesto. Si bien lap-llm te dará un diagnóstico en cualquier sistema, la verdadera magia ocurre en el Kernel. Mientras que en otros OS imponen límites arbitrarios de reserva de VRAM para sus iGPUs, en Linux tú puedes ganar el control. Lap-LLM está diseñado para quienes están listos para dejar de ser "usuarios" y convertirse en "administradores", tuneando drivers y parámetros de memoria que otros sistemas bloquean.

---

## 🧠 El Motor: Knowledge-Base RAG

A diferencia de un validador estático, **lap-llm** utiliza un sistema de **Generación Aumentada por Recuperación (RAG)**. El asistente no "adivina"; consulta una base de conocimientos técnica curada por meses que incluye:

* **Papers de Ingeniería de Memoria:** Estrategias para bypass de límites de BIOS en asignación de VRAM.
* **Linux Kernel Tuning:** Documentación profunda sobre `amdgpu.pages_limit`, `ttm_pages_limit` y gestión de buffers GTT/PPGTT.
* **Lista Curada de Modelos:** Una lista curada personalmente, con modelos pensados para el programador.
* **Soberanía de Hardware:** Guías de configuración para ROCm/SYCL y Ollama optimizados para iGPUs.

---

## 🛠️ Qué hace lap-llm

![Lap-LLM workflow](https://i.postimg.cc/qq0Q8VGL/2026-03-27-152348-scrot.png)

Es un **Orquestador de Viabilidad** que analiza tu hardware y, mediante el RAG, te entrega un diagnóstico de grado de ingeniería:

* **VRAM Expansion Logic:** Te guía para reclamar hasta el 90% de tu RAM física como memoria de video funcional.
* **Model Selection Matrix:** Filtra modelos específicos (como Qwen3, Phi-4 o MoE avanzados) que tu máquina puede manejar con dignidad.
* **Diagnóstico de Kernel:** Genera serie de recomendaciones para tunear tu sistema (Gentoo, Arch, Ubuntu) y optimizar el driver de video.
* **Optimización de Contexto:** Calcula el tamaño de ventana (KV Cache) óptimo para evitar el *swapping* y mantener la velocidad.

> **"No son benchmarks teóricos de servidor. Es orientación real para laptops reales."**

---

# 🖥️ Cómo probarlo 

**Así funciona:**  
![Lap-LLM imagen](https://i.postimg.cc/MTbMwQ2R/demo.gif)  
1. **Ve al sitio web** y haz clic en "Analizar mi hardware".
2. **Paso 1:** Copia el comando con el boton 📋 y pégalo en tu terminal (Linux/macOS):
Puedes probar el diagnóstico con solo copiar y pegar el ejemplo.
## Ejemplo de salida (para que sepas cómo se ve):
```bash
user@host ~$ curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e
Nota: El acceso directo a las tablas SMBIOS (vía dmidecode) requiere permisos de superusuario para una auditoría de hardware completa.
sudo (usuario@tu_host) password: 

======= Lap-LLM Hardware Report =======
OS: Gentoo Linux
CPU:  AMD Ryzen 7 PRO 4750U with Radeon Graphics
GPU:  Advanced Micro Devices, Inc. [AMD/ATI] Renoir [Radeon Vega Series / Radeon Vega Mobile Series] (rev d1)
RAM: 2183/29783 (26155 free)
RAM Channel: Dual Channel detected
Disk free: 279G available on /
=======================================

[ACTION REQUIRED]
El reporte es el código entre los signos ====.
Copia el reporte de arriba y pégalo en el Paso 2 de lap-llm.
```
3. **Paso 2:** Copia la salida completa que obtengas (o el ejemplo anterior) y pégala en la caja de texto del Paso 2 de lap-llm.
**¡Listo!** El sistema analizará el hardware y te dará recomendaciones personalizadas.

---

## 🔧 Hardcore Features

* **Análisis Directo del sistema:** Lee el estado real de tu hardware, no lo que dice el marketing.
* **Integración ROCm/Ollama:** Te da las recomendaciones para optimizar tu sistema.
* **Algebraic Core:** El cálculo de los límites de asignación de RAM, el tamaño del KV Cache y la ventana de contexto no son "opiniones" de un LLM. He desarrollado un motor algebraico que resuelve estas variables de forma determinista antes de la inferencia, asegurando estabilidad y evitando el *Kernel Panic*.

---

## 🚀 Despliegue con CubePath

Este proyecto está desplegado en **CubePath**, aprovechando su infraestructura developer-friendly para orquestar los servicios de forma eficiente:

- **Instancia GP.MICRO**: Utilicé una instancia de este plan para crear un VPS robusto y económico.
- **Arquitectura con Docker y Traefik**: 
  - **Frontend**: Interfaz desarrollada en React con TypeScript, contenerizada y servida a través de Traefik como reverse proxy.
  - **Backend**: API REST construida en Python con Clean Architecture, también contenerizada y gestionada por Traefik para enrutamiento y balanceo.
- **Experiencia destacada**: CubePath ofrece una experiencia excepcional para desarrolladores, con un proceso de despliegue sencillo, planes completos y un entorno SSH que hace sentir como en casa desde el primer momento. La combinación de simplicidad y potencia me ha motivado a considerar migrar otros proyectos a esta plataforma.

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
