// views/extras.js — V5.0 reference blocks ported ke V4 owner view.
// 5 helpers: leaderboard, kpiDimensi, pricingTiers, manager3Sifat, glosarium.
// BEAT-Notion UX: bento grid + section labels + colored chips.

import { sectionLabel } from "./partials.js";

// ============================================================
// 05 — Leaderboard V5 (bento-half × bento-half)
// ============================================================
export function leaderboardSection(ref) {
  if (!ref?.leaderboard) return null;
  const lb = ref.leaderboard;

  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(5, "Leaderboard V5 · 4 Divisi",
    "Reward top-3 · coaching bottom · no publish nama"));

  const pool = document.createElement("div");
  pool.className = "bento-quad";
  pool.style.marginTop = "var(--space-4)";
  pool.appendChild(_bentoCard({
    eyebrow: "Reward Pool",
    value: "Rp 950rb",
    valueClass: "success",
    foot: "Top-1 500rb · Top-2 300rb · Top-3 150rb. Bottom = coaching only (no publish). Ranking: 0.6 × metrik_utama + 0.4 × metrik_sekunder.",
  }));
  sec.appendChild(pool);

  const grid = document.createElement("div");
  grid.className = "bento";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  grid.style.gap = "var(--space-4)";
  grid.style.marginTop = "var(--space-4)";

  for (const div of lb.divisi || []) {
    const card = document.createElement("div");
    card.className = "card";
    card.appendChild(_cardHead(div.nama, `${div.top.length} PIC`));

    const list = document.createElement("ol");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "0";
    list.style.display = "grid";
    list.style.gap = "var(--space-2)";
    for (const p of div.top) {
      const li = document.createElement("li");
      const medal = p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : "·";
      li.style.cssText = "display:grid;grid-template-columns:auto 1fr auto;gap:var(--space-3);padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-md);align-items:center;";
      li.innerHTML = `
        <span style="font-size:var(--text-xl);font-weight:var(--leading-tight);width:1.8em;text-align:center;">${medal}</span>
        <span>
          <strong>${_escape(p.pic)}</strong><br>
          <span style="font-size:var(--text-sm);color:var(--color-text-muted);">${_escape(p.metrik_utama)} · ${_escape(p.metrik_sekunder)}</span>
        </span>
        <span class="chip chip--${p.score >= 0.9 ? "success" : p.score >= 0.85 ? "info" : "warning"}">${(p.score * 100).toFixed(0)}</span>
      `;
      list.appendChild(li);
    }
    card.appendChild(list);
    grid.appendChild(card);
  }
  sec.appendChild(grid);
  return sec;
}

// ============================================================
// 06 — KPI Dimensi + Grading A/B/C/D (bento-half × bento-half)
// ============================================================
export function kpiDimensiSection(ref) {
  if (!ref?.kpi_dimensi || !ref?.grading) return null;
  const dims = ref.kpi_dimensi;
  const grades = ref.grading;

  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(6, "KPI Score Card · 5 Dimensi",
    "Auto-report ke owner · grading A/B/C/D"));

  const dimWrap = document.createElement("div");
  dimWrap.className = "bento-quad";
  dimWrap.style.marginTop = "var(--space-4)";
  for (const d of dims) {
    dimWrap.appendChild(_bentoCard({
      eyebrow: d.nama,
      value: d.bobot,
      valueClass: "accent",
      foot: d.desc,
    }));
  }
  sec.appendChild(dimWrap);

  const gradeHead = sectionLabel(7, "Grading A/B/C/D", "Konsekuensi skor");
  gradeHead.style.marginTop = "var(--space-6)";
  gradeHead.style.borderBottomColor = "transparent";
  sec.appendChild(gradeHead);

  const gradeGrid = document.createElement("div");
  gradeGrid.className = "bento";
  gradeGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  gradeGrid.style.gap = "var(--space-4)";
  gradeGrid.style.marginTop = "var(--space-3)";

  for (const g of grades) {
    gradeGrid.appendChild(_bentoCard({
      eyebrow: `Skor ${g.skor}`,
      value: g.grade,
      valueClass: g.color,
      foot: g.akibat,
    }));
  }
  sec.appendChild(gradeGrid);
  return sec;
}

// ============================================================
// 07 — Fee Media V5 (3 pilar konten)
// ============================================================
export function feeMediaSection(ref) {
  if (!ref?.fee_media) return null;
  const fm = ref.fee_media;

  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(8, "Fee Media Closing-Based V5",
    "3 pilar konten · base pool Rp 500rb/closing"));

  const grid = document.createElement("div");
  grid.className = "bento-quad";
  grid.style.marginTop = "var(--space-4)";
  for (const p of fm.pilar || []) {
    grid.appendChild(_bentoCard({
      eyebrow: p.nama,
      value: p.bobot,
      valueClass: "accent",
      foot: p.desc,
    }));
  }
  sec.appendChild(grid);

  const foot = document.createElement("p");
  foot.className = "muted";
  foot.style.cssText = "margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text-muted);";
  foot.textContent = `UTM tracking · ${fm.min_konten} · ${fm.pool}`;
  sec.appendChild(foot);
  return sec;
}

