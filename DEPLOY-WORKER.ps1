# Set secrets dari env (user run di shell yang sama):
#   $env:NOTION_TOKEN = "ntn_..."
#   $env:SESSION_SECRET = "<random 32 char>"
#   $env:CLOUDFLARE_API_TOKEN = "cfat_..."
#
# Script ini baca env, JANGAN paste token di file ini.

if (-not $env:NOTION_TOKEN) { Write-Error "Set `$env:NOTION_TOKEN dulu"; exit 1 }
if (-not $env:SESSION_SECRET) { $env:SESSION_SECRET = (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"); Write-Host "Generated SESSION_SECRET" }
if (-not $env:CLOUDFLARE_API_TOKEN) { Write-Error "Set `$env:CLOUDFLARE_API_TOKEN dulu"; exit 1 }

$pins = Get-Content "C:\Users\Syahfalah\buku-management-syahfalah\deploy\pins-assignment.txt" -Raw
$jsonStart = $pins.IndexOf("{")
$jsonEnd = $pins.LastIndexOf("}")
$pinsJson = $pins.Substring($jsonStart, $jsonEnd - $jsonStart + 1)

Set-Location "C:\Users\Syahfalah\buku-management-syahfalah\notion-proxy-worker"

$pinsJson | npx wrangler secret put PINS
"PINS OK"
$env:NOTION_TOKEN | npx wrangler secret put NOTION_TOKEN
"NOTION_TOKEN OK"
$env:SESSION_SECRET | npx wrangler secret put SESSION_SECRET
"SESSION_SECRET OK"
npx wrangler deploy
"DEPLOY DONE"
