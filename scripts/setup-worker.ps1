# setup-worker.ps1 — auto-generate secrets + wrangler deploy (Windows)
# Usage: .\setup-worker.ps1
# Prasyarat: cd notion-proxy-worker, npm install, wrangler login

$ErrorActionPreference = "Stop"

Write-Host "=== Worker Setup - titan-notion-proxy ===" -ForegroundColor Cyan
Write-Host ""

# Generate random secrets
$bytes32 = New-Object byte[] 32
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes32)
$SessionSecret = [BitConverter]::ToString($bytes32) -replace '-', ''

$bytes24 = New-Object byte[] 24
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes24)
$OwnerToken = [BitConverter]::ToString($bytes24) -replace '-', ''

$DefaultPins = '{"Mada":"1234","Pak Ardian":"1234","Bu Nisya":"1234","Riza":"1234","Yudi (Sdek)":"1234","Rizal":"1234","Amir":"1234","Novita":"1234","Sinta":"1234","Reni":"1234","Rifki":"1234","Reta":"1234"}'

Write-Host "Generated:" -ForegroundColor Yellow
Write-Host "  SESSION_SECRET (32-byte hex)"
Write-Host "  OWNER_TOKEN    (24-byte hex)"
Write-Host "  Default PINS   (all 1234 - DEV ONLY, change later!)"
Write-Host ""
$confirm = Read-Host "Lanjut? (y/n)"
if ($confirm -ne "y") { Write-Host "Cancelled."; exit }

Write-Host ""
Write-Host "[1/5] NOTION_TOKEN - paste dari Notion integration page" -ForegroundColor Green
$NotionToken = Read-Host "    secret_xxx"
if (-not $NotionToken.StartsWith("secret_")) {
  Write-Host "ERROR: harus mulai dengan 'secret_'" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "[2/5] SESSION_SECRET (auto-generated)..." -ForegroundColor Green
Write-Host "    $SessionSecret"
Write-Host ""
Write-Host "[3/5] OWNER_TOKEN (auto-generated)..." -ForegroundColor Green
Write-Host "    $OwnerToken"

Write-Host ""
Write-Host "[4/5] Set secrets via wrangler..." -ForegroundColor Green
$env:NOTION_TOKEN = $NotionToken
npx wrangler secret put NOTION_TOKEN
$env:SESSION_SECRET = $SessionSecret
npx wrangler secret put SESSION_SECRET
$env:OWNER_TOKEN = $OwnerToken
npx wrangler secret put OWNER_TOKEN
$env:PINS = $DefaultPins
npx wrangler secret put PINS

Write-Host ""
Write-Host "[5/5] Deploy..." -ForegroundColor Green
npx wrangler deploy

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Worker URL: check output di atas"
Write-Host "Format: https://titan-notion-proxy.<subdomain>.workers.dev"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy Worker URL"
Write-Host "2. Edit deploy/v2/config.js:"
Write-Host "     workerBase: 'https://titan-notion-proxy.<subdomain>.workers.dev'"
Write-Host "     mode: 'live'"
Write-Host "     databases: { kpi, sow, program, jobdesk }"
Write-Host "3. cd deploy && git add . && git commit -m 'feat: V2 live mode' && git push"
