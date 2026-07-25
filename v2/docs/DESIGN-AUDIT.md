# V2 Design Audit — 25 Jul 2026

> Audit dijalankan dengan checklist dari `redesign-existing-projects` (typography, color, layout, interactivity, content, components) + `ui-ux-pro-max` (10-priority matrix). Scope: `deploy/v2/index.html` (1005 baris) + `deploy/v2/app.js` (1223 baris).

## Summary

| Kategori | Score | Catatan |
|----------|-------|---------|
| **Typography** | 6/10 | Inter + JetBrains Mono sudah oke, ukuran display solid (`clamp(2.25rem, 5vw, 4rem)`), `tabular-nums` applied. Kurang: font pairing berani, semua-mono untuk nav agak monoton, weight terbatas 400/500/600/700. |
| **Color & Surfaces** | 7/10 | Single accent (blue #3b82f6), neutral dark, tinted shadows via opacity. Kekurangan: pure `#0a0a0a` base (bukan tinted dark), terlalu banyak "AI fingerprint" muted-gray + single blue accent, ZERO texture/grain. |
| **Layout** | 6/10 | Bento grid responsive, container max 1440px, 8dp-ish spacing. Kurang: brand-mark tidak konsisten dengan hero, semua section numbered 01-08 tapi V2 pakai `★` (mixed numbering), sidebar dashboard pattern default. |
| **Interactivity & States** | 5/10 | Toast + modal + filter bar ada. Kurang besar: NO focus ring visible, NO pressed/active scale, NO loading skeleton, NO empty state untuk login, error pakai `confirm()` browser native. |
| **Content** | 7/10 | Indonesian baik, nama PIC realistis, no Lorem Ipsum, no AI clichés. Kurang: semua emoji icon (→ ★ ✓ ↩), placeholder `★` di section-num tidak informatif, "V2 LIVE" hype copy. |
| **Components** | 6/10 | CRUD table, pill status, bento card, modal, filter bar. Kurang: all-pill badges, confirm pakai native `window.confirm`, pill border + bg + text = generic pattern. |
| **Accessibility** | 4/10 | LANGKA: skip-to-content, aria-label minimal, focus ring hilang (no `:focus-visible`), modal trap focus TIDAK ada, Escape close TIDAK ada, role= hanya di `role="banner"`. |
| **Performance** | 7/10 | `font-display:swap` implied, scroll-behavior smooth, 60s polling visibility-aware. Kurang: V1 DATA-SSOT loader synchronous, NO skeleton, FOUT potential di Inter/JetBrains Mono preload. |
| **Code Quality** | 6/10 | Inline styles 5+ kali (lines 701, 752, 1025, 1031, 418, dll), `setHTML`-style innerHTML dengan user-controlled data, hardcoded colors di renderPricing/renderLeaderboard (`var(--gold)` inline). |
| **Strategic Completeness** | 5/10 | NO skip-to-content, NO 404 page, NO cookie consent, NO reduced-motion respect, NO deep-link query params, NO `prefers-color-scheme`, NO breadcrumb (despite 3+ level sections). |

**Rata-rata: 5.9/10** — solid V1 DNA (typography scale, spacing tokens, dark theme), tapi generic AI-template fingerprint di banyak tempat, dan accessibility-grade work belum dilakukan.

---

## Critical (must fix)

- **[index.html:142-144] Tidak ada skip-to-content link.** Keyboard user harus tab 14+ nav links untuk sampai ke `<main>`. **Fix:** Tambah `<a class="skip-link" href="#main">Skip to main content</a>` di awal body dengan CSS: `.skip-link{position:absolute;left:-9999px}.skip-link:focus{left:var(--space-4);top:var(--space-4);z-index:9999;background:var(--accent);color:#fff;padding:var(--space-2) var(--space-3);border-radius:var(--radius-md)}`

- **[index.html:484-488] Focus ring hilang di input/select/textarea.** `outline:none` di-focus tanpa replacement ring. **Fix:** Ganti `.input:focus, .select:focus, .textarea:focus{outline:none}` jadi `outline:2px solid var(--accent);outline-offset:2px` (atau pakai `box-shadow:0 0 0 3px var(--accent-glow)`).

- **[app.js:589, 760, 924] Pakai `window.confirm()` untuk delete confirmation.** Browser-native modal violates design system, no theming, no animation. **Fix:** Build confirm modal reusable — `confirmDialog({title, body, danger:true, onConfirm:...})` yang pakai modal-backdrop existing.

- **[app.js:133-144, 142-144] Modal tidak trap focus, tidak close on Escape, tidak restore focus.** Keyboard + screen-reader user bisa "lose" modal. **Fix:** Pasang keydown listener `Escape→closeModal()`, focus ke first input saat open, return focus ke trigger button saat close.

- **[index.html:386-394] `★ B10 PIC` label hardcoded + overflow posisi fixed.** Pakai unicode `★` sebagai icon (not semantic), `top:-8px` clip jika card top edge dekat container. **Fix:** Pakai SVG star icon di slot, atau ganti jadi pill di header card.

- **[app.js:135, 555, 573, dll] `innerHTML =` dengan data potentially user-controlled** (`r["KPI ID"]`, `r.PIC`, `r.Catatan`) tanpa escape. Demo mode seed data aman, tapi live mode + user-input → XSS. **Fix:** Escape via `textContent` atau `escapeHTML()` helper sebelum inject.

- **[index.html:701, 752, 1025, 1031, 418] Inline styles 5+ kali di markup.** Mixing class + inline defeats design system. **Fix:** Extract ke utility classes (`.flex-row`, `.gap-3`, `.tnum-bold`, dll) atau per-section classes.

---

## High (should fix)

- **[index.html:12-15] Pure `#0a0a0a` background.** Generic template black. **Fix:** Pakai tinted dark `oklch(14% 0.005 240)` atau `#0a0e14` (slight cool tint), tambahkan subtle radial gradient di body untuk depth (seperti web-design-guidelines "Empty flat sections").

- **[index.html:156-166] Nav link semua pakai `font-family: var(--font-mono)`.** Monospace untuk nav = monoton, menurunkan hierarchy. **Fix:** Sans-serif untuk nav (`var(--font-sans)`), keep mono untuk ID/badge saja.

- **[index.html:21-22] Single accent color `#3b82f6` (blue) + border-blue + bg-blue glow.** "AI gradient" fingerprint. **Fix:** Pilih accent intentional (mis. `oklch(68% 0.21 30)` warm orange untuk "energi operasional" PT konstruksi), single accent only, drop `#1e40af` di brand-mark linear-gradient.

- **[index.html:172-175] V2-new badge pakai border 1px + color `var(--success)`.** Generic pill badge. **Fix:** Ganti jadi small text-only "BARU" (10px, font-weight 700, color success) tanpa border.

- **[index.html:779-806] V2 CRUD sections pakai `★` sebagai section-num, bukan angka.** Mixed numbering: section 01-08 lalu `★` interrupts count. **Fix:** Tetap pakai `04-A`, `04-B`, `04-C`, `04-D` (sub-numbering) — atau pisahkan V1 (1-8) vs V2 (9-12) dengan jelas.

- **[app.js:670, 673, 680, dll] Form pakai `<input value="${...}">` interpolation raw.** Jika value mengandung `"` atau `<` akan break HTML. **Fix:** Escape function atau `setAttribute('value', ...)` via DOM API.

- **[app.js:1044-1061] `renderKPI5D()` pakai `dim.indexOf(d)+1` untuk nomor dimensi.** Setiap render scanning array O(n²). **Fix:** Map index di loop, atau pakai `.map((d, i) => ...)`.

- **[app.js:467-487, 636-657, 807-824, 962-974] Tabel cell pakai `.slice(0, 50)` untuk truncate text** tanpa ellipsis indicator + tidak expand on click. **Fix:** Pakai `text-overflow:ellipsis` CSS + `title` attribute untuk full text, atau expand-on-click popover.

- **[app.js:122-128] Toast pakai `el.remove()` setTimeout 3.5s hardcoded, NO pause on hover, NO action button.** Generic notification. **Fix:** Pause on hover (`mouseenter` clearTimeout, `mouseleave` reset), add `role="status"` + `aria-live="polite"`, support action button (mis. "Undo").

- **[index.html:445-447] `.crud-toolbar` flex-wrap tapi tidak ada gap uniform.** Bungkus toolbar dengan `gap:var(--space-3)` (sudah ada), tapi `+ Tambah KPI` di kanan — pada narrow screen button jatuh ke bawah dengan alignment random. **Fix:** Tambah `justify-content:flex-end` dan atur breakpoint explicit.

- **[index.html:421-440] `.pic-tasks li::before` pakai unicode `›`.** Fallback font, inconsistent rendering. **Fix:** SVG chevron inline atau pseudo-element dengan border-based triangle.

- **[app.js:984-1039] `renderLeaderboard()` rewrite DOM via classList + style + className + innerHTML chain.** Inefficient, layout thrashing. **Fix:** Build DOM fragment in single pass, `replaceChildren(fragment)`.

- **[app.js:1213-1223] `visibilitychange` listener setup di global, `pollTimer` tidak punya teardown explicit saat modal close.** Potential leak. **Fix:** Setup sekali di `DOMContentLoaded`, simpan reference di module scope.

- **[index.html:49-50] `* { box-sizing: border-box; margin: 0; padding: 0; }` reset agresif.** Default `<button>`, `<input>`, `<h1>`, `<p>` styles overridden — perlu explicit styling untuk semuanya. **Fix:** Pakai `*` selectively, atau import normalize.css variant.

---

## Medium (consider)

- **[index.html:71-75] Watermark CSS `body::before` rotated text dengan `rgba(..., 0.025)`.** Dekoratif tapi bisa distract di focus mode. **Fix:** Wrap di `@media (prefers-reduced-motion: reduce) { body::before { display: none; } }`.

- **[index.html:89-95] `.topbar` flex-wrap + gap, tidak ada max-width internal.** Bisa terlalu lebar di ultrawide. **Fix:** Already in `.shell` (max 1440), tapi cek brand+meta tidak clash.

- **[index.html:50-60] `body` line-height 1.6 untuk semua text termasuk display title.** Hero title line-height 1.05 (override), tapi section-title default ke 1.6. **Fix:** Set line-height per-role: display 1.05, heading 1.2, body 1.6, mono 1.4.

- **[index.html:108-114] Brand name "DASHBOARD PERUSAHAAN V2" ALL CAPS + tracking 0.05em + tracking -0.01em (cancel out).** Uppercase title tanpa sentuhan italic serif. **Fix:** Pakai sentence case "Dashboard Perusahaan V2" + italic untuk emphasis.

- **[index.html:202-205] `@keyframes pulse` untuk dot animasi.** Decorative-only animation, 2s ease-in-out infinite. **Fix:** Add `prefers-reduced-motion: reduce` respect: `@media (prefers-reduced-motion: reduce) { .hero-eyebrow::before { animation: none; } }`.

- **[index.html:267-269] Hero stat value `font-size:1.875rem` lalu inline override `style="font-size:1.25rem"` (line 752).** Inconsistent sizing. **Fix:** Add `.hero-stat-value--md` modifier class.

- **[index.html:369-378] `.pic-card:hover` dengan `transform: translateY(-2px)`.** Micro-interaction oke, tapi tidak ada `active` state untuk tactile feedback. **Fix:** Add `.pic-card:active { transform: translateY(0); }` untuk press feedback.

- **[app.js:357-366] `renderFee()` inline `style="display:flex;align-items:baseline;gap:var(--space-3);flex-wrap:wrap"`.** Same pattern di line 360, 1054, 364. **Fix:** Extract `.bento-row` class.

- **[app.js:417-422] `renderGlosarium()` inline `style="padding:var(--space-3) var(--space-4)"` per card.** Inline style spam. **Fix:** Tambah `.bento-card--compact` modifier.

- **[app.js:986-998] `picToDivisi` mapping hardcoded dari `FALLBACK.pic[].tag`.** Brittle — tag string "Marketing" dipakai sebagai category. **Fix:** Add explicit `divisi` field ke FALLBACK.pic, atau pakai Notion property.

- **[app.js:1138-1174] `seedDemo()` sample data hardcoded dalam JS file.** Tidak sesuai SSOT philosophy. **Fix:** Pindah ke `data-loader.js` sebagai V2 seed (sudah ada V1 fallback di sana).

- **[app.js:1144] `Catatan: "Butuh加速 Q3 akhir"`.** Mixed Chinese-Indonesian copy. **Fix:** `Catatan: "Butuh akselerasi Q3 akhir"`.

- **[index.html:5] `<meta name="viewport" content="width=device-width,initial-scale=1.0" />`.** OKE. Tapi TIDAK ada `theme-color`, `og:title`, `og:description`, `og:image`. **Fix:** Tambah OG meta untuk share preview.

- **[index.html:7] `meta name="description"` singkat.** Kurang SEO. **Fix:** Expand ke 150-160 char, sebutkan "12 PIC, KPI, SOW, Notion".

- **[app.js:589, 760, 924] `if (!confirm("...")) return`.** Bahasa Indonesia di body tapi button-nya English "OK/Cancel". **Fix:** Custom confirm modal (sudah di critical list).

- **[app.js:142-144] Modal backdrop click close OK, tapi body scroll TIDAK dikunci saat modal open.** User bisa scroll di belakang. **Fix:** `document.body.style.overflow = 'hidden'` saat open, restore saat close.

- **[index.html:114-115] `.topbar-meta strong` warna `--text-secondary` (#a1a1aa) contrast ratio 6.0:1 di #0a0a0a — OK.** Tapi `.muted` (#71717a) di body — contrast 4.3:1 (borderline AA). **Fix:** Naikkan `--text-muted` ke `#8a8a93` untuk 4.5:1+.

- **[app.js:1085-1102] `*filter-reset` onclick handlers 4×, repetitive.** DRY violation. **Fix:** Loop `[{id, fields}, ...].forEach(({id, fields}) => { ... })`.

- **[index.html:228-230] `.hero-stats` 2-cols di mobile, 4-cols di 768px+.** Lompatan drastis di 768. **Fix:** Tambah 3-col di 640px+ intermediate.

- **[app.js:1225-1232 (di akhir file)] `pollTimer` module-level mutable + reused. `visibilitychange` listener global state mutation.** Coupling kuat. **Fix:** Encapsulate di object `Poller` dengan start/stop.

---

## Strengths (keep)

- **Token system solid** — CSS custom properties untuk color, spacing, radius, shadow, duration, easing. `var(--space-1)` sampai `var(--space-10)`, `var(--radius-sm/md/lg/xl)`, `var(--shadow-sm/md/glow)`. Ini foundation yang production-grade.

- **Mobile-first responsive** — `min-width: 640px / 1024px / 1280px` breakpoints, `clamp()` untuk typography, `flex-wrap` + `gap` untuk toolbar. Tested across viewport.

- **Tabular numbers untuk data** — `.num` class + inline `font-variant-numeric: tabular-nums` + `font-family: var(--font-mono)` di cell numerik. Angka sejajar vertikal. WAJIB untuk data dashboard.

- **Notion-backed mode toggle** — `cfg.mode === "live" ? workerBase : localStorage` pattern clean, fallback graceful. `Store` + `API` dual mode bagus untuk development tanpa Notion quota.

- **Auto-poll + visibility-aware** — Refresh tiap 60s hanya saat tab visible + user login. Hemat resource.

- **FALLBACK SSOT untuk V1** — `FALLBACK.pic`, `FALLBACK.fee_pilar`, dll sebagai V1 data dump sebelum Notion ready. Demo-mode `seedDemo()` populate 4 DBs dengan sample realistis.

- **Dark theme intent** — `#0a0a0a` base + tinted shadows + `backdrop-filter: blur(12px)` di nav + subtle pulse animation di hero dot. Bukan default white template.

- **Pill system lengkap** — `.pill.success/.warning/.danger/.info/.muted` untuk status, grade, priority. Bahasa visual konsisten.

- **CRUD coverage** — KPI + Program + Jobdesk + SOW. Filter, add, edit, delete. Optimistic update via `Store.add` + `API.create`. Conflict detection via `X-Edit-Time` header (line 247) + 409 handling.

- **IntersectionObserver untuk nav active state** (line 1123-1133). Modern API, performant, automatic.

- **PIC default filter** — Saat login, `kpi-filter-pic` auto-set ke `Session.pic` (line 1078). User langsung lihat KPI sendiri. UX smart.

- **Dual database pattern** — Live Notion vs demo localStorage, **single switch** via `cfg.mode`. Clean abstraction.

- **Error feedback (partial)** — `toast("error", err.message)` setelah API call, graceful fail. Bukan silent.

- **Modal pattern** — Reusable `openModal(title, html)` + `closeModal()`, backdrop click close. Centralized.

- **"★ V2-new" nav badges** — User langsung tahu mana section baru. Information architecture clear.

- **Data export** — `fmtIDR` consistent locale (`id-ID`), date via `todayISO()` (ISO 8601). Localization-ready.

- **Brand watermark** — `body::before` rotated "DOKUMEN INTERNAL" text — kuat internal-document signal, sesuai CLAUDE.md project requirement (watermark di buku management).

- **Section scroll-margin** — `.section { scroll-margin-top: var(--space-5); }` ensures anchor links land dengan space di atas (bukan di bawah sticky nav).

- **Empty state design** — `.empty-state` class dengan dashed border + centered text + h3 + p. Reusable, calm.

- **`scope="row"` absent di `<th>`** — A minor, tapi `<table>` HTML ada proper `<thead>`/`<tbody>` separation, semantic. Many dashboards skip this.

- **`backdrop-filter: blur(12px)` di nav** (line 142) — Sticky nav tetap readable saat scroll content lewat. Modern feel.

- **Animations limited to transform/opacity** — `slideIn` (translateX + opacity), `pulse` (opacity). No `width`/`height`/`top` animation. Compositor-friendly.

- **`<form>` element semantic** — KPI/Program/Jobdesk pakai `<form onsubmit>` dengan `FormData`. Enter-to-submit works out of the box. Plus explicit `required` attributes.

- **Auto-include `requestedBy` via `X-PIC` header** (lines 199, 224, 240) — audit trail per request, server-side attribution.

- **Picto-name pattern** — `pic-avatar` pakai initials dari nama (`p.nama.split(' ').map(x => x[0]).slice(0,2).join('')`), deterministik, no asset needed. Oke untuk internal tool.

- **Sticky nav with section anchors** — `#hero`, `#struktur`, `#v2-kpi`, etc. Shareable deep links. Bagus untuk "kirim link ke PIC tertentu".

- **Auto-refresh only when logged in** — `if (Session.pic && !document.hidden) refreshAll()` (line 1220). Anonymous viewer tidak borrasi API quota.

- **Config injection pattern** — `window.DASHBOARD_CONFIG` (gitignored), `config.example.js` sebagai template. Secret management clean (no hardcoded workerBase).

- **Table progressive disclosure** — `.slice(0, 50)` + `.slice(0, 60)` truncate long Catatan/Jobdesk. Slightly better than full overflow.

---

## Quick Win Priority

1. **Tambah skip-to-content** (15 menit) — accessibility critical
2. **Escape close + focus trap di modal** (30 menit) — accessibility critical
3. **Ganti `window.confirm` jadi custom modal** (45 menit) — design consistency
4. **Escape `innerHTML` → `textContent` + escape helper** (1 jam) — XSS prevention
5. **Tambah `:focus-visible` ring di semua interactive** (30 menit) — accessibility
6. **Refactor inline styles ke utility classes** (1.5 jam) — maintainability
7. **Replace `★` unicode dengan SVG icon set** (1 jam) — visual quality
8. **Tambah `prefers-reduced-motion` respect** (20 menit) — a11y
9. **Tambah `prefers-color-scheme: light` variant** (3-4 jam) — broadens usability
10. **Setup focus management batch di modal open/close** (1 jam) — a11y + UX

---

## File Reference

- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\index.html` — 1005 baris (HTML + inline `<style>` 9-687)
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\app.js` — 1223 baris (auth, store, API, render, CRUD)
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\config.example.js` — config template
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\data-loader.js` — V1 SSOT loader
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\docs\ARCHITECTURE.md` — arsitektur existing
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\docs\OPERATIONS.md` — operations existing
- `C:\Users\Syahfalah\buku-management-syahfalah\deploy\v2\docs\SETUP.md` — setup guide existing
