@echo off
REM RUN-ALL.bat — run all setup steps in sequence.
REM User runs this from terminal. NOTION_TOKEN set inline (akan muncul di local shell history only).
REM
REM Usage: RUN-ALL.bat
REM
REM Steps:
REM   1. Validate schema 4 DB
REM   2. Migrate add approval properties
REM   3. Seed 12 PIC data
REM   4. Generate PIN per-PIC
REM
REM Output: pins-assignment.txt (untuk distribusi WA ke 12 PIC)
REM         PINS JSON (untuk wrangler secret put PINS)

setlocal
REM NOTION_TOKEN harus di-set manual sebelum run:
REM   set NOTION_TOKEN=ntn_xxx
REM Jangan commit token ke repo.

echo === STEP 1/4: Validate schema ===
node scripts/validate-schema.js
if %errorlevel% neq 0 goto :err

echo.
echo === STEP 2/4: Migrate add approval properties ===
node scripts/migrate-add-approval.js --confirm
if %errorlevel% neq 0 goto :err

echo.
echo === STEP 3/4: Seed 12 PIC data ===
node scripts/seed-data.js --confirm
if %errorlevel% neq 0 goto :err

echo.
echo === STEP 4/4: Generate PIN per-PIC ===
node scripts/generate-pins.js > pins-assignment.txt 2>&1
type pins-assignment.txt
echo.
echo ============================================================
echo DONE. Next steps:
echo   1. Copy JSON dari pins-assignment.txt (bagian Worker secret)
echo   2. cd ..\notion-proxy-worker
echo   3. wrangler secret put PINS       (paste JSON, Ctrl+Z Enter)
echo      wrangler secret put SESSION_SECRET (generate random 32 char)
echo      wrangler secret put NOTION_TOKEN   (paste token baru)
echo   4. wrangler deploy
echo   5. Distribute PIN dari tabel ke 12 PIC via WA
echo ============================================================
goto :eof

:err
echo.
echo FAILED at step above. Check error message.
exit /b 1
