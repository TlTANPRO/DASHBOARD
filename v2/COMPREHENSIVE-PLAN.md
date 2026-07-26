# DASHBOARD V2 — COMPREHENSIVE REDESIGN PLAN v3
## Goal: Beat Notion for property-dev use case

**Date**: 26 Juli 2026
**References**: Focalboard, Huly/platform, AFFiNE, AppFlowy
**Mode**: Free-only (GitHub Pages + Cloudflare Worker + Notion)
**Live**: https://tltanpro.github.io/DASHBOARD/v2/

---

## PHASE 0: FOUNDATION FIXES (must-have, 30 min)

### 0.1 Client-side cache layer
- Add TTL cache in `lib/api.js`: Map per DB, 60s default
- Cache `listKPI`, `listProgram`, `listJobdesk`, `listSOW`
- Background revalidation setiap 5 menit (silent)
- Manual refresh button tetap ada
- **Result**: filter instant, navigasi <100ms, no loading spam

### 0.2 Fix watermark visual conflict
- Watermark tetap di top-right tapi lebih tipis (opacity 0.2)
- Slightly different position to not clash with topbar

### 0.3 Better loading state
- Top progress bar saat fetch
- Skeleton lebih akurat (row-by-row)
- Error toast untuk connectivity issues

### 0.4 Mobile responsive fix
- Hamburger menu untuk sidenav di <1024px
- Bottom tab bar alternatif

---

## PHASE 1: NOTION-BEATING FEATURES (must-have, 4 hours)

### 1.1 Global search (Cmd+K)
- Modal-style search, full-screen overlay
- Index semua DB (KPI/Program/Jobdesk/SOW) di memory
- Fuzzy match di title, indikator, catatan
- Keyboard navigation (↑↓ + Enter)
- Recent searches history

### 1.2 Group by (like Notion Board view)
- Toggle: group by PIC / Divisi / Status / Tipe / Quarter
- Untuk KPI, Program, Jobdesk views
- Collapsible groups dengan count badge
- Sticky group headers

### 1.3 Inline edit
- Click cell → edit input/select
- Save on blur atau Enter
- Cancel on Escape
- Optimistic UI update + rollback on error
- Hanya untuk field: Actual, Status, Catatan, Progress

### 1.4 Bulk operations
- Checkbox per row
- Sticky action bar saat ada selection
- Bulk delete (owner only)
- Bulk status update
- Bulk PIC reassign

### 1.5 Aggregation (rollup) di footer tabel
- Sum, Average, Min, Max, Count per kolom
- Configurable per user
- Real-time recalculate saat filter berubah
- Footer dengan separator line

### 1.6 Sortable columns
- Klik header → cycle asc/desc/none
- Visual indicator (▲▼)
- Multi-sort dengan Shift+click

### 1.7 Calendar view untuk Jobdesk
- Monthly grid, 7×5
- Tanggal dari field Tanggal
- Click date → add jobdesk
- Color-coded by PIC
- Today indicator

### 1.8 Timeline/Gantt untuk Program
- Horizontal bars per program
- Date range from Tanggal Mulai → Deadline
- Progress overlay
- PIC swimlanes

---

## PHASE 2: UX POLISH dari 4 REFERENSI (2 hours)

### 2.1 Dari FOCALBOARD
- Board view (Kanban-style) untuk KPI/Program/Jobdesk
- Cards dengan cover color per status
- Drag-drop untuk pindah status (future: dengan WS)

### 2.2 Dari HULY/platform
- Properties panel sidebar (klik row → slide-in detail)
- Focus mode untuk row edit
- Plugin-style extension (architecture memungkinkan)

### 2.3 Dari AFFiNE
- Doc-mode untuk notes/catatan per entity
- Block-based editor (simple paragraphs)
- Slash commands (lightweight)

### 2.4 Dari AppFlowy
- Database templates (create from template)
- Database view switching (List/Board/Calendar/Timeline)
- Mention/autocomplete untuk PIC

---

## PHASE 3: VISUAL PERFECTION (1.5 hours)

### 3.1 Animation & motion
- Page transition (slide)
- Card hover lift
- Toast slide-in
- Modal fade+scale
- Skeleton shimmer
- Reduce-motion respected

### 3.2 Color & spacing refinement
- Additional accent colors (success, warning, danger shades)
- Better gradient on hero
- Card hover states dengan subtle border-color shift
- Focus ring improved

### 3.3 Typography
- Variable font weight (300-700)
- Better text hierarchy
- Number font (tabular) diperluas ke semua numeric
- Line height per role (1.4 body, 1.2 heading, 1.6 long-form)

### 3.4 Layout density
- Compact mode toggle
- Comfortable mode (default)
- Spacious mode (new)
- LocalStorage preference

### 3.5 New topbar
- Quick capture button (Cmd+N)
- Notifications bell (count badge)
- Quick switcher (Cmd+K)
- Sync indicator (last updated Xs ago)

