# AUDIT DASHBOARD V2 — TL;TAN PRO

## RINGKASAN EKSEKUTIF

Dashboard dalam kondisi **LAYAK PAKAI** dengan 3 blokir kritis (P0) yang harus segera diperbaiki:

1. **Leaderboard score rusak** — komputasi `weightedScore` tidak sinkron antar modul
2. **32/33 Jobdesk overdue** — sistem notifikasi & warning tidak aktif
3. **Routing `/employee/:slug` broken** — 6-tab detail tidak render untuk semua PIC

---

## P0 — KRITIS (Blokir Produktivitas)

### 1. Leaderboard Score Formula Error
**Lokasi:** `leaderboard.js`, `score-utils.js`

```
Current implementation (broken):
score = (kpiScore * 0.4) + (jobdeskScore * 0.3) + (sowScore * 0.2) + (programScore * 0.1)

Problem:
- KPI score uses average % completion (tier_target vs actual)
- Jobdesk score counts "Done" only, ignores "In Progress" (should be partial)
- SOW score = bobot_completed / total_bobot (38/38 entries — ok)
- Program score = sum(progress) / count (6 entries — ok)
```

**Fix:** Normalize semua ke skala 0-100, beri bobot sesuai jobdesc:
```
KPI = (avg_realisasi / tier_target) * 100
Jobdesk = (Done*1.0 + InProgress*0.5) / total * 100
SOW = (completed_bobot / total_bobot) * 100
Program = avg(progress_percent)
```

### 2. Jobdesk Overdue Flood — No Warning System
**Data:** 33 entries, deadline 2026-07-25 (semua overdue)

**Missing:**
- Badge merah "OVERDUE" di card jobdesk
- Filter/sort by status di halaman Jobdesk
- Push notifikasi ke PIC via Cloudflare Worker (email/telegram)
- Auto-escalation ke atasan jika >7 hari overdue

**Action:** Implementasi `jobdesk-overdue.js` dengan:
```javascript
const OVERDUE_THRESHOLD = 3; // hari
function checkOverdue(jobdesk) {
  const diff = dayjs().diff(dayjs(jobdesk.deadline), 'day');
  return diff > 0 ? { overdue: diff, status: 'OVERDUE' } : null;
}
```

### 3. Employee Detail Route Broken
**Lokasi:** `app.js` → `loadEmployeeDetail()`

**Issue:** Hanya `pak-ardian` yang render 6 tabs. Slug lain 404/blank.

**Root Cause:** `getEmployeeBySlug()` case-sensitive mismatch:
```
Input: "mada" → data.slug = "mada" ✓
Input: "yudi-sdek" → data.slug = "yudi-sdek" ✓
Input: "rizal" → data.slug = "rizal" ✓
```
**Tapi** fungsi `loadEmployeeTabs()` panggil `fetchNotionData()` dengan query `filter.slug` tapi Notion response pake `properties.Slug` (capital S).

**Fix:** Normalisasi semua key ke lowercase di `notion-api.js`:
```javascript
function normalizeNotionData(record) {
  const props = record.properties;
  return {
    slug: props.Slug?.rich_text[0]?.plain_text?.toLowerCase() || '',
    name: props.Name?.title[0]?.plain_text || '',
    // ... semua field
  };
}
```

---

## P1 — HIGH (Pengalaman User Terganggu)

### 4. Mobile Responsiveness — Breakpoint Failure
**Issue:** Grid 4-col di 375px viewport → card width <120px, teks overlap.

**Fix:** Ganti media queries:
```css
/* Current (broken) */
@media (max-width: 768px) { .grid-cols-4 { grid-template-columns: repeat(2, 1fr); } }

/* Fixed */
@media (max-width: 640px) { .grid-cols-4 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 400px) { .grid-cols-4 { grid-template-columns: 1fr; } }
```

