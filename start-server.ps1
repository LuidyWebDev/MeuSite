# PowerShell script to start HTTP server
# Navega para o diretório do projeto
Set-Location "d:\Sites Projetos\Antigravity"

Write-Host "Iniciando servidor HTTP local na porta 8000..."
Write-Host "URL: http://localhost:8000"
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor."
Write-Host ""

# Inicia o servidor HTTP Python
python -m http.server 8000 --bind 127.0.0.1