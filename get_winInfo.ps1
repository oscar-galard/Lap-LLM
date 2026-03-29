# Script equivalente para Windows (PowerShell)
Clear-Host

Write-Host "Nota: Se recomienda ejecutar como Administrador para obtener detalles completos." -ForegroundColor Yellow

# --- Obtener Información del OS ---
$os_info = (Get-WmiObject Win32_OperatingSystem).Caption

# --- Obtener Información de la CPU ---
$cpu_info = (Get-WmiObject Win32_Processor).Name

# --- Obtener Información de la GPU ---
$gpu_info = (Get-WmiObject Win32_VideoController).Name -join ", "

# --- Obtener Información de la RAM ---
$memStats = Get-CimInstance Win32_OperatingSystem
$totalRAM = [Math]::Round($memStats.TotalVisibleMemorySize / 1KB, 0)
$freeRAM = [Math]::Round($memStats.FreePhysicalMemory / 1KB, 0)
$usedRAM = $totalRAM - $freeRAM
$ram_report = "$usedRAM/$totalRAM ($freeRAM free)"

# --- Obtener Canales de RAM (Lógica equivalente a dmidecode) ---
$memSlots = Get-WmiObject Win32_PhysicalMemory
$slotCount = $memSlots.Count
$channels = $memSlots | Select-Object -ExpandProperty BankLabel | Out-String

if ($channels -like "*Channel A*" -and $channels -like "*Channel B*") {
    $channel_info = "Dual Channel detected"
} elseif ($slotCount -gt 1) {
    $channel_info = "Multi-slot detected ($slotCount sticks)"
} else {
    $channel_info = "Single Channel or SMBIOS restricted"
}

# --- Obtener Espacio en Disco (C:) ---
$disk = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
$disk_free = [Math]::Round($disk.FreeSpace / 1GB, 0)

# --- Output ---
Write-Host "`n======= Lap-LLM Hardware Report =======" -ForegroundColor Cyan
Write-Host "OS: $os_info"
Write-Host "CPU: $cpu_info"
Write-Host "GPU: $gpu_info"
Write-Host "RAM: $ram_report"
Write-Host "RAM Channel: $channel_info"
Write-Host "Disk free: $disk_free"
Write-Host "=======================================" -ForegroundColor Cyan

# --- User Guidance ---
Write-Host "`n[ACTION REQUIRED]" -ForegroundColor Green
Write-Host "El reporte es el codigo en medio de los signos ====."
Write-Host "Copia el reporte de arriba y pegalo en el Paso 2 de lap-llm."