### 5. SOW Bobot Field Naming Mismatch
**Data issue:** Notion field = `"Bobot (%)"` tapi code panggil `"Bobot"`.

**Impact:** 38/38 SOW entries tidak kebaca bobotnya → SOW score selalu 0.

**Fix:** Update `sow-utils.js`:
```javascript
const BOBOT_KEY = 'Bobot (%)'; // not 'Bobot'
```

### 6. Program Budget — 1/6 Kosong
**Data:** 6 program, 5 ada budget, 1 null.

**Fix:** Tampilkan `"Belum diisi"` bukan `"Rp 0"` atau error. Validasi di `program-card.js`.

### 7. No Loading State — Data Fetch Delay
**Current:** White screen saat fetch Notion (2-3 detik).

**Fix:** Tambah skeleton loader di semua halaman:
```html
<div class="skeleton-loader">
  <div class="skeleton-line w-1/2 h-4"></div>
  <div class="skeleton-line w-full h-8"></div>
</div>
```

### 8. KPI "APA" — Target 0
**Data:** ID `"APA"` punya `target: 0` → division by zero error di score.

**Fix:** Skip KPI dengan `target === 0` dari perhitungan.

---

## P2 — MEDIUM (Kenyamanan & Efisiensi)

### 9. Filter & Search Missing
**All pages:** No search, no filter by divisi/status/PIC.

**Add:**
- `/kpi` → filter by divisi, status (on-track/at-risk)
- `/jobdesk` → filter by status (Done/InProgress/Todo/Overdue)
- `/employee/:slug` → search di tab SOW/Program

### 10. Improvisasi Module — 0 Entries (BARU)
**Data:** `Improvisasi` table kosong. Modul tetap dirender.

**Fix:** Tampilkan CTA "Tambahkan Improvisasi Pertama" dengan link ke Notion form.

### 11. Approval Flow — 0/33 Request
**Missing:** Tombol "Ajukan Approval" di jobdesk detail.

**Add:** 
```
[✓] Selesai → muncul tombol "Ajukan Approval"
→ Notifikasi ke atasan (via Cloudflare Worker)
→ Status berubah "Pending Approval"
→ Atasan approve/reject
```

### 12. Employee PIN — Exposed in URL?
**Issue:** PIN ada di data roster tapi tidak digunakan. Potensi security risk.

**Fix:** Jangan render PIN di UI. Gunakan hanya untuk autentikasi (jika ada).

### 13. Division Page — Head Card Tidak Link
**Current:** Division card menampilkan head name tapi tidak clickable.

**Fix:** Link head name ke `/employee/:slug` untuk lihat detail.

### 14. Glosarium — Hardcoded
**Data:** Glosarium di `glosarium.js` hardcoded, tidak sync Notion.

**Fix:** Bikin table `Glosarium` di Notion dan fetch via API.

---

## P3 — NICE-TO-HAVE (Peningkatan)

### 15. Dark Mode Toggle
**Add:** Switch di settings page, persist ke localStorage.

### 16. Export to PDF/Excel
**Add:** Button di setiap halaman untuk export data (leaderboard, KPI, SOW).

### 17. Real-time Clock & Last Updated
**Add:** Timestamp "Last updated: 2026-07-26 14:30 WIB" di footer.

### 18. Notification Bell
**Add:** Icon bell di navbar dengan counter overdue + pending approval.

### 19. Keyboard Shortcuts
```
G → Go to home
K → KPI
J → Jobdesk
S → SOW
L → Leaderboard
```

### 20. Breadcrumb Navigation
**Add:** Di atas konten: `Home / Employee / Pak Ardian / KPI`

---

## PERFORMANCE CONCERNS

### Issue: 49 JS Files, 12,830 Lines
**Current:** Semua file di-load saat pertama kali.

**Fix:** Implementasi lazy loading:
```javascript
// routes.js
const routes = {
  '/kpi': () => import('./pages/kpi.js'),
  '/jobdesk': () => import('./pages/jobdesk.js'),
  // ...
};
```

