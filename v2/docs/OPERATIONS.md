# OPERATIONS — SOP Harian untuk 12 PIC

Dokumen ini untuk **semua PIC**. Baca sekali, pakai setiap hari.

---

## Tujuan

Dashboard V2 = tracker harian untuk:
- **KPI** (target + realisasi per periode)
- **Program Kerja** (project Q1-Q4)
- **Jobdesk Harian** (catatan kerja hari ini + besok)
- **SOW** (scope of work per PIC, view only)

**Update setiap hari.** Owner review tiap Senin pagi.

---

## Login

1. Buka `https://tltanpro.github.io/DASHBOARD/v2/`
2. Click **Login** di kanan atas
3. Pilih nama Bapak/Ibu
4. Masukkan PIN 4 digit
5. Submit → masuk sebagai PIC

**Sesi hangus 12 jam.** Logout manual kalau pindah device.

---

## Setiap Hari (wajib)

### Pagi (08:00 - 09:00)

1. **Buka V2** → langsung lihat jobdesk hari ini
2. Kalau belum ada jobdesk hari ini → click **+ Tambah Jobdesk** di section V2-D
3. Format ID: `JOB-YYYYMMDD-NamaPendek-01` (auto-generate, tinggal Submit)

### Siang (12:00 - 13:00)

1. Update **status** jobdesk yang in-progress: `In Progress` → `Done` / `Blocked`
2. Kalau blocked → tulis catatan di Bukti atau Actual Output
3. Update **KPI Realisasi** di section V2-A kalau ada angka baru (closing, lead, dsb)

### Sore (16:00 - 17:00)

1. Final review jobdesk hari ini — semua status harus `Done` atau `Blocked`
2. Tambah jobdesk besok (opsional, biar pagi tidak kosong)
3. Update KPI akhir hari kalau ada

### Minggu (Senin pagi, 30 menit)

1. Review KPI minggu lalu → set status baru (On Track / At Risk / Achieved)
2. Tambah Program Kerja baru Q (kalau ada kickoff)
3. Verifikasi SOW masih relevan (jangan edit tanpa izin owner)

---

## Aturan Edit

### Boleh edit sendiri
- Jobdesk sendiri
- KPI sendiri (kolom Target + Realisasi)
- Program yang Bapak/Ibu jadi PIC Penanggung Jawab

### Tidak boleh edit sendiri (tanya owner)
- SOW (read only by default)
- KPI / Program PIC lain
- Status `Achieved` (perlu validasi owner)

### Conflict (data diubah orang lain)

Kalau muncul toast **"Data sudah diubah — refresh dulu"**:
1. Click OK
2. Reload page (F5)
3. Lihat versi terbaru
4. Edit lagi kalau masih perlu

**Jangan diabaikan** — akan overwrite data orang lain kalau di-skip.

---

## Filter Bar

Tiap section V2 punya filter bar. Cara pakai:

- **KPI Tracker**: filter PIC + Periode + Status
- **Program**: filter Quarter + Status
- **Jobdesk**: filter Tanggal + Status
- **SOW**: filter PIC + Status

Reset click tombol **Reset** di kanan filter.

---

## Mode Live vs Demo

- **Mode LIVE** = data tersimpan di Notion. Semua PIC lihat update real-time.
- **Mode DEMO** = data tersimpan di localStorage browser. Cuma Bapak/Ibu yang lihat. Tidak shared.

Default: **DEMO** sampai owner setup Notion + Worker. Switch ke LIVE setelah setup (lihat SETUP.md).

Lihat badge di Hero — `DEMO` atau `LIVE`.

---

## KPI Skor Otomatis

Dashboard auto-hitung **Skor** = `(Realisasi / Target) × 100` dan **Grade**:
- A: ≥ 90
- B: 75-89
- C: 60-74
- D: < 60

**Skor Owner Mada/Bu Nisya/Pak Ardian = rata-rata skor semua PIC di divisi.** Lihat di **02 Leaderboard**.

---

## Notifikasi & Reminder

- Dashboard auto-refresh tiap 60 detik kalau tab aktif
- Tidak ada email reminder (v2.x feature)
- Owner (Pak Ardian / Mada) review manual setiap Senin

---

## Yang TIDAK Boleh Dilakukan

- ❌ Edit KPI / Program PIC lain tanpa izin
- ❌ Hapus data historis (perlu soft-delete via owner)
- ❌ Share PIN ke orang lain
- ❌ Input data dummy / placeholder
- ❌ Pakai akun PIC lain (walaupun seizin)

---

## Troubleshooting

| Issue | Solusi |
|-------|--------|
| Tidak bisa login | Cek PIN dengan owner, atau mode DEMO (PIN apapun) |
| Data tidak muncul | Refresh page (F5), atau cek Mode badge (DEMO = local only) |
| 409 conflict saat edit | Refresh, lihat data terbaru, edit lagi |
| Form Submit error | Cek field required (bertanda *), cek Notion quota |
| Tidak bisa save | Cek koneksi internet, atau Worker quota |
| Browser lambat | Bersihkan cache, atau pakai Chrome/Edge terbaru |

---

## Kontak

- **Issue teknis** → Mada (Chief of Staff)
- **Akses / PIN** → Pak Ardian (Owner)
- **Konten / SOP** → Mada
- **Notion backend** → Mada
