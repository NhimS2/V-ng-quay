@echo off
chcp 65001 > nul
echo ========================================================
echo    CS2 KNIFE SPINNER - VÒNG QUAY DAO CS2 DELUXE
echo ========================================================
echo Đang mở 2 trang: Màn hình Vòng quay (Viewer) và Bảng Điều khiển (Streamer Control)...
start "" "http://localhost:8080/index.html?v=%RANDOM%"
start "" "http://localhost:8080/control.html?v=%RANDOM%"
python -m http.server 8080
pause
