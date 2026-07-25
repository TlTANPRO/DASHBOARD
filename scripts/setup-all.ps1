# setup-all.ps1 — FULL AUTO: Notion DBs + config.js + Worker deploy + push
# Usage: .\setup-all.ps1 -NotionToken "ntn_xxx"
# Prasyarat: Node.js, Git, Cloudflare account (wrangler login manual)

param(
  [Parameter(Mandatory=$true)]
  [string]$NotionToken
)

$ErrorActionPreference = "Stop"
$ProjectRoot = "C:\Users\Syahfalah\buku-management-syahfalah"
$ScriptsDir = "$ProjectRoot\deploy\scripts"
$WorkerDir = "$ProjectRoot\notion-proxy-worker"
$DeployDir = "$ProjectRoot\deploy"
$ConfigFile = "$DeployDir\v2\config.js"

function Step($n, $name) {
  Write-Host ""
  Write-Host "[$n] $name..." -ForegroundColor Yellow
}
function OK { Write-Host "  OK" -ForegroundColor Green }
function FAIL { Write-Host "  FAIL" -ForegroundColor Red; exit 1 }

# ==== Step 1: Test token ====
Step 1 "Test Notion token"
$env:NOTION_TOKEN = $NotionToken
$headers = @{
  "Authorization" = "Bearer $NotionToken"
  "Notion-Version" = "2022-06-28"
}
try {
  $test = Invoke-RestMethod -Method Get -Uri "https://api.notion.com/v1/users/me" -Headers $headers
  Write-Host "  workspace: $($test.bot.workspace_name)"
  OK
} catch {
  Write-Host "  token invalid: $($_.Exception.Response.StatusCode.value__)"
  FAIL
}

# ==== Step 2: Create 4 Notion DBs ====
Step 2 "Create 4 Notion databases"
Set-Location $ScriptsDir
$output = node create-notion-dbs.js 2>&1 | Tee-Object -Variable out
if ($LASTEXITCODE -ne 0) { Write-Host $out; FAIL }
OK

# ==== Step 3: Parse IDs ====
Step 3 "Parse notion-ids.json"
$idsFile = "$ScriptsDir\notion-ids.json"
if (-not (Test-Path $idsFile)) { FAIL }
$ids = Get-Content $idsFile -Raw | ConvertFrom-Json
$kpiId = $ids.databases.kpi
$sowId = $ids.databases.sow
$progId = $ids.databases.program
$jobId = $ids.databases.jobdesk
$parentPage = $ids.parentPage
Write-Host "  Parent: $parentPage"
Write-Host "  KPI:    $kpiId"
Write-Host "  SOW:    $sowId"
Write-Host "  Prog:   $progId"
Write-Host "  Job:    $jobId"
OK

# ==== Step 4: Update config.js ====
Step 4 "Update deploy/v2/config.js"
$configContent = @"
// V2 DASHBOARD CONFIG - LIVE MODE (Notion via Worker)
// Generated $(Get-Date -Format "yyyy-MM-dd HH:mm")
window.DASHBOARD_CONFIG = {
  workerBase: "https://titan-notion-proxy.YOUR-SUBDOMAIN.workers.dev",
  notionVersion: "2022-06-28",
  databases: {
    kpi:     "$kpiId",
    sow:     "$sowId",
    program: "$progId",
    jobdesk: "$jobId",
  },
  picList: [
    "Pak Ardian", "Bu Nisya", "Mada", "Riza",
    "Yudi (Sdek)", "Rizal", "Amir", "Novita",
    "Sinta", "Reni", "Rifki", "Reta"
  ],
  divisiList: ["Owner", "Operasional", "Marketing", "Proyek", "Media", "Admin"],
  watermark: "DOKUMEN INTERNAL - TIDAK UNTUK DISEBARLUASKAN",
  pollIntervalMs: 60000,
  mode: "live"
};
"@
$configContent | Out-File -FilePath $ConfigFile -Encoding UTF8 -NoNewline
OK

