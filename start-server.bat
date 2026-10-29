@echo off
setlocal enabledelayedexpansion

cd /d "d:\Sites Projetos\Antigravity"

echo Iniciando servidor HTTP local na porta 8000...
echo URL: http://localhost:8000

echo.
echo Pressione Ctrl+C para parar o servidor.
echo.

python -m http.server 8000 --bind 127.0.0.1