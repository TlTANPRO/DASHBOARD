# DASHBOARD PERUSAHAAN V1

Live dashboard operasional **PT Syahfalah Global + Lembayung Wanantara Padha**.

Data source: `data/tim-v2/` (51 SSOT JSON, V5.0).

## Live URL
https://tltanpro.github.io/DASHBOARD/

## Sections
1. Hero — V5.0 status + 12 PIC + 4 divisi
2. Struktur Organisasi — 12 PIC cards, Mada B10 highlight
3. Leaderboard V5 — 4 divisi top-3
4. KPI Score Card — 5 dimensi + grading A/B/C/D
5. Fee Media Closing — 3 pilar konten
6. Pricing Tier — Bronze/Silver/Gold
7. STB Audit — 3 wajib + 5 jenjang punishment
8. Manager 3 Sifat + Glosarium 50+ akronim

## Update data
Edit file JSON di `data/tim-v2/` → `git push` → refresh browser.
Dashboard `fetch()` SSOT langsung. Fallback static built-in kalau fetch gagal.

## Watermark
`DOKUMEN INTERNAL — TIDAK UNTUK DISEBARLUASKAN` aktif di setiap halaman.

## Tech
- Single-file HTML + vanilla JS + CSS (no build step)
- Dark mode + single accent (TITAN V21-V30 design DNA reference)
- Bento grid + sticky nav + Inter / JetBrains Mono fonts

## Build
25 Jul 2026 · Python 3.14 + python-docx (Buku SSOT parallel)
