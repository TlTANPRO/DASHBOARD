# ARCHITECTURE — Dashboard V2

Sistem: **GitHub Pages** + **Notion DB** + **Cloudflare Worker proxy**.

## Diagram

```
┌─────────────────────┐
│   Browser (12 PIC)  │
│  GitHub Pages (V2)  │
│  github.io/DASHBOARD/v2/ │
└──────────┬──────────┘
           │ fetch /notion/v1/* + /auth/*
           ▼
┌─────────────────────┐
│ Cloudflare Worker   │
│ titan-notion-proxy  │
│ (free tier)         │
└──────────┬──────────┘
           │ HTTPS + Authorization
           ▼
┌─────────────────────┐
│  Notion API         │
│  api.notion.com/v1  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4 Notion DBs       │
│  · KPI Tracker      │
│  · Scope of Work    │
│  · Program Kerja    │
│  · Jobdesk Harian   │
└─────────────────────┘
```

## Komponen

### 1. Frontend (V2 dashboard)

**File**: `deploy/v2/index.html` (single-file, ~50KB) + `app.js` (V2 logic, ~50KB) + `data-loader.js` (V1 SSOT) + `config.js` (gitignored secrets)

**Sections** (13 total):
- Hero, 01 Struktur (V1)
- V2-A KPI Tracker (CRUD)
- V2-C Program Kerja (CRUD + filter)
- V2-D Jobdesk Harian (CRUD + filter)
- V2-B My SOW (view + filter)
- 02 Leaderboard (auto-compute dari KPI)
- 03 KPI Score Card, 04 Fee Media, 05 Pricing, 06 STB, 07 Manager, 08 Glosarium (V1 read-only)

**Styling**: V1 design DNA + extended dengan modal, toast, filter-bar, CRUD table.

**Auth**: PIN login → session token di sessionStorage → 12 jam expiry.

### 2. Cloudflare Worker (titan-notion-proxy)

**Repo**: `https://github.com/TlTANPRO/notion-proxy-worker/`

**Routes**:
- `/` → health check
- `/auth/login` (POST) → verify PIN, return session token
- `/auth/reset` (POST) → owner-only PIN reset
- `/notion/v1/*` → forward ke Notion API

**Features**:
- CORS lock ke `https://tltanpro.github.io`
- Exponential backoff pada 429 (350ms × 2^attempt, max 3)
- 409 optimistic lock via X-Edit-Time header
- Multi-PIN bcrypt/PBKDF2 verify
- HMAC-SHA256 session token (`titan.PIC.EXP.SIG`)

**Secrets** (via `wrangler secret put`):
- `NOTION_TOKEN` — Notion internal integration
- `PINS` — JSON `{pic: hash}` 12 PIC
- `SESSION_SECRET` — HMAC key
- `OWNER_TOKEN` — admin auth

**Free tier**: 100k req/day. 12 PIC × 60 req/day = 720/day = 0.7% quota.

### 3. Notion Backend

4 database di single workspace:

| DB | Purpose | Owner |
|----|---------|-------|
| KPI Tracker | KPI bulanan/mingguan/kuartalan | Self + Owner review |
| Scope of Work | Jobdesc per PIC | Owner input, PIC view |
| Program Kerja | Project Q1-Q4 | PIC + Owner |
| Jobdesk Harian | Task harian + target | Self |

**Schema**: lihat `SETUP.md` section 2.

**Guest limit**: Notion free = 10 guests. Workaround: 10 PIC punya Notion account, 2 PIC dashboard-only (input via dashboard → Worker → Notion, tanpa akses langsung).

## Data Flow

### Read (poll)
```
Browser mount
  → API.query("kpi")
  → fetch(workerBase + "/notion/v1/databases/{id}/query")
  → Worker forward
  → Return paginated rows
  → Dashboard render
  → visibilitychange listener: re-poll kalau tab aktif
  → setInterval(pollIntervalMs = 60000)
```

### Write (create)
```
User click "+ Tambah KPI"
  → Modal form
  → Submit
  → API.create("kpi", properties)
  → fetch(workerBase + "/notion/v1/pages", POST)
  → Worker forward
  → Return page object
  → Dashboard optimistic update + toast "Tersimpan"
```

