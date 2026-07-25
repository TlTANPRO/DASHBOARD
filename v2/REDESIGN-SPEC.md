# V2 Dashboard — Redesign Spec (Final)

> Generated: 26 Juli 2026
> Author: Hermes (audit + design synthesis)
> Status: Approved for implementation
> Reference repos: Focalboard, Huly, AFFiNE, AppFlowy

---

## 1. Goals

Replace current dashboard dengan versi yang:
- **Production-grade** (fixes 7 critical + 13 high dari design-audit sebelumnya)
- **Zero build step** (pure HTML/CSS/JS, deploy via GitHub Pages)
- **Modular** (bisa di-extend tanpa rewrite)
- **Notion-native** (tetap pakai Notion sebagai database, Cloudflare Worker sebagai proxy)
- **A11y-grade** (WCAG 2.1 AA minimum)
- **Performance-first** (no framework overhead, FCP < 1.5s, TTI < 2s)

---

## 2. Architecture

### 2.1 Layer separation (adopsi dari Huly)

```
deploy/v2/
├── index.html              ← Single entry point, design tokens, layout shell
├── config.js               ← Runtime config (Notion IDs, PIC list, mode)
├── app.js                  ← Bootstrap + routing + auth
├── lib/
│   ├── api.js              ← Data layer (Notion API via worker / localStorage)
│   ├── store.js            ← State management (pubsub pattern, observable)
│   ├── auth.js             ← Session + PIN login
│   ├── theme.js            ← Theme switcher (dark/light + accent)
│   ├── notify.js           ← Toast/alert system
│   ├── modal.js            ← Reusable modal + confirm
│   ├── router.js           ← Hash-based routing
│   └── format.js           ← IDR, date, percent formatters
├── components/             ← Reusable UI building blocks
│   ├── card.js             ← Bento card
│   ├── table.js            ← Data table dengan sort/filter
│   ├── pill.js             ← Status badge
│   ├── form.js             ← Form fields (input, select, textarea, date)
│   ├── master-view.js      ← Master-detail layout
│   └── stats.js            ← KPI metric card
├── views/                  ← Top-level page components
│   ├── home.js             ← Hero + KPI summary
│   ├── kpi.js              ← KPI CRUD
│   ├── program.js          ← Program Kerja CRUD
│   ├── jobdesk.js          ← Jobdesk harian CRUD
│   ├── sow.js              ← SOW per PIC
│   ├── leaderboard.js      ← Ranking per PIC
│   ├── fee.js              ← Fee closing breakdown
│   ├── pricing.js          ← Harga tier rumah
│   ├── glosarium.js        ← Glossary
│   └── settings.js         ← Theme, mode, data
├── docs/                   ← MD docs (ARCHITECTURE, GUIDE, dll) - keep existing
└── assets/                 ← Logo, icons (SVG inline, no external deps)
```

### 2.2 Routing

Hash-based, e.g.:
- `#/home` — Hero + KPI summary
- `#/kpi` — KPI list
- `#/kpi/new` — Create new KPI
- `#/kpi/:id` — KPI detail
- `#/program`, `#/jobdesk`, `#/sow`, `#/leaderboard`, `#/fee`, `#/pricing`, `#/glosarium`, `#/settings`

Deep linkable, browser back/forward works.

### 2.3 State management

Pubsub pattern (no Redux/Recoil needed):
```js
const store = createStore({
  session: null,
  kpi: [],
  program: [],
  jobdesk: [],
  sow: [],
  pricing: { tiers: [] },
  glosarium: [],
  theme: 'dark',
});
store.subscribe('kpi', () => renderKPI());
```

### 2.4 Data flow

```
Notion API (live)  ──┐
                     ├──→ Cloudflare Worker (proxy) ──→ api.js ──→ store ──→ views
localStorage (demo)──┘
```

Two modes via config.js: `"mode": "live" | "demo"`
- `live`: fetch from worker → Notion
- `demo`: fetch from localStorage (seeded from FALLBACK)

---

## 3. Design system

### 3.1 Color (adopsi dari Huly theme approach, diperbaiki dari audit)

```css
:root {
  /* Base — cool-tinted dark (was #0a0a0a) */
  --bg-base: #0d1117;       /* GitHub-style dark, slightly cool */
  --bg-surface: #161b22;
  --bg-elevated: #1c2128;
  --bg-overlay: rgba(13, 17, 23, 0.85);
  
  /* Text */
  --text-primary: #e6edf3;
  --text-secondary: #b1bac4;
  --text-muted: #8b949e;
  --text-dim: #6e7681;
  
  /* Accent — warm orange (was blue, fixes "AI gradient" fingerprint) */
  --accent: #f78166;
  --accent-hover: #ffa07a;
  --accent-active: #d96c52;
  --accent-glow: rgba(247, 129, 102, 0.15);
  --accent-deep: #8b3a1f;
  
  /* Semantic */
  --success: #3fb950;
  --warning: #d29922;
  --danger: #f85149;
  --info: #58a6ff;
  
  /* Gold/Silver/Bronze (for leaderboard rank) */
  --gold: #d4a017;
  --silver: #b1bac4;
  --bronze: #a0522d;
}
```

Light theme (toggled via `.theme-light` on `<html>`):
```css
.theme-light {
  --bg-base: #ffffff;
  --bg-surface: #f6f8fa;
  --bg-elevated: #ffffff;
  --text-primary: #1f2328;
  --text-secondary: #424a53;
  --text-muted: #656d76;
  --text-dim: #8c959f;
  /* accent tetap */
}
```

### 3.2 Typography

