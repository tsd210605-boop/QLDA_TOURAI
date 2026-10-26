@echo off
chcp 65001 >nul
title TravelBook - Khoi Dong Lai Toan Bo He Thong
color 0E

echo ===============================================================================
echo          HỆ THỐNG DU LỊCH TRAVELBOOK - KHỞI ĐỘNG LẠI (RESTART)
echo ===============================================================================
echo.
echo [BƯỚC 1] Đang giải phóng các cổng và dừng dịch vụ cũ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-all.ps1"

echo.
echo [BƯỚC 2] Đợi 2 giây trước khi khởi động mới...
timeout /t 2 /nobreak >nul

echo.
echo [BƯỚC 3] Khởi động mới toàn bộ dịch vụ...
call "%~dp0start-all.bat"
