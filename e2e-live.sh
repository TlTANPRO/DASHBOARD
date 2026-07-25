#!/bin/bash
# E2E live test against deployed Worker
WORKER="https://titan-notion-proxy.nickasad10000.workers.dev"

# 12 PINs dari pins-assignment.txt
declare -A PINS
PINS["Pak Ardian"]="6079"
PINS["Bu Nisya"]="3644"
PINS["Mada"]="1634"
PINS["Riza"]="5960"
PINS["Yudi (Sdek)"]="9243"
PINS["Rizal"]="9908"
PINS["Amir"]="5049"
PINS["Novita"]="4635"
PINS["Sinta"]="1116"
PINS["Reni"]="9808"
PINS["Rifki"]="9064"
PINS["Reta"]="3318"

# 4 DB IDs
KPI_DB="3a84cf7e-9f24-819d-95d8-f951e6a1a6a2"
SOW_DB="3a84cf7e-9f24-816c-be14-ef1f171b4d52"
PROG_DB="3a84cf7e-9f24-8172-bd10-ee9e8056940a"
JOB_DB="3a84cf7e-9f24-814f-bd01-cd52e64db04e"

pass=0
fail=0
test() {
  local name="$1"; local cmd="$2"
  local out
  out=$(eval "$cmd" 2>&1)
  if echo "$out" | grep -q '"error"'; then
    echo "✗ $name — $out" | head -c 200
    echo
    ((fail++))
  else
    echo "✓ $name"
    ((pass++))
  fi
}

echo "=== E2E LIVE TEST · $(date) ==="
echo "Worker: $WORKER"
echo

# 1. Root
test "Worker root" "curl -s $WORKER/"

# 2. Login all 12 PIC
for pic in "${!PINS[@]}"; do
  pin="${PINS[$pic]}"
  test "Login $pic" "curl -s -X POST $WORKER/auth/login -H 'Content-Type: application/json' -d '{\"pic\":\"$pic\",\"pin\":\"$pin\"}'"
done

# 3. Query each DB
test "Query KPI DB" "curl -s -X POST $WORKER/notion/v1/databases/$KPI_DB/query -H 'Content-Type: application/json' -d '{}' | head -c 200"
test "Query SOW DB" "curl -s -X POST $WORKER/notion/v1/databases/$SOW_DB/query -H 'Content-Type: application/json' -d '{}' | head -c 200"
test "Query Program DB" "curl -s -X POST $WORKER/notion/v1/databases/$PROG_DB/query -H 'Content-Type: application/json' -d '{}' | head -c 200"
test "Query Jobdesk DB" "curl -s -X POST $WORKER/notion/v1/databases/$JOB_DB/query -H 'Content-Type: application/json' -d '{}' | head -c 200"

# 4. Jobdesk schema has approval fields
test "Jobdesk schema has Approval/Approval_By/Approval_Time" "curl -s $WORKER/notion/v1/databases/$JOB_DB | grep -q 'Approval'"

# 5. Wrong PIN rejected
test "Wrong PIN rejected" "out=\$(curl -s -X POST $WORKER/auth/login -H 'Content-Type: application/json' -d '{\"pic\":\"Mada\",\"pin\":\"0000\"}'); echo \"\$out\" | grep -q 'PIN salah'"

echo
echo "=== SUMMARY: $pass pass, $fail fail ==="
