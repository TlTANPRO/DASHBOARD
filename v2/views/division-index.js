// views/division-index.js — Index 8 divisi + aggregate per divisi
import { API } from "../lib/api.js";
import { PIC_CONFIG } from "../lib/pic-config.js";
import { escapeHTML } from "../lib/format.js";
import { go } from "../lib/router.js";

export async function renderDivisionIndex() {
  const root = document.getElementById("view-root");
  root.innerHTML = '<div class="skeleton skel-card"></div>'.repeat(3);

  let data = { kpi: [], sow: [], program: [], jobdesk: [] };

  try {
    const [kpi, sow, program, jobdesk] = await Promise.all([
      API.listKPI(), API.listSOW(), API.listProgram(), API.listJobdesk(),
    ]);
    data = { kpi, sow, program, jobdesk };
  } catch (e) {
    root.innerHTML = `<div class="empty"><div class="empty-title">Gagal load</div><div class="empty-body">${escapeHTML(e.message)}</div></div>`;
    return;
  }

  // Aggregate per divisi
  const divStats = PIC_CONFIG.divisions.map(div => {
    const members = PIC_CONFIG.pics.filter(p => p.divisi === div.name);
    const memberNames = members.map(m => m.name);

    const divKpi = data.kpi.filter(k => memberNames.includes(k.PIC));
    const sumTarget = divKpi.reduce((s, k) => s + (Number(k.Target) || 0), 0);
    const sumActual = divKpi.reduce((s, k) => s + (Number(k.Realisasi) || 0), 0);
    const kpiAchievement = sumTarget > 0 ? (sumActual / sumTarget) * 100 : 0;

    const divJd = data.jobdesk.filter(j => memberNames.includes(j.PIC));
    const jdDone = divJd.filter(j => j.Status === "Done").length;
    const jdCompletion = divJd.length ? (jdDone / divJd.length) * 100 : 0;

    const divSow = data.sow.filter(s => memberNames.includes(s.PIC));
    const totalBobot = divSow.reduce((s, x) => s + (Number(x["Bobot (%)"]) || 0), 0);
    const avgBobot = divSow.length ? totalBobot / divSow.length : 0; // avg per SOW, normalized 0-100

    const divProg = data.program.filter(p => memberNames.includes(p["PIC Penanggung Jawab"]));
    const progAvg = divProg.length ?
      divProg.reduce((s, p) => s + (Number(p["Progress (%)"]) || 0), 0) / divProg.length : 0;

    const score = (kpiAchievement * 0.4) + (jdCompletion * 0.25) + (80 * 0.15) + (progAvg * 0.10);

    return { ...div, members, kpiAchievement, jdCompletion, totalBobot, avgBobot, sowCount: divSow.length, progAvg, score, kpiCount: divKpi.length, jdCount: divJd.length, progCount: divProg.length };
  });

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Division Dashboard</h1>
        <p class="t-muted t-sm">${PIC_CONFIG.divisions.length} divisi • ${PIC_CONFIG.pics.length} PIC • Aggregate score</p>
      </div>
    </div>
    <div class="div-grid">
      ${divStats.map(d => divCard(d)).join("")}
    </div>
  `;

  document.querySelectorAll(".div-card").forEach(card => {
    card.addEventListener("click", () => {
      const slug = card.dataset.divisi;
      go(`/division/${slug}`);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
    });
  });
}

function divCard(d) {
  return `
    <div class="div-card" data-divisi="${escapeHTML(d.name)}" tabindex="0" role="button" aria-label="Detail divisi ${escapeHTML(d.name)}">
      <div class="div-card-head">
        <div class="div-color-badge div-color-${d.color}"></div>
        <h3 class="h-3 mb-0">${escapeHTML(d.name)}</h3>
        <span class="t-xs t-muted">${d.members.length} member</span>
      </div>
      <div class="div-score">
        <div class="div-score-num">${d.score.toFixed(0)}</div>
        <div class="div-score-label">avg score</div>
      </div>
      <div class="div-stats">
        <div class="div-stat-row">
          <span class="t-xs t-muted">KPI Achievement</span>
          <span>${d.kpiAchievement.toFixed(0)}%</span>
        </div>
        <div class="div-stat-row">
          <span class="t-xs t-muted">Jobdesk Completion</span>
          <span>${d.jdCompletion.toFixed(0)}%</span>
        </div>
        <div class="div-stat-row">
          <span class="t-xs t-muted">SOW Avg Bobot</span>
          <span>${d.avgBobot.toFixed(0)}%</span>
        </div>
        <div class="div-stat-row">
          <span class="t-xs t-muted">Program Progress</span>
          <span>${d.progAvg.toFixed(0)}%</span>
        </div>
      </div>
      <div class="div-card-foot">
        <div class="div-members">
          ${d.members.slice(0, 4).map(m => `<span class="avatar avatar-xs avatar-${m.color}" title="${escapeHTML(m.name)}">${escapeHTML(m.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`).join("")}
          ${d.members.length > 4 ? `<span class="t-xs t-muted">+${d.members.length - 4}</span>` : ''}
        </div>
        <span class="t-xs t-muted">→ Detail</span>
      </div>
    </div>
  `;
}

export async function renderDivisionDetail(params) {
  const root = document.getElementById("view-root");
  const slug = params[0];
  const div = PIC_CONFIG.divisions.find(d => d.name === slug);
  if (!div) {
    root.innerHTML = `<div class="empty"><div class="empty-title">Divisi tidak ditemukan</div><a href="#/division" class="btn btn-primary mt-3">Kembali</a></div>`;
    return;
  }
  root.innerHTML = '<div class="skeleton skel-card"></div>'.repeat(2);

  const [kpi, sow, jd, prog] = await Promise.all([API.listKPI(), API.listSOW(), API.listJobdesk(), API.listProgram()]);
  const memberNames = PIC_CONFIG.pics.filter(p => p.divisi === div.name).map(p => p.name);

  const divKpi = kpi.filter(k => memberNames.includes(k.PIC));
  const divJd = jd.filter(j => memberNames.includes(j.PIC));
  const divProg = prog.filter(p => memberNames.includes(p["PIC Penanggung Jawab"]));

  root.innerHTML = `
    <div class="emp-hero">
      <a href="#/division" class="back-link">← Kembali ke Divisi</a>
      <div class="emp-hero-row">
        <div class="div-color-badge-lg div-color-${div.color}"></div>
        <div class="flex-1">
          <h1 class="h-1 mb-1">${escapeHTML(div.name)}</h1>
          <div class="t-muted t-sm">Head: ${escapeHTML(div.head)} • ${memberNames.length} PIC</div>
        </div>
      </div>
    </div>

    <div class="emp-stats">
      ${statBlock("KPI", divKpi.length, `${divKpi.filter(k=>k.Status==="Achieved").length} achieved`)}
      ${statBlock("Jobdesk", divJd.length, `${divJd.filter(j=>j.Status==="Done").length} done`)}
      ${statBlock("Program", divProg.length, `${divProg.length ? (divProg.reduce((s,p)=>s+(Number(p["Progress (%)"])||0),0)/divProg.length).toFixed(0)+"%" : "—"} avg progress`)}
      ${statBlock("Anggota", memberNames.length, PIC_CONFIG.pics.filter(p=>p.divisi===div.name).map(p=>p.role).join(", "))}
    </div>

    <h2 class="h-3 mt-5 mb-3">Anggota Divisi</h2>
    <div class="div-member-list">
      ${memberNames.map(name => {
        const p = PIC_CONFIG.pics.find(x => x.name === name);
        return `<a href="#/employee/${p.slug}" class="div-member-row">
          <span class="avatar avatar-${p.color}">${escapeHTML(name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>
          <span class="flex-1">${escapeHTML(name)}</span>
          <span class="t-xs t-muted">${escapeHTML(p.role)}</span>
          <span>→</span>
        </a>`;
      }).join("")}
    </div>
  `;
}

function statBlock(label, value, sub) {
  return `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-sub">${sub}</div>
    </div>
  `;
}