### Issue: Notion API Rate Limit
**Current:** Setiap halaman fetch sendiri → 6-8 request/page.

**Fix:** Cache data di Service Worker (Cloudflare Worker) dengan TTL 5 menit.

### Issue: Large HTML (72KB)
**Fix:** Split menjadi template partials (header, footer, sidebar).

---

## DATA QUALITY ISSUES (NOTION)

| Table | Issue | Priority |
|-------|-------|----------|
| Jobdesk | 33/33 Actual Output kosong | P1 |
| Jobdesk | 33/33 Bukti URL kosong | P1 |
| Jobdesk | 33/33 overdue (2026-07-25) | P0 |
| KPI | 1 entry target = 0 ("APA") | P1 |
| Program | 1/6 budget kosong | P2 |
| Improvisasi | 0 entries | P2 |
| People | Cuma 1 entry (Pak Ardian) | P2 |

---

## SCORE FORMULA SANITY CHECK

```
Current (broken):
Total = (KPI_avg * 0.4) + (JD_done_rate * 0.3) + (SOW_complete * 0.2) + (Program_avg * 0.1)

Masalah:
1. KPI_avg = rata-rata dari semua KPI → PIC dengan 1 KPI score 100 vs PIC dengan 5 KPI score 80 → tidak adil
2. JD_done_rate = done/total → ignore partial progress
3. SOW_complete = 38/38 = 100% untuk semua PIC → tidak diskriminatif
4. Program_avg = 6/6 = 100% untuk semua PIC → tidak diskriminatif
```

**Proposed Fix:**
```javascript
// Per PIC, ambil KPI yang relevan (filter by divisi)
const relevantKPI = kpis.filter(k => k.divisi === pic.divisi);
const kpiScore = relevantKPI.length > 0 
  ? avg(relevantKPI.map(k => k.realisasi / k.target)) * 100
  : 0;

// Jobdesk: partial credit
const jobdeskScore = (done*1.0 + inProgress*0.5) / total * 100;

// SOW: hanya SOW yang assign ke PIC tsb
const picSOW = sows.filter(s => s.pic === pic.name);
const sowScore = sum(picSOW.map(s => s.bobot * s.status)) / sum(picSOW.map(s => s.bobot));

// Program: sama, filter by divisi
const picPrograms = programs.filter(p => p.divisi === pic.divisi);
const programScore = avg(picPrograms.map(p => p.progress));

// Weighted total
return (kpiScore * 0.35) + (jobdeskScore * 0.30) + (sowScore * 0.25) + (programScore * 0.10);
```

---

## ACTION PLAN

| # | Task | PIC | Deadline |
|---|------|-----|----------|
| 1 | Fix route employee detail | Backend | 2 jam |
| 2 | Fix SOW bobot field name | Backend | 1 jam |
| 3 | Add overdue warning system | Frontend | 4 jam |
| 4 | Fix leaderboard formula | Backend | 3 jam |
| 5 | Mobile responsive breakpoints | Frontend | 2 jam |
| 6 | Skeleton loading state | Frontend | 3 jam |
| 7 | Filter & search components | Frontend | 6 jam |
| 8 | Approval flow UI | Frontend | 8 jam |

**Total estimasi:** 29 jam kerja (3-4 hari)

---

## REKOMENDASI ARSITEKTUR

1. **State Management** — Implementasi simple store (EventEmitter pattern) untuk sync data antar modul
2. **Notion API Wrapper** — Bikin layer caching di Cloudflare Worker
3. **Testing** — Minimal unit test untuk score formula (`score-utils.test.js`)
4. **Error Boundary** — Global error handler untuk prevent white screen

---

**Audit by:** Senior Dashboard Engineer  
**Tanggal:** 2026-07-26  
**Status:** ⚠️ 3 Critical, 5 High, 6 Medium, 6 Nice-to-have