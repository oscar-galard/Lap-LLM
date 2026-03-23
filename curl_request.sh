#!/bin/bash

curl -X POST "http://localhost:8000/hardware-specs/" \
     -H "Content-Type: application/json" \
     -d '{
           "cpu_model": "AMD Ryzen 7 PRO 4750U",
           "total_ram": 29783,
           "used_ram": 700,
           "free_ram": 28588,
           "os": "Gentoo Linux",
           "free_storage": 331,
           "gpu_model": "Advanced Micro Devices, Inc. [AMD/ATI] Renoir [Radeon Vega Series / Radeon Vega Mobile Series] (rev d1)",
           "is_dual_channel": true
         }'