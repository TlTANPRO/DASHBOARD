// views/employee-index.js — Index 12 PIC dengan score ring + tier badge
import { API } from "../lib/api.js";
import { statCard } from "../components/card.js";
import { statusPill } from "../components/pill.js";
import { openDetail } from "../components/detail.js";
import { PIC_CONFIG } from "../lib/pic-config.js";
import { go } from "../lib/router.js";
import { escapeHTML } from "../lib/format.js";

export async function renderEmployeeIndex() {
  const root = document.getElementById("view-root");
  root.innerHTML = '<div class="skeleton skel-card"></div>'.repeat(4);

  try {
    const [kpi, sow, jd, prog] = await Promise.all([
      API.listKPI(),
      API.listSOW(),
      API.listJobdesk(),
      API.listProgram(),
    ]);

    // Hitung score per PIC
    const scoreMap = {};
    for (const p of PIC_CONFIG.pics) {
      scoreMap[p.name] = calcScore(p.name, kpi, sow, jd, prog);
    }

    root.innerHTML = `
      <div class="row-between mb-4">
        <div>
          <h1 class="h-1">Employee Dashboard</h1>
          <p class="t-muted t-sm">${PIC_CONFIG.pics.length} PIC • Score real-time dari Notion</p>
        </div>
        <div class="row gap-2">
          <select class="select select-sm" id="filter-divisi" aria-label="Filter Divisi">
            <option value="">Semua Divisi</option>
            ${PIC_CONFIG.divisions.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
          </select>
          <select class="select select-sm" id="filter-tier" aria-label="Filter Tier">
            <option value="">Semua Tier</option>
            <option value="top">🏆 Top Performer</option>
            <option value="on_track">✅ On Track</option>
            <option value="coach">⚠️ Need Coaching</option>
            <option value="at_risk">🚨 At Risk</option>
          </select>
        </div>
      </div>
      <div class="bento grid-3 gap-3" id="pic-grid">
        ${PIC_CONFIG.pics.map(p => picTile(p, scoreMap[p.name] || 0)).join("")}
      </div>
    `;

    bindFilterEvents(scoreMap, kpi, sow, jd, prog);
    bindTileEvents(scoreMap, kpi, sow, jd, prog);
  } catch (e) {
    root.innerHTML = `<div class="empty"><div class="empty-title">Gagal load data</div><div class="empty-body">${escapeHTML(e.message)}</div></div>`;
  }
}

function picTile(pic, score) {
  const tier = getTier(score, pic.tier_target);
  const initials = pic.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return `
    <div class="pic-tile tier-${tier.key}" data-pic="${escapeHTML(pic.name)}" data-divisi="${pic.divisi}" tabindex="0" role="button" aria-label="Detail ${escapeHTML(pic.name)}">
      <div class="pic-tile-head">
        <div class="avatar avatar-${pic.color}" aria-hidden="true">${escapeHTML(initials)}</div>
        <div class="flex-1">
          <div class="pic-name">${escapeHTML(pic.name)}</div>
          <div class="pic-divisi">${escapeHTML(pic.divisi)} • ${escapeHTML(pic.role)}</div>
        </div>
        <span class="tier-badge tier-${tier.key}">${tier.icon}</span>
      </div>
      <div class="score-row">
        <svg class="score-ring" viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="30" cy="30" r="26" class="ring-bg"/>
          <circle cx="30" cy="30" r="26" class="ring-fg tier-${tier.key}" stroke-dasharray="${(score/100)*163.36} 163.36"/>
        </svg>
        <div class="score-meta">
          <div class="score-num">${score.toFixed(0)}</div>
          <div class="score-target">/ target ${pic.tier_target}</div>
        </div>
      </div>
      <div class="pic-footer">
        <span class="t-xs t-muted">${tier.label}</span>
        <span class="t-xs t-muted">→ Detail</span>
      </div>
    </div>
  `;
}

function calcScore(picName, kpi, sow, jd, prog) {
  // KPI Achievement (40%)
  const picKpi = kpi.filter(k => k.PIC === picName);
  const sumTarget = picKpi.reduce((s, k) => s + (Number(k.Target) || 0), 0);
  const sumActual = picKpi.reduce((s, k) => s + (Number(k.Realisasi) || 0), 0);
  const kpiScore = sumTarget > 0 ? Math.min(100, (sumActual / sumTarget) * 100) : 0;

  // Jobdesk Completion weighted by Bobot (25%)
  const picJd = jd.filter(j => j.PIC === picName);
  // Jobdesk partial credit: Done=1, InProgress=0.5, ToDo=0
  const jdScore = picJd.length > 0 ?
    (picJd.reduce((s, j) => {
      if (j.Status === "Done") return s + 1;
      if (j.Status === "In Progress" || j.Status === "Pending Approval") return s + 0.5;
      return s;
    }, 0) / picJd.length) * 100 : 0;

  // SOW Compliance: real, weighted by Bobot, hanya SOW Active
  const picSow = sow.filter(s => s.PIC === picName);
  const sowScore = picSow.length > 0 ?
    Math.min(100, picSow.reduce((s, sw) => {
      const bobot = Number(sw["Bobot (%)"]) || 0;
      return s + (sw.Status === "Active" ? bobot : 0);
    }, 0)) : 0;

  // Program Contribution (10%)
  const picProg = prog.filter(p => p["PIC Penanggung Jawab"] === picName);
  const progScore = picProg.length > 0 ?
    picProg.reduce((s, p) => s + (Number(p["Progress (%)"]) || 0), 0) / picProg.length : 0;

  // Improvisasi Bonus (10%) — assume 0 (DB baru)
  const impScore = 0;

  return (kpiScore * 0.4) + (jdScore * 0.25) + (sowScore * 0.15) + (progScore * 0.10) + (impScore * 0.10);
}

function getTier(score, target) {
  if (score >= 90) return { key: "top", label: "Top Performer", icon: "🏆" };
  if (score >= 75) return { key: "on_track", label: "On Track", icon: "✅" };
  if (score >= 60) return { key: "coach", label: "Need Coaching", icon: "⚠️" };
  if (score < target * 0.7) return { key: "at_risk", label: "At Risk", icon: "🚨" };
  return { key: "on_track", label: "On Track", icon: "✅" };
}

function bindFilterEvents(scoreMap, kpi, sow, jd, prog) {
  const divisiFilter = document.getElementById("filter-divisi");
  const tierFilter = document.getElementById("filter-tier");
  function applyFilter() {
    const d = divisiFilter?.value || "";
    const t = tierFilter?.value || "";
    document.querySelectorAll(".pic-tile").forEach(tile => {
      const picName = tile.dataset.pic;
      const picDiv = tile.dataset.divisi;
      const tileScore = scoreMap[picName] || 0;
      const tier = getTier(tileScore, PIC_CONFIG.pics.find(p => p.name === picName)?.tier_target || 70);
      const matchDiv = !d || picDiv === d;
      const matchTier = !t || tier.key === t;
      tile.style.display = matchDiv && matchTier ? "" : "none";
    });
  }
  divisiFilter?.addEventListener("change", applyFilter);
  tierFilter?.addEventListener("change", applyFilter);
}

function bindTileEvents(scoreMap, kpi, sow, jd, prog) {
  document.querySelectorAll(".pic-tile").forEach(tile => {
    const handler = () => {
      const picName = tile.dataset.pic;
      const slug = PIC_CONFIG.pics.find(p => p.name === picName)?.slug;
      if (slug) go(`/employee/${slug}`);
    };
    tile.addEventListener("click", handler);
    tile.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); }
    });
  });
}