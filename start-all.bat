@echo off
setlocal EnableDelayedExpansion
title TravelBook - Khoi Dong Toan Bo He Thong
color 0A

echo ===============================================================================
echo          HE THONG DU LICH TRAVELBOOK - KHOI DONG TOAN BO DICH VU
echo ===============================================================================
echo.
echo [LUU Y] Vui long dam bao MySQL dang chay tren cong 3306 (XAMPP / MySQL Server).
echo.

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo [1/6] Khoi dong Auth Service [Port 8081]...
start "TravelBook - Auth Service [8081]" cmd /k "cd /d "%ROOT%\Backend\auth-service" && mvn spring-boot:run"
ping 127.0.0.1 -n 4 >nul

echo [2/6] Khoi dong Destination Service [Port 8083]...
start "TravelBook - Destination Service [8083]" cmd /k "cd /d "%ROOT%\Backend\destination-service" && mvn spring-boot:run"
ping 127.0.0.1 -n 4 >nul

echo [3/6] Khoi dong Packages Service [Port 8084]...
start "TravelBook - Packages Service [8084]" cmd /k "cd /d "%ROOT%\Backend\packages-service" && mvn spring-boot:run"
ping 127.0.0.1 -n 4 >nul

echo [4/6] Khoi dong Booking Service [Port 8082]...
start "TravelBook - Booking Service [8082]" cmd /k "cd /d "%ROOT%\Backend\booking-service" && mvn spring-boot:run"
ping 127.0.0.1 -n 4 >nul

echo [5/6] Khoi dong API Gateway [Port 8080]...
start "TravelBook - API Gateway [8080]" cmd /k "cd /d "%ROOT%\Backend\api-gateway" && mvn spring-boot:run"
ping 127.0.0.1 -n 5 >nul

echo [6/6] Khoi dong Frontend React [Port 3000]...
start "TravelBook - Frontend [3000]" cmd /k "cd /d "%ROOT%\Frontend" && npm start"

echo.
echo ===============================================================================
echo   TAT CA 5 DICH VU BACKEND VA FRONTEND DA DUOC MO TRONG CAC CUA SO RIENG!
echo.
echo   * API Gateway:   http://localhost:8080
echo   * Auth Service:  http://localhost:8081
echo   * Booking:       http://localhost:8082
echo   * Destination:   http://localhost:8083
echo   * Packages:      http://localhost:8084
echo   * Frontend Web:  http://localhost:3000
echo.
echo   Dang cho Frontend React bien dich tren cong 3000...
echo   (Trinh duyet se tu dong mo ngay khi he thong san sang)
echo ===============================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ready = $false; $count = 0; while (-not $ready -and $count -lt 30) { Start-Sleep -Seconds 2; $count++; try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue; if ($r.StatusCode -eq 200) { $ready = $true } } catch {} Write-Host '.' -NoNewline -ForegroundColor Green }; Write-Host ''; if ($ready) { Write-Host '[OK] He thong da san sang! Dang mo trinh duyet...' -ForegroundColor Green; Start-Process 'http://localhost:3000' } else { Write-Host '[!] Dang mo trinh duyet...' -ForegroundColor Yellow; Start-Process 'http://localhost:3000' }"

pause
