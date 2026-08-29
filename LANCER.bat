@echo off
cd /d "%~dp0"

start "SERVEUR" cmd /k "cd /d "%~dp0server" && node index.js"

timeout /t 3 /nobreak >nul

start "REACT" cmd /k "cd /d "%~dp0" && npm.cmd run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173

exit