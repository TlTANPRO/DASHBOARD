# Dashboard V4 — Buku Management Syahfalah (V4 ISOLATED)

Internal control-center dashboard for **PT Syahfalah Global** + **PT Lembayung Wanantara Padha**.
12 PIC across 6 divisi (Owner / Legal / Marketing / Admin / Proyek / Media).

> **V4 ISOLATED STACK** — Fully separate from V2 (titan-notion-proxy + V2 Notion DBs).
> See [V4 isolation note](#v4-isolated-stack-vs-v2) below.

## Stack

- Vanilla ESM + zero bundler
- Single `index.html` + ES modules
- **V4 ISOLATED** Cloudflare Worker as Notion proxy (`titan-v4-notion-proxy`)
- Bundled JSON (`data/*.json`) as offline fallback
- Service Worker PWA (hash-based cache, user-initiated update)

## Beat-Notion UX Features (V4 specific)

- ⌘K / Ctrl+K global search palette (across PIC, KPI, jobdesk, SOW)
- View switcher per table: **List / Board / Gantt / Calendar**
- Inline edit on cells (Owner-only)
- Bulk select + bulk actions per table
- Aggregation footer (count, %, sum, IDR total)
- Per-column sort, per-column filter, full-text search
- Toast notifications (no native `alert()`)
- PWA install + update prompts (user-initiated, no auto-reload)
- Single Indigo accent, OKLCH-based, dark mode
- Charts: bar, line, donut, heatmap, sparkline, gauge (vanilla SVG, no library)

## Local dev

```bash
cd "dashboard V4"
python scripts/devserver.py . 8080
# Open http://127.0.0.1:8080
# Add ?nosw=1 to skip service worker for fresh load
```

## Login (default)

- PIN **0000** for all 12 PIC
- Owner (Pak Ardian) can override per-PIC PIN via Settings

## V4 ISOLATED STACK (vs V2)

| | V2 | V4 |
|---|---|---|
| Worker name | `titan-notion-proxy` | **`titan-v4-notion-proxy`** |
| Worker URL | V2 subdomain | **V4 subdomain baru** |
| Notion DBs | V2 UUIDs (e.g. `d3d4cf7e-...`) | **V4 UUIDs baru (dari setup-notion-v4)** |
| SESSION_SECRET | V2 secret | **V4 secret baru (rotate 28 Jul 2026)** |
| NOTION_TOKEN | V2 integration | **V4 integration baru** |
| Dashboard path | `tltanpro.github.io/DASHBOARD/v2/` | `tltanpro.github.io/DASHBOARD/v4/` |

**Why isolated?** V2 Notion DBs sudah ada data production 27 Jul 2026. V4 butuh schema bersih untuk beat-Notion UX tanpa migrate data lama.

## Phase status

| Phase | Status | Notes |
|-------|--------|-------|
| A — Pre-Build Audit | DONE | 29 bugs catalogued |
| B — Worker Hardening | DONE | C2/C3/H1/M1-M4 (inherited from V2) |
| C — DOCX Parser + Scripts | DONE | 4 V2 scripts + 3 V4 scripts (`setup-notion-v4.mjs`, `apply-patches-v4.mjs`, `snapshot-v4.mjs`) |
| 0 — V4 Token Rotation + Setup | **READY** | `cd scripts && node setup-notion-v4.mjs` |
| 1 — Shell + Auth | DONE | Phase 1 build complete |
| 2 — V4 Worker Deploy | **READY** | `cd ../../notion-proxy-worker-v4 && npx wrangler deploy` |
| 3 — 6 Views (Beat-Notion) | DONE | owner/legal/marketing/admin/proyek/media with view-switcher + inline edit |
| 4 — Polish + Launch | TODO | a11y, Lighthouse, E2E |

## Deploy steps (V4)

```bash
# 1. Pre-flight: create V4 Notion parent page
#    Notion → new page "Syahfalah V4 Stack" → copy ID

# 2. Run V4 setup (creates 9 V4 DBs + seeds)
cd "dashboard V4"
cp .env.example .env
# Edit .env: NOTION_TOKEN (V4 integration), NOTION_PARENT_PAGE_ID
node scripts/setup-notion-v4.mjs
# Output: data/schema-map.json with V4 UUIDs (stack: "V4-isolated")

# 3. Deploy V4 Worker
cd ../notion-proxy-worker-v4
# Edit wrangler.toml if needed (set ALLOWED_ORIGINS)
npx wrangler deploy
# Output: https://titan-v4-notion-proxy.<sub>.workers.dev
# Set Cloudflare Worker env vars: NOTION_TOKEN, SESSION_SECRET, PINS, OWNER_TOKEN

# 4. Snapshot V4 Notion → data/*.json (V4-specific)
cd "../dashboard V4"
WORKER_URL=https://titan-v4-notion-proxy.<sub>.workers.dev \
SESSION_TOKEN=<bearer-from-worker-auth-login> \
node scripts/snapshot-v4.mjs

# 5. Deploy dashboard to gh-pages
git add . && git commit -m "V4 dashboard — beat-Notion UX + isolated stack"
git push origin main:gh-pages
# Or: gh workflow run deploy.yml

# 6. Verify
curl https://titan-v4-notion-proxy.<sub>.workers.dev/
# Expected: {"name":"titan-v4-notion-proxy","version":"4.0.0","stack":"V4-isolated"}
```

## Security

V4 inherits all V2 hardening:
- C2: SESSION_SECRET hard-fail (no `dev-secret` fallback)
- C3: PBKDF2 only (no plaintext PIN compare)
- H1: CORS allowlist via `ALLOWED_ORIGINS`
- M1: flattenResponse only on GET
- M2: preflight 403 if origin not allowlisted
- M3: checkOptimisticLock fail-closed

Plus V4-specific:
- Worker name `titan-v4-notion-proxy` (no collision with V2)
- Default origin `https://tltanpro.github.io/DASHBOARD/v4`
- Separate `SESSION_SECRET` + `NOTION_TOKEN` (no reuse from V2)
- Setup/snapshot scripts refuse to run against V2 worker (URL must contain "v4")

## Design DNA

- Single accent **Indigo OKLCH 58/0.21/270** across all 6 divisi
- Divisi differentiation by content density, chart type, watermark
- No hover:scale, no emojis in UI, tnum font feature for KPI numbers
- SectionLabel 01-N numbering
- Bento layouts (4-quad, 2/3 + 1/3, half-half, full)
