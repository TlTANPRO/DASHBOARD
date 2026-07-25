#!/bin/bash
# RUN-ALL.sh — bash version (user can run di Git Bash / WSL).
# NOTION_TOKEN harus di-set manual sebelum run:
#   export NOTION_TOKEN=ntn_xxx
# Jangan commit token ke repo.

set -e

echo "=== STEP 1/4: Validate schema ==="
node scripts/validate-schema.js

echo ""
echo "=== STEP 2/4: Migrate add approval properties ==="
node scripts/migrate-add-approval.js --confirm

echo ""
echo "=== STEP 3/4: Seed 12 PIC data ==="
node scripts/seed-data.js --confirm

echo ""
echo "=== STEP 4/4: Generate PIN per-PIC ==="
node scripts/generate-pins.js | tee pins-assignment.txt

cat <<'EOF'

============================================================
DONE. Next steps:
  1. Copy JSON dari pins-assignment.txt (bagian Worker secret)
  2. cd ../notion-proxy-worker
  3. wrangler secret put PINS             (paste JSON)
     wrangler secret put SESSION_SECRET   (random 32 char: openssl rand -hex 32)
     wrangler secret put NOTION_TOKEN     (paste token)
  4. wrangler deploy
  5. Distribute PIN tabel ke 12 PIC via WA
  6. Buka https://tltanpro.github.io/DASHBOARD/v2/ → login
  7. ROTATE semua 3 token di dashboard masing-masing!
============================================================
EOF
