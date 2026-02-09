@echo off
set PATH=C:\nodejs\bin;%PATH%
cd /d "%~dp0"
echo === Running Benefit Tests ===
call npx vitest run --reporter=verbose > benefit-test-output.txt 2>&1
echo === Tests complete ===
type benefit-test-output.txt