---

## PHASE 4: DATA INSIGHTS (1.5 hours)

### 4.1 Charts (canvas-based, no chart library)
- Bar chart: KPI achievement per PIC
- Donut chart: status distribution
- Line chart: jobdesk trend 7 hari
- Sparkline di stat cards
- Tooltip on hover

### 4.2 Dashboard home revamp
- Real-time KPI summary
- Top performers leaderboard
- Activity timeline (last 10 events)
- Quick actions per role
- Personal widgets (PIC login)

### 4.3 Cross-DB insights
- "PIC ini punya 5 KPI + 3 Program + 8 Jobdesk belum selesai"
- "Program terlambat: X" di home
- "Jobdesk butuh approval: Y"

### 4.4 Saved views per user
- Save filter + sort + group combo
- LocalStorage per PIC
- Quick switcher in view header
- Default view on page load

---

## PHASE 5: PWA + OFFLINE (1 hour)

### 5.1 Service worker
- Cache static assets
- Offline fallback page
- Background sync (future: kalau mau)

### 5.2 Manifest.json
- Icons (192, 512)
- Theme color
- Display: standalone
- Installable to home screen

### 5.3 Offline-first data
- LocalStorage sebagai primary read
- Background sync ke Notion saat online
- Conflict resolution (last-write-wins dengan timestamp)

---

## PHASE 6: POWER USER FEATURES (1.5 hours)

### 6.1 Quick capture (Cmd+N)
- Mini form di topbar
- Tambah KPI/Jobdesk/Program tanpa navigate
- Type-to-filter PIC
- Recent captures

### 6.2 Keyboard shortcuts
- Cmd+K: search
- Cmd+N: new
- Cmd+1..9: navigate
- Cmd+R: refresh
- Cmd+B: toggle sidenav
- Cmd+/: show shortcuts

### 6.3 Export & reporting
- Export ke CSV per view
- Export ke JSON (full snapshot)
- Print-friendly CSS
- Weekly report auto-generate

### 6.4 Comments & audit log
- Tiap row punya comment thread
- Edit history (last 10 edits)
- Owner dapat lihat siapa edit apa kapan
- Timestamps

---

## PHASE 7: ROLE-BASED EXPERIENCE (1 hour)

### 7.1 Owner (Pak Ardian, Bu Nisya, Mada)
- Lihat semua data
- Edit/delete semua
- Bypass optimistic lock
- Audit log access

### 7.2 PIC regular
- Lihat semua data
- Edit hanya row PIC sendiri
- Tidak bisa delete
- Default view: "My KPI"

### 7.3 Guest (no login)
- Read-only semua data
- Tidak bisa edit
- Default view: read-only home

---

## PHASE 8: DEPLOYMENT & DOCS (30 min)

### 8.1 Final commit
- Merge semua phase
- Test di production URL
- Verify mobile

### 8.2 Update REDESIGN-SPEC.md
- Final feature list
- Migration guide (Notion → Dashboard)
- Known limitations

### 8.3 Commit history clean
- Single comprehensive commit
- Branch `comprehensive-redesign-v3`
- Merge ke main

---

## TOTAL EFFORT ESTIMATE
- Phase 0: 0.5 hour
- Phase 1: 4 hours
- Phase 2: 2 hours
- Phase 3: 1.5 hours
- Phase 4: 1.5 hours
- Phase 5: 1 hour
- Phase 6: 1.5 hours
- Phase 7: 1 hour
- Phase 8: 0.5 hour
**TOTAL: 13.5 hours** (compressed into this session as fast as possible)

## SUCCESS CRITERIA
- [x] Cache layer (instant filter)
- [ ] Search Cmd+K
- [ ] Group by
- [ ] Inline edit
- [ ] Bulk operations
- [ ] Aggregation footer
- [ ] Sortable columns
- [ ] Calendar view (Jobdesk)
- [ ] Gantt view (Program)
- [ ] Board view (KPI/Program/Jobdesk)
- [ ] Detail panel (slide-in)
- [ ] Charts (bar/donut/line/sparkline)
- [ ] PWA installable
- [ ] Keyboard shortcuts
- [ ] Export CSV/JSON
- [ ] Comments/audit log
- [ ] Role-based UI
- [ ] Saved views
- [ ] Mobile PWA tested
- [ ] Light theme refined

## EXECUTION ORDER
1. Phase 0 (cache + foundation) — must, do first
2. Phase 1 (notion-beating features) — core differentiator
3. Phase 3 (visual polish) — make it pretty
4. Phase 4 (insights) — wow factor
5. Phase 2 (referensi features) — cherry on top
6. Phase 5 (PWA) — bonus
7. Phase 6 (power user) — for heavy users
8. Phase 7 (role) — when needed
9. Phase 8 (deploy) — final