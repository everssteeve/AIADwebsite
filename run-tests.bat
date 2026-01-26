@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
echo === Running tests ===
call npm run test
echo.
echo === Tests terminés ===
pause
