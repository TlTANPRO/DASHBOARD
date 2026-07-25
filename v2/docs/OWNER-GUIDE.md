# OWNER GUIDE · Dashboard V2.1

> Untuk **Pak Ardian** dan **Bu Nisya** — kontrol penuh 12 PIC harian via dashboard.

## Login

1. Buka `https://tltanpro.github.io/DASHBOARD/v2/`
2. Klik tombol **Login** (pojok kanan atas)
3. Pilih nama: **Pak Ardian** atau **Bu Nisya**
4. Masukkan PIN 4 digit (cek di pesan WA owner, default dev = `1234`)
5. Setelah login → section **Master Control** muncul di nav (hidden untuk PIC biasa)

## Master Control — 1 view 12 PIC

Setelah login sebagai owner:

1. Klik nav link **★ Master Control** (hijau, hanya muncul untuk owner)
2. Lihat 12 card PIC dalam 1 halaman:
   - **Avatar** + nama + title
   - **3 KPI mini**: job hari ini, KPI achieved, KPI on track
   - **Status pill**: hijau (on track) / kuning (perlu perhatian) / merah (at risk) / abu (belum input)
3. **Filter**: pilih divisi atau status untuk fokus
4. **Click card manapun** → drill-down muncul dengan:
   - Tabel KPI PIC tersebut
   - Jobdesk hari ini (P1/P2/P3 + status)
   - Daftar SOW aktif

## Override Permission

Owner bisa **edit row PIC manapun** tanpa 409 conflict:
- Edit KPI, Program, Jobdesk, atau SOW siapapun
- Header akan tulis "(override by Pak Ardian)" di audit log
- Setiap edit owner tercatat di `localStorage.auditLog` (200 entry max)

## Alerts

Top nav ada badge **⚠ Alert N** (merah) — muncul otomatis jika:
- PIC tidak input job hari ini
- PIC punya KPI At Risk / Off Track
- Jobdesk status Blocked
- Achievement < 50% mid-periode

Click badge → scroll ke section Alerts. Lihat list per PIC.

## Weekly Recap

1. Master view (scroll bawah) → section **Weekly Recap**
2. Klik **Export Markdown** → Markdown table ke clipboard
3. Paste di WA group owner untuk report mingguan

## Tips Harian

- **Pagi (08:00)**: buka Master Control, cek badge alert. Kalau ada merah → langsung click PIC
- **Mid-day (12:00)**: refresh, cek jobdesk P1 belum done
- **Sore (17:00)**: review jobdesk hari ini, kasih feedback via Notion comment
- **Minggu (Sabtu sore)**: export Weekly Recap, share ke group

## Yang TIDAK Boleh Dilakukan

- ❌ Edit KPI Realisasi PIC tanpa diskusi (merusak trust)
- ❌ Bulk delete data (pakai archive, bukan hapus)
- ❌ Share PIN ke orang di luar 12 PIC
- ❌ Edit Notion langsung kalau ada perubahan besar (sync conflict)

## FAQ

**Q: Browser lambat load?**
A: Skeleton loader muncul 1-2 detik. Kalau > 5 detik, refresh.

**Q: Data tidak sync dengan PIC lain?**
A: Dashboard auto-refresh tiap 60 detik. Atau klik nav link untuk manual refresh.

**Q: Lupa PIN?**
A: Hubungi Mada untuk reset via `wrangler secret put PINS`.
