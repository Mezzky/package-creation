@echo off
cd /d "%~dp0"
set HOST=127.0.0.1
set PORT=3000
"C:\Program Files\nodejs\node.exe" ".output\server\index.mjs" > "nuxt-server.log" 2>&1
