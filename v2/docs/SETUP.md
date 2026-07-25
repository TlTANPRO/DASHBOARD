# V2 SETUP — Notion Backend + Worker Deploy

Dokumen ini untuk **owner** (Pak Ardian / Bu Nisya). Tujuannya: hubungkan V2 dashboard ke Notion supaya 12 PIC bisa edit data real-time.

**Estimasi waktu: 1-2 jam.** Step 1-3 manual (di Notion), step 4-5 deploy Worker.

---

## 1. Bikin Notion Integration

1. Buka https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name: `Dashboard V2`
4. Type: **Internal**
5. Capabilities: Read + Update + Insert content
6. Submit → copy **Internal Integration Token** (`secret_…`)
7. Simpan token — akan dipakai di step 5

---

## 2. Bikin Parent Page + 4 Database

Bikin parent page baru di Notion workspace (kalau belum ada), judul: **DASHBOARD PERUSAHAAN V2**.

Di dalam page itu, bikin 4 inline database dengan property schema berikut.

### DB1: KPI Tracker

| Property | Type | Options/Format |
|----------|------|----------------|
| `KPI ID` | title | `KPI-2026-0001` |
| `PIC` | select | 12 PIC names (lihat di bawah) |
| `Divisi` | select | Owner, Operasional, Marketing, Proyek, Media, Admin |
| `Periode` | select | Mingguan, Bulanan, Kuartalan |
| `Target` | number | |
| `Realisasi` | number | |
| `Satuan` | select | %, Unit, Rp, Closing, Lead, Jam |
| `Status` | select | On Track, At Risk, Off Track, Achieved |
| `Catatan` | rich_text | |
| `Bukti` | url | |
| `Edit_Time` | rich_text | hidden, di-set Worker |

### DB2: Scope of Work

| Property | Type | Options/Format |
|----------|------|----------------|
| `SOW ID` | title | `SOW-Mada-01` |
| `PIC` | select | 12 PIC |
| `Tahun` | number | 2026 |
| `Kategori` | multi_select | Operasional, Strategis, Compliance, Pengembangan, Reporting |
| `Deskripsi` | rich_text | |
| `Bobot (%)` | number | 0-100 |
| `Frekuensi` | select | Harian, Mingguan, Bulanan, Kuartalan |
| `Status` | select | Active, Paused, Completed |
| `Effective From` | date | |
| `Edit_Time` | rich_text | hidden |

### DB3: Program Kerja

| Property | Type | Options/Format |
|----------|------|----------------|
| `Program ID` | title | `PROG-2026-001` |
| `Nama Program` | title (atau rich_text) | |
| `PIC Penanggung Jawab` | select | 12 PIC |
| `Quarter` | select | Q1, Q2, Q3, Q4 |
| `Tahun` | number | 2026 |
| `Tanggal Mulai` | date | |
| `Deadline` | date | |
| `Progress (%)` | number | 0-100 |
| `Status` | select | Planning, On Track, At Risk, Delayed, Done, Cancelled |
| `Budget (Rp)` | number | |
| `Risiko` | rich_text | |
| `Edit_Time` | rich_text | hidden |

### DB4: Jobdesk Harian + Target

| Property | Type | Options/Format |
|----------|------|----------------|
| `Jobdesk ID` | title | `JOB-20260725-Mada-01` |
| `PIC` | select | 12 PIC |
| `Tanggal` | date | |
| `Jobdesk` | rich_text | |
| `Kategori` | select | Harian, Mingguan, Bulanan |
| `Target Output` | rich_text | |
| `Actual Output` | rich_text | |
| `Prioritas` | select | P1, P2, P3 |
| `Status` | select | To Do, In Progress, Done, Blocked |
| `Bukti` | url | |
| `Edit_Time` | rich_text | hidden |

### 12 PIC (select options)

`Pak Ardian`, `Bu Nisya`, `Mada`, `Riza`, `Yudi (Sdek)`, `Rizal`, `Amir`, `Novita`, `Sinta`, `Reni`, `Rifki`, `Reta`

Tambah manual di setiap select property (Notion otomatis bikin option baru saat ketik).

