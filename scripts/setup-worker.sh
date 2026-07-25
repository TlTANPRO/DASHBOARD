#!/bin/bash
# setup-worker.sh — auto-generate secrets + wrangler deploy
# Usage: bash setup-worker.sh
# Prasyarat: cd notion-proxy-worker, npm install, wrangler login

set -e

echo "=== Worker Setup — titan-notion-proxy ==="
echo ""

# Generate random secrets
SESSION_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
OWNER_TOKEN=$(openssl rand -hex 24 2>/dev/null || node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")
DEFAULT_PINS='{"Mada":"1234","Pak Ardian":"1234","Bu Nisya":"1234","Riza":"1234","Yudi (Sdek)":"1234","Rizal":"1234","Amir":"1234","Novita":"1234","Sinta":"1234","Reni":"1234","Rifki":"1234","Reta":"1234"}'

echo "Generated:"
echo "  SESSION_SECRET (32-byte hex)"
echo "  OWNER_TOKEN    (24-byte hex)"
echo "  Default PINS   (all 1234 — DEV ONLY, change later!)"
echo ""
read -p "Lanjut? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo "[1/5] NOTION_TOKEN — paste dari Notion integration page"
read -p "    secret_xxx: " NOTION_TOKEN
if [[ ! $NOTION_TOKEN =~ ^secret_ ]]; then
  echo "ERROR: harus mulai dengan 'secret_'"
  exit 1
fi

echo ""
echo "[2/5] SESSION_SECRET (auto-generated)..."
echo "    $SESSION_SECRET"

echo ""
echo "[3/5] OWNER_TOKEN (auto-generated)..."
echo "    $OWNER_TOKEN"

echo ""
echo "[4/5] Set secrets via wrangler..."
npx wrangler secret put NOTION_TOKEN <<< "$NOTION_TOKEN"
npx wrangler secret put SESSION_SECRET <<< "$SESSION_SECRET"
npx wrangler secret put OWNER_TOKEN <<< "$OWNER_TOKEN"
npx wrangler secret put PINS <<< "$DEFAULT_PINS"

echo ""
echo "[5/5] Deploy..."
npx wrangler deploy

echo ""
echo "=== DONE ==="
echo ""
echo "Worker URL: check output di atas (format: https://titan-notion-proxy.<subdomain>.workers.dev)"
echo ""
echo "Next steps:"
echo "1. Copy Worker URL"
echo "2. Edit deploy/v2/config.js:"
echo "     workerBase: 'https://titan-notion-proxy.<subdomain>.workers.dev'"
echo "     mode: 'live'"
echo "     databases: { kpi: '<ID>', sow: '<ID>', program: '<ID>', jobdesk: '<ID>' }"
echo "3. cd deploy && git add . && git commit -m 'feat: V2 live mode' && git push"
