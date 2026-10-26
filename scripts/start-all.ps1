# scripts/start-all.ps1
$root = Split-Path -Parent $PSScriptRoot

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "         TRAVELBOOK - KHOI DONG TOAN BO 5 MICROSERVICES VA FRONTEND           " -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[LUU Y] Vui long dam bao MySQL (XAMPP / MySQL Server) dang chay cong 3306." -ForegroundColor Yellow
Write-Host ""

$services = @(
    @{ Name = "Auth Service"; Port = 8081; Dir = "$root\Backend\auth-service"; Cmd = "mvn spring-boot:run" },
    @{ Name = "Destination Service"; Port = 8083; Dir = "$root\Backend\destination-service"; Cmd = "mvn spring-boot:run" },
    @{ Name = "Packages Service"; Port = 8084; Dir = "$root\Backend\packages-service"; Cmd = "mvn spring-boot:run" },
    @{ Name = "Booking Service"; Port = 8082; Dir = "$root\Backend\booking-service"; Cmd = "mvn spring-boot:run" },
    @{ Name = "API Gateway"; Port = 8080; Dir = "$root\Backend\api-gateway"; Cmd = "mvn spring-boot:run" },
    @{ Name = "Frontend React"; Port = 3000; Dir = "$root\Frontend"; Cmd = "npm start" }
)

$index = 1
foreach ($s in $services) {
    Write-Host "[$index/$($services.Count)] Dang khoi dong $($s.Name) (Port $($s.Port))..." -ForegroundColor Green
    $title = "TravelBook - $($s.Name) [$($s.Port)]"
    $argList = "/k title $title && cd /d `"$($s.Dir)`" && $($s.Cmd)"
    Start-Process -FilePath "cmd.exe" -ArgumentList $argList
    Start-Sleep -Seconds 3
    $index++
}

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  TAT CA DICH VU DA DUOC KHOI DONG TRONG CAC CUA SO RIENG!" -ForegroundColor Green
Write-Host "  - API Gateway:    http://localhost:8080"
Write-Host "  - Auth Service:   http://localhost:8081"
Write-Host "  - Booking:        http://localhost:8082"
Write-Host "  - Destination:    http://localhost:8083"
Write-Host "  - Packages:       http://localhost:8084"
Write-Host "  - Frontend Web:   http://localhost:3000"
Write-Host ""
Write-Host "  [MEO] De tat toan bo he thong, chi can click file: stop-all.bat" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dang mo trinh duyet sau 5 giay..." -ForegroundColor Gray
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