### Write (update with optimistic lock)
```
User click "Edit KPI" row #5
  → Load row, simpan _editTime
  → Modal form pre-filled
  → Submit
  → API.update("kpi", id, properties, editTime)
  → fetch(workerBase + "/notion/v1/pages/{id}", PATCH, header X-Edit-Time: ...)
  → Worker: GET current page, compare last_edited_time
  → Match → PATCH Notion → return 200
  → Mismatch → 409 → dashboard show "Refresh dulu"
```

### Auth
```
User click "Login"
  → Modal: pilih PIC + PIN
  → Submit
  → fetch(workerBase + "/auth/login", POST)
  → Worker: verify PIN via PINS secret (PBKDF2)
  → Match → return token (HMAC-SHA256)
  → Save di sessionStorage
  → Update session pill UI
  → Load V2 sections
```

## Mode Switch

**Demo mode** (`config.js: mode: "demo"`):
- Data di localStorage browser saja
- Tidak perlu Notion
- Tidak perlu Worker
- Untuk testing UI / training PIC

**Live mode** (`config.js: mode: "live"`):
- Data di Notion (shared, real-time)
- Worker required (CORS bypass)
- Untuk production dengan 12 PIC

Toggle: edit `v2/config.js`, push ke GitHub Pages.

## File Tree

```
buku-management-syahfalah/
├── deploy/                         ← GitHub Pages root
│   ├── index.html                  ← V1 (frozen)
│   ├── data/tim-v2/*.json          ← V1 SSOT (51 files)
│   ├── v1-archive/                 ← V1 freeze notice
│   ├── v2/                         ← V2 BARU
│   │   ├── index.html              ← V2 single-file shell
│   │   ├── app.js                  ← V2 logic + CRUD
│   │   ├── data-loader.js          ← V1 SSOT loader
│   │   ├── config.example.js       ← Config template (committed)
│   │   ├── config.js               ← Real config (gitignored)
│   │   └── docs/
│   │       ├── SETUP.md
│   │       ├── OPERATIONS.md
│   │       └── ARCHITECTURE.md (this file)
│   └── .gitignore                  ← +v2/config.js
│
└── notion-proxy-worker/            ← Worker repo (NEW)
    ├── wrangler.toml
    ├── package.json
    ├── .gitignore
    ├── README.md
    └── src/
        ├── index.js                ← Router + auth
        └── notion.js               ← Notion caller + retry + 409
```

## Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Notion 10-guest limit | High | 10 punya Notion + 2 dashboard-only |
| 2 | Token leak di HTML | Critical | Token cuma di Worker secret + config.js gitignored |
| 3 | V1 live link break | High | V1 di root, V2 di /v2/, banner 1 line |
| 4 | Notion rate limit 3 req/s | Medium | Worker retry + dashboard poll 60s |
| 5 | Concurrent edit overwrite | Medium | Edit_Time optimistic lock + 409 |
| 6 | Schema drift | Low | Defensive read + 5 axis schema check |
| 7 | PIN brute force | Low | Worker rate limit 5/5min/IP (future) |
| 8 | Worker free quota | Low | 0.7% usage |
| 9 | Notion 30-day guest inactive | Low | PIC pakai dashboard, tidak perlu aktif di Notion |
| 10 | Bahasa/watermark drift | Low | V1 SSOT tetap dipakai |

## Build Order (10 hari)

1. ✅ Sprint 0.1: Worker repo + code
2. ✅ Sprint 0.2: V2 shell + V1 banner
3. ✅ Sprint 1: V2-A KPI Tracker (read+CRUD)
4. 🔄 Sprint 2: V2-B/C/D + filter + polish
5. ⏳ Sprint 3: User setup Notion + Worker
6. ⏳ Sprint 4: Multi-PIC testing + 409 verification
7. ⏳ Sprint 5: Cutover + WhatsApp blast

## Future (v3+)

- Service worker offline cache
- PIN → magic link (email)
- Mobile native wrapper (Capacitor)
- Cross-tab BroadcastChannel sync
- Notion formulas untuk auto-grade
- AI insights via OpenRouter
- PDF export per PIC
- WhatsApp bot reminder (H-1 jobdesk)