# ==== Step 5: Worker setup (interactive) ====
Step 5 "Setup Cloudflare Worker (interactive)"
Write-Host "  Need: Cloudflare account logged in via wrangler" -ForegroundColor Gray
Write-Host "  Check if wrangler available..."

if (-not (Test-Path "$WorkerDir\node_modules")) {
  Write-Host "  Installing wrangler..."
  Set-Location $WorkerDir
  npm install
  if ($LASTEXITCODE -ne 0) { FAIL }
}

# Check wrangler login
Set-Location $WorkerDir
$whoami = npx wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "  wrangler not logged in. Run manually: npx wrangler login"
  Write-Host "  Then re-run this script."
  FAIL
}
OK

# Set secrets
Write-Host "  Setting Worker secrets..."
$sessionSecret = -join ((1..64) | ForEach-Object { [char](Get-Random -Minimum 48 -Maximum 122) })
$ownerToken = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 48 -Maximum 122) })
$defaultPins = '{"Mada":"1234","Pak Ardian":"1234","Bu Nisya":"1234","Riza":"1234","Yudi (Sdek)":"1234","Rizal":"1234","Amir":"1234","Novita":"1234","Sinta":"1234","Reni":"1234","Rifki":"1234","Reta":"1234"}'

$env:NOTION_TOKEN = $NotionToken
echo $NotionToken | npx wrangler secret put NOTION_TOKEN | Out-Null
echo $sessionSecret | npx wrangler secret put SESSION_SECRET | Out-Null
echo $ownerToken | npx wrangler secret put OWNER_TOKEN | Out-Null
echo $defaultPins | npx wrangler secret put PINS | Out-Null
OK

# Deploy
Write-Host "  Deploying Worker..."
$deployOut = npx wrangler deploy 2>&1 | Tee-Object -Variable depOut
$workerUrl = ($depOut | Select-String -Pattern "https://[a-z0-9-]+\.workers\.dev").Matches[0].Value
if (-not $workerUrl) { Write-Host $depOut; FAIL }
Write-Host "  Deployed: $workerUrl"
OK

# ==== Step 6: Update workerBase di config.js ====
Step 6 "Update workerBase di config.js"
$configContent = $configContent -replace "https://titan-notion-proxy\.YOUR-SUBDOMAIN\.workers\.dev", $workerUrl
$configContent | Out-File -FilePath $ConfigFile -Encoding UTF8 -NoNewline
OK

# ==== Step 7: Commit + push ====
Step 7 "Commit + push to GitHub"
Set-Location $DeployDir
git add v2/config.js
git -c user.name="Syahfalah" -c user.email="owner@syahfalah.local" commit -m "feat: V2 live mode - $(Get-Date -Format "yyyy-MM-dd")" 2>&1 | Out-Null
git push origin main 2>&1 | Out-Null
OK

# ==== Done ====
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FULL SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Worker URL:    $workerUrl" -ForegroundColor Green
Write-Host "Dashboard V2:  https://tltanpro.github.io/DASHBOARD/v2/" -ForegroundColor Green
Write-Host "Notion page:   https://www.notion.so/$parentPage" -ForegroundColor Green
Write-Host ""
Write-Host "User action remaining:" -ForegroundColor Yellow
Write-Host "  1. Open Notion, share 4 DB ke integration 'Dashboard V2'"
Write-Host "     (DB ... -> Connections -> add Dashboard V2)"
Write-Host ""
Write-Host "  2. Wait 1-2 min for GitHub Pages deploy"
Write-Host "  3. Open https://tltanpro.github.io/DASHBOARD/v2/ - badge shows LIVE"
Write-Host "  4. Login test (PIN default: 1234 untuk semua PIC)"
Write-Host ""
Write-Host "Default PINS (DEV only - rotate before production):" -ForegroundColor Red
Write-Host "  All 12 PIC: 1234"
Write-Host ""
