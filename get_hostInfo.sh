#!/bin/bash

echo "Nota: El acceso directo a las tablas SMBIOS (vía dmidecode) requiere permisos de superusuario para una auditoría de hardware completa."

# Check for sudo/doas and set prefix
if command -v sudo >/dev/null 2>&1; then
    PRIVILEGE_PREFIX="sudo"
elif command -v doas >/dev/null 2>&1; then
    PRIVILEGE_PREFIX="doas"
else
    PRIVILEGE_PREFIX=""
fi

# Get RAM info
read total used free _ <<< $(free -m | awk 'NR==2{print $2,$3,$4}')
ram_info="${used}/${total} (${free} free)"

# Get GPU info
gpu_info=$(lspci -k | grep -i vga | cut -d: -f3- | head -1)

# Get CPU info (important for LLMs)
cpu_info=$(grep -m1 "model name" /proc/cpuinfo | cut -d: -f2)

# Get available disk space
disk_info=$(df -h / | awk 'NR==2{print $4}')

# Get OS info
os_info=$(grep -E "^PRETTY_NAME" /etc/os-release | cut -d= -f2 | tr -d '"')

# Check if we can determine channel configuration
if command -v dmidecode >/dev/null 2>&1; then
    if ${PRIVILEGE_PREFIX} dmidecode -t memory 2>/dev/null | grep -q "CHANNEL A" && \
       ${PRIVILEGE_PREFIX} dmidecode -t memory 2>/dev/null | grep -q "CHANNEL B"; then
        channel_info="RAM Channel: Dual Channel detected"
    elif ${PRIVILEGE_PREFIX} dmidecode -t memory 2>/dev/null | grep -q "Channel"; then
        channel_info="RAM Channel: Detected via SMBIOS"
    else
        channel_info="RAM Channel: Not detected"
    fi
else
    channel_info="RAM Channel: dmidecode not available"
fi

# --- Output ---
echo -e "\n\e[1;34m======= Lap-LLM Hardware Report =======\e[0m"
echo -e "\e[1mOS:\e[0m $os_info"
echo -e "\e[1mCPU:\e[0m $cpu_info"
echo -e "\e[1mGPU:\e[0m $gpu_info"
echo -e "\e[1mRAM:\e[0m $ram_info"
echo -e "\e[1mRAM Channel:\e[0m $channel_info"
echo -e "\e[1mDisk free:\e[0m $disk_info available on /"
echo -e "\e[1;34m=======================================\e[0m"

# --- User Guidance ---
echo -e "\n\e[1;32m[ACTION REQUERIDA]\e[0m"
echo "El reporte es el codigo en medio de los signos ====."
echo "Copia el reporte de arriba y pegalo en el Paso 2 de lap-llm."