---

## 3. Share DB dengan Integration

Di parent page, click `...` menu → **Connections** → add **Dashboard V2** integration.

Verify: jalan ini di browser (paste di address bar):

```
https://api.notion.com/v1/users/me
```

Header: `Authorization: Bearer secret_…`

Kalau 200 = integration hidup. Kalau 401 = token salah.

---

## 4. Copy 4 DB ID

Di Notion, click kanan DB → **Copy link**. URL format:
`https://www.notion.so/WORKSPACE/DATABASE_ID?v=...`

Extract `DATABASE_ID` (32 char UUID, tanpa dash).

Paste ke `v2/config.js` (replace placeholder `PASTE_*_DB_ID_HERE_32_CHARS`):

```js
window.DASHBOARD_CONFIG = {
  workerBase: "https://titan-notion-proxy.YOUR-SUBDOMAIN.workers.dev",
  mode: "live",
  databases: {
    kpi: "abc123...",      // 32 char
    sow: "def456...",
    program: "ghi789...",
    jobdesk: "jkl012...",
  },
  // ... (picList, divisiList, watermark, pollIntervalMs sama seperti config.example.js)
};
```

---

## 5. Deploy Worker (titan-notion-proxy)

### Install
```bash
cd notion-proxy-worker
npm install
npx wrangler login
```

### Set secrets
```bash
npx wrangler secret put NOTION_TOKEN
# paste secret_… token

npx wrangler secret put PINS
# paste JSON: { "Mada": "1234", "Riza": "5678", ... }
# NOTE: untuk pertama kali, bisa pakai plain PIN (mode DEV)
# Upgrade ke PBKDF2 hash nanti (lihat README.md notion-proxy-worker)

npx wrangler secret put SESSION_SECRET
# paste random 32+ char string (bisa pakai: openssl rand -hex 32)

npx wrangler secret put OWNER_TOKEN
# paste random 32 char string (untuk owner-only /auth/reset)
```

### Deploy
```bash
npx wrangler deploy
```

Output: URL Worker (contoh `https://titan-notion-proxy.YOUR-SUBDOMAIN.workers.dev`).

Paste ke `v2/config.js`:
```js
workerBase: "https://titan-notion-proxy.YOUR-SUBDOMAIN.workers.dev",
mode: "live"
```

---

## 6. Update GitHub Pages

Push changes:
```bash
cd deploy
git add .
git commit -m "feat: V2 live mode + config"
git push
```

Verify: https://tltanpro.github.io/DASHBOARD/v2/ — should show **MODE LIVE** badge.

---

## 7. Verifikasi End-to-End

1. Buka `https://tltanpro.github.io/DASHBOARD/v2/`
2. Click **Login** → pilih PIC → masukkan PIN
3. Click **+ Tambah KPI** → isi form → Submit
4. Cek di Notion: row baru muncul di DB1
5. Edit row di dashboard → cek di Notion: properties terupdate
6. Edit row di Notion langsung → klik Edit di dashboard → konfirmasi 409 "Data sudah diubah"

Kalau 6 step di atas lulus, V2 = live & working.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Worker 404 | Cek `wrangler deploy` output, verify URL |
| Notion 401 | Token salah, regenerate di notion.so/my-integrations |
| Notion 404 | DB ID salah, atau belum di-share ke integration |
| CORS error | `ALLOWED_ORIGIN` env var di wrangler.toml harus match GitHub Pages URL |
| 429 rate limit | Tunggu 30 detik, kurangi poll frequency di `v2/config.js` (`pollIntervalMs: 120000`) |
| Login 401 PIN salah | Cek PINS secret format (JSON valid, key = nama PIC exact) |
| 409 di mana-mana | Edit_Time property belum ditambah di DB (lihat step 2) |

---

## Free Tier Cek

- **Notion**: 10 guests per workspace. 12 PIC = 10 punya Notion + 2 dashboard-only (workaround)
- **Cloudflare Worker**: 100k req/day free. 12 PIC × 60 req = 720 req/day = 0.7% quota
- **GitHub Pages**: free unlimited

Total cost: **Rp 0 / bulan**.
