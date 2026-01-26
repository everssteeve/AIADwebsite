@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
echo === Running ESLint ===
call npm run lint
echo.
echo === Lint termine ===
pause
