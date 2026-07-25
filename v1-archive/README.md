# V1 ARCHIVE — FROZEN 25 Jul 2026

## Status

**V1 frozen per 25 Jul 2026.** Pakai V2 di [https://tltanpro.github.io/DASHBOARD/v2/](../v2/).

## Kenapa V1 freeze?

V1 = static read-only bento dashboard. 9 section hardcoded + fallback data. Tidak bisa edit. Tidak bisa track real-time KPI/SOW/Program/Jobdesk.

V2 = dashboard live, Notion-backed, CRUD lengkap untuk 12 PIC.

## Apa yang TETAP di V1

- Hero, 01 Struktur, 02 Leaderboard, 03 KPI 5D, 04 Fee Media, 05 Pricing, 06 STB, 07 Manager, 08 Glosarium
- Read-only reference data (jadwal, jenjang punish, glosarium, dll)
- Watermark "DOKUMEN INTERNAL — TIDAK UNTUK DISEBARLUASKAN"
- 51 SSOT JSON files di `data/tim-v2/`

## Apa yang BARU di V2

- Login PIN per PIC
- V2-A KPI Tracker (CRUD) — auto-generate leaderboard
- V2-B My SOW (view + filter)
- V2-C Program Kerja (CRUD + filter quarter)
- V2-D Jobdesk Harian (CRUD + filter tanggal)
- Sticky filter bar
- Optimistic lock (Edit_Time) untuk multi-user concurrent edit
- Notion backend via Cloudflare Worker proxy

## File di archive ini

`index.html` = snapshot V1 final, TIDAK DIEDIT lagi.

## Migrasi

PIC yang aktifkan V2: login di `/v2/` dengan PIN dari owner. Mode live butuh Worker deployed + 4 Notion DB ready. Mode demo = data di localStorage browser saja (testing tanpa backend).

Lihat [V2 SETUP.md](../v2/docs/SETUP.md) untuk deploy Notion + Worker.
