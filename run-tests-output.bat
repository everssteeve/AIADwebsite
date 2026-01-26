@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
call npm run test > test-output.txt 2>&1
type test-output.txt
