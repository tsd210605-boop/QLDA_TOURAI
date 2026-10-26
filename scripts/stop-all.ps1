# scripts/stop-all.ps1
$ports = @(8080, 8081, 8082, 8083, 8084, 3000, 3001)
$found = $false

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $found = $true
        $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($p in $pids) {
            if ($p -gt 0) {
                try {
                    Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                    Write-Host "[OK] Da giai phong cong $port (PID: $p)" -ForegroundColor Green
                } catch {
                    Write-Host "[!] Khong the dung PID ${p} - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
    }
}

if (-not $found) {
    Write-Host "[INFO] Khong co tien trinh nao dang chiem cac cong tren." -ForegroundColor Yellow
}
