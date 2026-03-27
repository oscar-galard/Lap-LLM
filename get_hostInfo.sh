#!/bin/bash

# Get RAM info
read total used free _ <<< $(free -m | awk 'NR==2{print $2,$3,$4}')
echo "RAM: ${used}/${total} (${free} free)"

# Get GPU info
lspci -k | grep -i vga | cut -d: -f3- | head -1 | sed 's/^/GPU: /'

# Get CPU info (important for LLMs)
echo -n "CPU: "
grep -m1 "model name" /proc/cpuinfo | cut -d: -f2 

# Get available disk space
echo -n "Disk free: "
df -h / | awk 'NR==2{print $4}'

# Get OS info
echo -n "OS: "
grep -E "^PRETTY_NAME" /etc/os-release | cut -d= -f2 | tr -d '"'

# Check if we can determine channel configuration
if command -v dmidecode >/dev/null 2>&1; then
    if dmidecode -t memory 2>/dev/null | grep -q "CHANNEL A" && \
       dmidecode -t memory 2>/dev/null | grep -q "CHANNEL B"; then
        echo "RAM Channel: Dual Channel detected"
    elif dmidecode -t memory 2>/dev/null | grep -q "Channel"; then
        echo "RAM Channel: Detected via SMBIOS"
    else
        echo "RAM Channel: Not detected"
    fi
else
    echo "RAM Channel: dmidecode not available"
fi
