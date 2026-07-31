// views/extras.js — V5.0 reference blocks ported ke V4 owner view.
// 5 helpers: leaderboard, kpiDimensi, pricingTiers, manager3Sifat, glosarium.
// BEAT-Notion UX: bento grid + section labels + colored chips.

import { sectionLabel } from "./partials.js";
import { h, esc } from "../lib/dom.js";

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
  pool.className = "bento-quad u-mt-4";
  pool.appendChild(_bentoCard({
    eyebrow: "Reward Pool",
    value: "Rp 950rb",
    valueClass: "success",
    foot: "Top-1 500rb · Top-2 300rb · Top-3 150rb. Bottom = coaching only (no publish). Ranking: 0.6 × metrik_utama + 0.4 × metrik_sekunder.",
  }));
  sec.appendChild(pool);

  const grid = document.createElement("div");
  grid.className = "bento grid-auto-280 u-gap-4 u-mt-4";

  for (const div of lb.divisi || []) {
    const card = document.createElement("div");
    card.className = "card";
    card.appendChild(_cardHead(div.nama, `${div.top.length} PIC`));

    const list = document.createElement("ol");
    list.className = "rank-list";
    for (const p of div.top) {
      const medalClass = p.rank === 1 ? "rank-badge--gold" : p.rank === 2 ? "rank-badge--silver" : p.rank === 3 ? "rank-badge--bronze" : "";
      const medalLabel = p.rank <= 9 ? `0${p.rank}` : `${p.rank}`;
      const li = document.createElement("li");
      li.className = "rank-row";
      li.appendChild(h("span", { class: `rank-badge ${medalClass}` }, medalLabel));
      const label = document.createElement("span");
      label.appendChild(h("strong", {}, p.pic));
      label.appendChild(h("br"));
      label.appendChild(h("span", { class: "rank-row__sub" }, `${p.metrik_utama} · ${p.metrik_sekunder}`));
      li.appendChild(label);
      li.appendChild(h("span", {
        class: `chip chip--${p.score >= 0.9 ? "success" : p.score >= 0.85 ? "info" : "warning"}`,
      }, `${(p.score * 100).toFixed(0)}`));
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
  dimWrap.className = "bento-quad u-mt-4";
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
  gradeHead.classList.add("u-mt-6", "u-border-bottom-transparent");
  sec.appendChild(gradeHead);

  const gradeGrid = document.createElement("div");
  gradeGrid.className = "bento grid-auto-220 u-gap-4 u-mt-3";

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
  grid.className = "bento-quad u-mt-4";
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
  foot.className = "muted u-mt-4 u-text-sm u-text-muted";
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
  grid.className = "bento grid-auto-280 u-gap-4 u-mt-4";

  for (const t of ref.pricing) {
    const card = document.createElement("div");
    card.className = `card card--${t.color || "accent"} pricing-card`;

    card.appendChild(h("div", { class: "pricing-tier" }, t.tier));
    card.appendChild(h("div", { class: "pricing-sub u-text-sm u-text-muted" }, t.sub));
    card.appendChild(h("div", { class: "pricing-fee u-mono" }, `Rp ${(t.fee).toLocaleString("id-ID")}`));
    const meta = document.createElement("div");
    meta.className = "u-flex-row u-gap-2 u-mt-3 u-flex-wrap";
    meta.appendChild(h("span", { class: "chip" }, `${t.unit} unit/bln`));
    meta.appendChild(h("span", { class: "chip chip--info" }, `margin ${t.margin}`));
    card.appendChild(meta);
    card.appendChild(h("p", { class: "u-mt-4 u-text-sm pricing-resp" }, t.resp));
    grid.appendChild(card);
  }
  sec.appendChild(grid);

  const note = document.createElement("p");
  note.className = "muted u-mt-4 u-text-sm u-text-muted";
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
  sifatWrap.className = "sifat-list";
  (m.sifat || []).forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "sifat-item";
    li.appendChild(h("span", { class: "sifat-num" }, String(i + 1).padStart(2, "0")));
    const wrap = document.createElement("span");
    wrap.appendChild(h("strong", { class: "sifat-name" }, s.nama));
    wrap.appendChild(h("span", { class: "sifat-desc" }, s.desc));
    li.appendChild(wrap);
    sifatWrap.appendChild(li);
  });
  sec.appendChild(sifatWrap);

  const listHead = sectionLabel(11, "Manager di Perusahaan", "");
  listHead.classList.add("u-mt-6", "u-border-bottom-transparent");
  sec.appendChild(listHead);

  const grid = document.createElement("div");
  grid.className = "bento grid-auto-240 u-gap-3 u-mt-3";

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
  grid.className = "grid-auto-220 u-mt-4 glosarium-grid";

  for (const [term, def] of ref.glosarium) {
    const item = document.createElement("div");
    item.className = "glosarium-item";
    item.appendChild(h("strong", { class: "glosarium-term" }, term));
    item.appendChild(h("span", { class: "glosarium-def" }, def));
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
  c.appendChild(h("div", { class: "bento-eyebrow" }, eyebrow));
  c.appendChild(h("div", { class: `bento-value ${valueClass}` }, value));
  if (foot) c.appendChild(h("div", { class: "bento-foot" }, foot));
  return c;
}

function _cardHead(title, sub) {
  const h = document.createElement("div");
  h.className = "card__head";
  h.appendChild(document.createElement("div"));
  h.firstChild.className = "card__title";
  h.firstChild.textContent = title;
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = sub;
  h.appendChild(chip);
  return h;
}