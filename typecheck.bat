@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
echo === Running TypeScript type check ===
call npm run typecheck
echo.
echo === Typecheck termine ===
pause