```css
--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-display: 'Inter', system-ui, sans-serif;  /* SAMA dengan sans, lebih aman */
--font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;

--text-xs: 0.75rem;     /* 12px - badge, label */
--text-sm: 0.875rem;    /* 14px - body small */
--text-base: 1rem;      /* 16px - body */
--text-lg: 1.125rem;    /* 18px - card title */
--text-xl: 1.5rem;      /* 24px - section title */
--text-2xl: 2rem;       /* 32px - hero stat */
--text-3xl: clamp(2.25rem, 5vw, 3.5rem);  /* hero title */

--line-display: 1.05;
--line-heading: 1.2;
--line-body: 1.6;
--line-mono: 1.4;
```

### 3.3 Spacing & layout

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-8: 3rem;
--space-10: 4rem;
--space-12: 6rem;

--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 18px;
--radius-pill: 999px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
--shadow-md: 0 4px 16px rgba(0,0,0,0.6);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.7);
--shadow-glow: 0 0 32px var(--accent-glow);

--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 3.4 Components (each is a small module)

| Component | Purpose | Notes |
|-----------|---------|-------|
| `<x-card>` | Bento card with title, body, action | Border + bg-elevated, hover lift |
| `<x-table>` | Sortable, filterable data table | Virtual scroll when >50 rows |
| `<x-pill>` | Status badge (success/warn/danger/info) | Uses semantic color |
| `<x-stat>` | KPI metric (label, value, delta) | Big number + arrow |
| `<x-modal>` | Reusable modal with backdrop | Trap focus, Esc close, restore focus |
| `<x-toast>` | Bottom-right notification | Pause on hover, role=status |
| `<x-form-field>` | Label + input/select/textarea | Validation state visible |
| `<x-confirm>` | Confirm dialog (replaces window.confirm) | Danger variant for delete |
| `<x-tabs>` | Tab switcher | Keyboard arrow nav |
| `<x-tag>` | Inline tag chip | Removable variant |
| `<x-empty>` | Empty state with icon + message | Used when no data |

---

## 4. Fixes applied (from design-audit)

### 4.1 Critical (7 items)

| # | Issue | Fix |
|---|-------|-----|
| 1 | No skip-to-content | `<a class="skip-link" href="#main">` at start of body |
| 2 | Focus ring hilang on inputs | `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }` |
| 3 | `window.confirm()` for delete | `<x-confirm>` component |
| 4 | Modal not trap focus / Esc close | `modal.js` auto-trap + Escape key |
| 5 | `★` icon hardcoded | Replace with semantic SVG icons |
| 6 | XSS via `innerHTML` | `escapeHTML()` helper atau `textContent` |
| 7 | Inline styles 5+ places | Extract ke utility classes (`.flex`, `.gap-3`, `.tnum`, dll) |

### 4.2 High (13 items, semua addressed)

- Background tinted dark (#0d1117 bukan #0a0a0a)
- Nav pakai sans-serif (bukan mono)
- Single warm orange accent (bukan blue)
- All-pill badges pakai solid color (no border + bg redundancy)
- Section numbering konsisten (01, 02, 03, ... atau A, B, C — pilih salah satu)
- Form interpolation escape via `setAttribute` atau helper
- Text truncate pakai CSS ellipsis + title attribute
- Toast pause on hover + role="status"
- `renderMasterView` build DOM fragment in single pass
- `pollTimer` encapsulated di `Poller` class

### 4.3 Accessibility additions

- `prefers-reduced-motion: reduce` → disable animations
- `prefers-color-scheme: light` → auto-switch theme (or manual toggle)
- All interactive elements: `aria-label` atau visible text
- All forms: `<label>` properly associated
- All images/icons: `aria-hidden="true"` kalau decorative, `aria-label` kalau functional
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Table: `<th scope="col">`, caption
- Tab order: logical, no `tabindex > 0`

---

## 5. Feature roadmap

### Phase 1 (MUST — done in this redesign)
- [x] Design tokens (color, type, space, radius, shadow, duration, ease)
- [x] Layout shell (topbar, sidenav, main, status bar)
- [x] Auth (PIC dropdown + PIN, session 12h)
- [x] Notion API integration via Cloudflare Worker
- [x] Demo mode (localStorage fallback)
- [x] KPI CRUD (create, read, update, delete)
- [x] Program Kerja CRUD
- [x] Jobdesk Harian CRUD
- [x] SOW per PIC
- [x] Leaderboard ranking
- [x] Fee closing breakdown
- [x] Pricing tier
- [x] Glosarium
- [x] Theme switcher (dark/light + accent picker)
- [x] Toast/alert system
- [x] Modal/confirm system
- [x] Auto-poll (60s, visibility-aware)
- [x] Empty states
- [x] Loading states (skeleton)
- [x] Error states
- [x] Mobile responsive
- [x] A11y WCAG 2.1 AA

### Phase 2 (future, out of scope)
- Real-time collaboration (CRDT)
- Offline mode (IndexedDB)
- Push notifications
- Calendar view
- Gantt chart
- File attachments
- Search global
- Bulk import/export
- Audit log UI

---

## 6. Open decisions

- App name: "Dashboard Syahfalah" atau ringkasan lain? (defer to user)
- Logo: pakai inisial "SL" di favicon (sudah ada) atau ganti?
- Color accent: warm orange (default) atau warna lain? (defer to user)
- Demo data: keep atau hapus dari shipped version?

---

## 7. Migration path

Current state: `app.js` (64.4 KB) monolithic.
Target: modular `app.js` + `lib/*` + `components/*` + `views/*`.

Migration: rewrite from scratch (cleaner), preserve data layer (Notion IDs, SSOT paths, FALLBACK).

Backup current: keep `app-v3.js` through `app-v7.js` as historical reference. Keep `app.js` as old version. New code lives in separate files.

Deploy: index.html loads `app.js` as bootstrap, which dynamically imports other modules.
