@echo off
chcp 65001 >nul
title TravelBook - Dung Toan Bo He Thong
color 0C

echo ===============================================================================
echo              TRAVELBOOK - DUNG VA GIAI PHONG TOAN BO DICH VU
echo ===============================================================================
echo.
echo Dang quet va dung cac tien trinh tren cong 8080, 8081, 8082, 8083, 8084, 3000...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-all.ps1"

echo.
echo ===============================================================================
echo   HOAN TAT! HE THONG DA DUOC DUNG VA GIAI PHONG CONG.
echo ===============================================================================
echo.
pause
