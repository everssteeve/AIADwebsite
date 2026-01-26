@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
echo === Building Astro project ===
call npm run build
echo.
echo === Build termine ===
pause
