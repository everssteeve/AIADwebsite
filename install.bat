@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
if exist node_modules rmdir /s /q node_modules
call npm install
echo.
echo === Installation terminee ===
pause
