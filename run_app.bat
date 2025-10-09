@echo off
cd /d "%~dp0"

start cmd /k "yarn dev"
timeout /t 5 >nul

start http://localhost:5173

echo.
echo ==============================
echo Vue dev server is running...
echo Browser opened at localhost:5173
echo ==============================
echo.

pause