// ============================================================
// 09 — Pricing Tier (3 tier)
// ============================================================
export function pricingTiersSection(ref) {
  if (!ref?.pricing) return null;

  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(9, "Pricing Logic · 3 Tier",
    "Management Density = Output Density"));

  const grid = document.createElement("div");
  grid.className = "bento";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  grid.style.gap = "var(--space-4)";
  grid.style.marginTop = "var(--space-4)";

  for (const t of ref.pricing) {
    const card = document.createElement("div");
    card.className = `card card--${t.color || "accent"}`;
    card.style.cssText = "padding:var(--space-5);border-top:3px solid var(--color-accent);";

    const tier = document.createElement("div");
    tier.style.cssText = "font-size:var(--text-xl);font-weight:600;letter-spacing:var(--tracking-tight);";
    tier.textContent = t.tier;
    const sub = document.createElement("div");
    sub.style.cssText = "font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-4);";
    sub.textContent = t.sub;

    const fee = document.createElement("div");
    fee.style.cssText = "font-size:var(--text-3xl);font-weight:600;font-variant-numeric:tabular-nums;";
    fee.textContent = `Rp ${(t.fee).toLocaleString("id-ID")}`;

    const meta = document.createElement("div");
    meta.style.cssText = "display:flex;gap:var(--space-2);margin-top:var(--space-3);flex-wrap:wrap;";
    meta.innerHTML = `
      <span class="chip">${t.unit} unit/bln</span>
      <span class="chip chip--info">margin ${t.margin}</span>
    `;

    const resp = document.createElement("p");
    resp.style.cssText = "margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text);line-height:var(--leading-relaxed);";
    resp.textContent = t.resp;

    card.appendChild(tier);
    card.appendChild(sub);
    card.appendChild(fee);
    card.appendChild(meta);
    card.appendChild(resp);
    grid.appendChild(card);
  }
  sec.appendChild(grid);

  const note = document.createElement("p");
  note.className = "muted";
  note.style.cssText = "margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text-muted);";
  note.textContent = "Output perusahaan jelas per tier: 5/6/7 unit/bulan. Cross-check dengan config-tier.json + target-perusahaan.json.";
  sec.appendChild(note);
  return sec;
}

// ============================================================
// 10 — Manager 3 Sifat
// ============================================================
export function managerSection(ref) {
  if (!ref?.manager) return null;
  const m = ref.manager;

  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(10, "Manager 3 Sifat Wajib",
    "Tertib · Pahami · Generalis · evaluasi quarterly"));

  const sifatWrap = document.createElement("ol");
  sifatWrap.style.cssText = "list-style:none;padding:0;margin:var(--space-4) 0 0;display:grid;gap:var(--space-3);";
  (m.sifat || []).forEach((s, i) => {
    const li = document.createElement("li");
    li.style.cssText = "display:grid;grid-template-columns:auto 1fr;gap:var(--space-4);padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-md);";
    li.innerHTML = `
      <span style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:600;color:var(--color-accent);">${String(i + 1).padStart(2, "0")}</span>
      <span>
        <strong style="display:block;font-size:var(--text-base);margin-bottom:var(--space-1);">${_escape(s.nama)}</strong>
        <span style="font-size:var(--text-sm);color:var(--color-text-muted);line-height:var(--leading-relaxed);">${_escape(s.desc)}</span>
      </span>
    `;
    sifatWrap.appendChild(li);
  });
  sec.appendChild(sifatWrap);

  const listHead = sectionLabel(11, "Manager di Perusahaan", "");
  listHead.style.marginTop = "var(--space-6)";
  listHead.style.borderBottomColor = "transparent";
  sec.appendChild(listHead);

  const grid = document.createElement("div");
  grid.className = "bento";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";
  grid.style.gap = "var(--space-3)";
  grid.style.marginTop = "var(--space-3)";

  for (const p of m.manager_list || []) {
    grid.appendChild(_bentoCard({
      eyebrow: p.nama,
      value: p.divisi?.toUpperCase?.() || p.tier?.toUpperCase?.() || "PIC",
      valueClass: "info",
      foot: p.peran,
    }));
  }
  sec.appendChild(grid);
  return sec;
}

// ============================================================
// 12 — Glosarium Quick-Ref (50 akronim)
// ============================================================
export function glosariumSection(ref) {
  if (!ref?.glosarium) return null;

  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(12, "Glosarium Quick-Ref",
    `${ref.glosarium.length}+ akronim V5.0`));

  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-3);margin-top:var(--space-4);";

  for (const [term, def] of ref.glosarium) {
    const item = document.createElement("div");
    item.style.cssText = "padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-surface);";
    item.innerHTML = `
      <strong style="display:block;font-size:var(--text-sm);color:var(--color-accent);font-family:var(--font-mono);letter-spacing:0.04em;">${_escape(term)}</strong>
      <span style="font-size:var(--text-sm);color:var(--color-text);line-height:var(--leading-snug);">${_escape(def)}</span>
    `;
    grid.appendChild(item);
  }
  sec.appendChild(grid);
  return sec;
}

// ============================================================
// Internal helpers
// ============================================================
function _bentoCard({ eyebrow, value, valueClass = "accent", foot }) {
  const c = document.createElement("div");
  c.className = "bento-card";
  c.innerHTML = `
    <div class="bento-eyebrow">${_escape(eyebrow)}</div>
    <div class="bento-value ${valueClass}">${_escape(value)}</div>
    ${foot ? `<div class="bento-foot">${_escape(foot)}</div>` : ""}
  `;
  return c;
}

function _cardHead(title, sub) {
  const h = document.createElement("div");
  h.className = "card__head";
  h.innerHTML = `<div class="card__title">${_escape(title)}</div><span class="chip">${_escape(sub)}</span>`;
  return h;
}

function _escape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}