#!/bin/bash

# Get RAM info
read total used free _ <<< $(free -m | awk 'NR==2{print $2,$3,$4}')
echo "RAM: ${used}M (used)/${total}M (total) (${free}M free)"

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
