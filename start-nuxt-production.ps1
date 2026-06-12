Set-Location -LiteralPath $PSScriptRoot
$env:HOST = "127.0.0.1"
$env:PORT = "3000"
& "C:\Program Files\nodejs\node.exe" ".output\server\index.mjs" *> "nuxt-server.log"
