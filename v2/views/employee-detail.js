// views/employee-detail.js — Detail per PIC dengan 6 tab
import { API } from "../lib/api.js";
import { PIC_BY_NAME, PIC_BY_SLUG } from "../lib/pic-config.js";
import { statCard, bentoCard } from "../components/card.js";
import { statusPill } from "../components/pill.js";
import { barChart, donutChart, sparkline } from "../components/charts.js";
import { escapeHTML, fmtIDR, fmtDate, fmtNum } from "../lib/format.js";
import { go } from "../lib/router.js";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "sow", label: "SOW", icon: "📋" },
  { key: "kpi", label: "KPI", icon: "🎯" },
  { key: "program", label: "Program", icon: "🚀" },
  { key: "jobdesk", label: "Jobdesk", icon: "✅" },
  { key: "improvisasi", label: "Improvisasi", icon: "💡" },
];

export async function renderEmployeeDetail(params) {
  const root = document.getElementById("view-root");
  const slug = params[0];
  const pic = PIC_BY_SLUG[slug];
  if (!pic) {
    root.innerHTML = `<div class="empty"><div class="empty-title">Karyawan tidak ditemukan</div><a href="#/employee" class="btn btn-primary mt-3">Kembali</a></div>`;
    return;
  }

  root.innerHTML = '<div class="skeleton skel-card"></div>'.repeat(3);

  let activeTab = "overview";
  let data = { kpi: [], sow: [], program: [], jobdesk: [], score: 0 };

  try {
    const [kpi, sow, program, jobdesk] = await Promise.all([
      API.listKPI(),
      API.listSOW(),
      API.listProgram(),
      API.listJobdesk(),
    ]);
    data = {
      kpi: kpi.filter(k => k.PIC === pic.name),
      sow: sow.filter(s => s.PIC === pic.name),
      program: program.filter(p => p["PIC Penanggung Jawab"] === pic.name),
      jobdesk: jobdesk.filter(j => j.PIC === pic.name),
    };
    data.score = computeScore(pic, data);
  } catch (e) {
    root.innerHTML = `<div class="empty"><div class="empty-title">Gagal load</div><div class="empty-body">${escapeHTML(e.message)}</div></div>`;
    return;
  }

  function render() {
    const tier = getTier(data.score, pic.tier_target);
    const initials = pic.name.split(" ").map(w => w[0]).join("").slice(0, 2);

    root.innerHTML = `
      <div class="emp-hero tier-${tier.key}">
        <a href="#/employee" class="back-link">← Kembali ke Employee</a>
        <div class="emp-hero-row">
          <div class="avatar avatar-lg avatar-${pic.color}">${escapeHTML(initials)}</div>
          <div class="flex-1">
            <h1 class="h-1 mb-1">${escapeHTML(pic.name)}</h1>
            <div class="t-muted t-sm">${escapeHTML(pic.divisi)} • ${escapeHTML(pic.role)}</div>
            <div class="tier-pill tier-${tier.key} mt-2">${tier.icon} ${tier.label} • Target: ${pic.tier_target}</div>
          </div>
          <div class="emp-score-block">
            <svg class="score-ring-lg" viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r="34" class="ring-bg"/>
              <circle cx="40" cy="40" r="34" class="ring-fg tier-${tier.key}" stroke-dasharray="${(data.score/100)*213.6} 213.6" transform="rotate(-90 40 40)"/>
            </svg>
            <div class="emp-score-num">${data.score.toFixed(0)}</div>
          </div>
        </div>
        <div class="emp-stats">
          ${statCard({ label: "KPI", value: data.kpi.length, sub: `${data.kpi.filter(k=>k.Status==="Achieved").length} achieved`, icon: "🎯" })}
          ${statCard({ label: "SOW", value: data.sow.length + " SOW", sub: `${data.sow.reduce((s,x)=>s+(Number(x["Bobot (%)"])||0),0)}% workload`, icon: "📋" })}
          ${statCard({ label: "Program", value: data.program.length, sub: `${data.program.length ? (data.program.reduce((s,p)=>s+(Number(p["Progress (%)"])||0),0)/data.program.length).toFixed(0)+"%" : "—"} avg`, icon: "🚀" })}
          ${statCard({ label: "Jobdesk", value: data.jobdesk.length, sub: `${data.jobdesk.filter(j=>j.Status==="Done").length} done`, icon: "✅" })}
        </div>
      </div>

      <nav class="view-tabs" role="tablist" aria-label="Employee tabs">
        ${TABS.map(t => `<button class="view-tab ${t.key===activeTab?'active':''}" role="tab" aria-selected="${t.key===activeTab}" data-tab="${t.key}">${t.icon} ${t.label}</button>`).join("")}
      </nav>

      <div id="tab-content"></div>
    `;

    bindTabs();
    renderTab();
  }

  function bindTabs() {
    document.querySelectorAll(".view-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab;
        document.querySelectorAll(".view-tab").forEach(b => {
          const isActive = b.dataset.tab === activeTab;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", isActive);
        });
        renderTab();
      });
    });
  }

  function renderTab() {
    const target = document.getElementById("tab-content");
    if (!target) return;
    target.innerHTML = "";
    switch (activeTab) {
      case "overview": renderOverview(target); break;
      case "sow": renderSOW(target); break;
      case "kpi": renderKPI(target); break;
      case "program": renderProgram(target); break;
      case "jobdesk": renderJobdesk(target); break;
      case "improvisasi": renderImprovisasi(target); break;
    }
  }

  function renderOverview(el) {
    // KPI achievement breakdown
    const kpiOnTrack = data.kpi.filter(k => k.Status === "On Track").length;
    const kpiAchieved = data.kpi.filter(k => k.Status === "Achieved").length;
    const kpiAtRisk = data.kpi.filter(k => k.Status === "At Risk").length;

    el.innerHTML = `
      <div class="chart-grid">
        <div class="chart-card">
          <div class="chart-title">KPI Status Distribution</div>
          <div class="chart-canvas-wrap"><canvas id="chart-status"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">Jobdesk Status</div>
          <div class="chart-canvas-wrap"><canvas id="chart-jd-status"></canvas></div>
        </div>
      </div>
      <div class="chart-card mt-4">
        <div class="chart-title">Score Formula Breakdown</div>
        <div class="score-formula">
          ${scoreBreakdownHTML(pic, data)}
        </div>
      </div>
    `;

    setTimeout(() => {
      const statusCanvas = el.querySelector("#chart-status");
      if (statusCanvas) donutChart(statusCanvas, [
        { label: "On Track", value: kpiOnTrack, color: "#62d68b" },
        { label: "Achieved", value: kpiAchieved, color: "#7c9eff" },
        { label: "At Risk", value: kpiAtRisk, color: "#f78166" },
      ]);

      const jdCanvas = el.querySelector("#chart-jd-status");
      if (jdCanvas) {
        const jdDone = data.jobdesk.filter(j => j.Status === "Done").length;
        const jdProgress = data.jobdesk.filter(j => j.Status === "In Progress").length;
        const jdTodo = data.jobdesk.filter(j => j.Status === "To Do").length;
        donutChart(jdCanvas, [
          { label: "Done", value: jdDone, color: "#62d68b" },
          { label: "In Progress", value: jdProgress, color: "#f5b942" },
          { label: "To Do", value: jdTodo, color: "#9ca3af" },
        ]);
      }
    }, 50);
  }

  function renderSOW(el) {
    const totalBobot = data.sow.reduce((s, x) => s + (Number(x["Bobot (%)"]) || 0), 0);
    el.innerHTML = `
      <div class="sow-header">
        <h2 class="h-3">Scope of Work</h2>
        <p class="t-muted t-sm">${data.sow.length} SOW • Total Bobot: <strong>${totalBobot}%</strong> ${totalBobot === 100 ? "✓" : totalBobot > 100 ? "⚠️ Overloaded" : "⚠️ Under-loaded"}</p>
      </div>
      <div class="bobot-bar mt-3">
        <div class="bobot-fill" style="width: ${Math.min(totalBobot, 100)}%"></div>
        <div class="bobot-label">${totalBobot}% workload</div>
      </div>
      <div class="sow-list mt-4">
        ${data.sow.map(s => `
          <div class="sow-card">
            <div class="sow-card-head">
              <span class="sow-id t-mono">${escapeHTML(s["SOW ID"] || "")}</span>
              <span class="bobot-pill">${s["Bobot (%)"]}%</span>
            </div>
            <div class="sow-desc">${escapeHTML(s.Deskripsi || "")}</div>
            <div class="sow-meta">
              <span class="pill pill-muted">${escapeHTML(s.Frekuensi || "—")}</span>
              ${(s.Kategori || []).map(k => `<span class="pill pill-info">${escapeHTML(k)}</span>`).join("")}
              <span class="t-xs t-muted">${escapeHTML(s.Status || "—")} • ${escapeHTML(String(s.Tahun || ""))}</span>
            </div>
          </div>
        `).join("") || '<div class="empty"><div class="empty-body">Belum ada SOW</div></div>'}
      </div>
    `;
  }

  function renderKPI(el) {
    el.innerHTML = `
      <div class="kpi-summary">
        <h2 class="h-3">KPI Achievement</h2>
        <p class="t-muted t-sm">${data.kpi.length} KPI • ${data.kpi.filter(k => k.Status === "Achieved").length} achieved</p>
      </div>
      <div class="kpi-list mt-3">
        ${data.kpi.map(k => {
          const target = Number(k.Target) || 0;
          const actual = Number(k.Realisasi) || 0;
          const pct = target > 0 ? Math.min(100, (actual / target) * 100) : 0;
          return `
            <div class="kpi-card">
              <div class="kpi-card-head">
                <span class="t-mono t-xs t-muted">${escapeHTML(k["KPI ID"] || "")}</span>
                ${statusPill(k.Status || "—")}
              </div>
              <div class="kpi-indicator">${escapeHTML(k.KPI || "—")}</div>
              <div class="kpi-progress mt-2">
                <div class="kpi-progress-bar" style="width: ${pct}%"></div>
              </div>
              <div class="kpi-progress-meta">
                <span>${fmtNum(actual)} / ${fmtNum(target)} ${escapeHTML(k.Satuan || "")}</span>
                <span>${pct.toFixed(0)}%</span>
              </div>
            </div>
          `;
        }).join("") || '<div class="empty"><div class="empty-body">Belum ada KPI</div></div>'}
      </div>
    `;
  }

  function renderProgram(el) {
    el.innerHTML = `
      <div class="kpi-summary">
        <h2 class="h-3">Program Kerja</h2>
        <p class="t-muted t-sm">${data.program.length} program • Avg progress: ${data.program.length ? (data.program.reduce((s,p)=>s+(Number(p["Progress (%)"])||0),0)/data.program.length).toFixed(0) : 0}%</p>
      </div>
      <div class="program-list mt-3">
        ${data.program.map(p => `
          <div class="program-card">
            <div class="program-card-head">
              <h3 class="h-3 mb-0">${escapeHTML(p["Nama Program"] || "—")}</h3>
              ${statusPill(p.Status || "—")}
            </div>
            <p class="t-muted t-sm mt-1">${escapeHTML(p.Quarter || "")} ${p.Tahun || ""} • Deadline: ${escapeHTML(p.Deadline || "—")}</p>
            <div class="kpi-progress mt-3">
              <div class="kpi-progress-bar" style="width: ${p["Progress (%)"] || 0}%"></div>
            </div>
            <div class="program-meta mt-2">
              <div class="program-meta-row">
                <span class="t-xs t-muted">Progress</span>
                <span><strong>${p["Progress (%)"] || 0}%</strong></span>
              </div>
              <div class="program-meta-row">
                <span class="t-xs t-muted">Budget</span>
                <span>${fmtIDR(Number(p["Budget (Rp)"]) || 0)}</span>
              </div>
              <div class="program-meta-row">
                <span class="t-xs t-muted">Actual Spend</span>
                <span>${fmtIDR(Number(p["Actual Spend (Rp)"]) || 0)}</span>
              </div>
              <div class="program-meta-row">
                <span class="t-xs t-muted">Risiko</span>
                <span>${escapeHTML(p.Risiko || "—")}</span>
              </div>
            </div>
          </div>
        `).join("") || '<div class="empty"><div class="empty-body">Belum ada program</div></div>'}
      </div>
    `;
  }

  function renderJobdesk(el) {
    const done = data.jobdesk.filter(j => j.Status === "Done").length;
    const progress = data.jobdesk.filter(j => j.Status === "In Progress").length;
    const todo = data.jobdesk.filter(j => j.Status === "To Do").length;
    const completion = data.jobdesk.length ? ((done / data.jobdesk.length) * 100).toFixed(0) : 0;

    el.innerHTML = `
      <div class="kpi-summary">
        <h2 class="h-3">Jobdesk Harian</h2>
        <p class="t-muted t-sm">${data.jobdesk.length} jobdesk • <strong>${completion}%</strong> completion rate</p>
      </div>
      <div class="chart-grid mt-3">
        <div class="chart-card">
          <div class="chart-canvas-wrap"><canvas id="jd-bar"></canvas></div>
        </div>
      </div>
      <div class="jobdesk-list mt-3">
        ${data.jobdesk.map(j => {
          const isOverdue = j.Tanggal && j.Tanggal < new Date().toISOString().slice(0,10) && j.Status !== "Done";
          return `
            <div class="jobdesk-card ${isOverdue ? 'overdue' : ''}">
              <div class="jobdesk-card-head">
                <span class="priority-pill prio-${escapeHTML(j.Prioritas || 'P3')}">${escapeHTML(j.Prioritas || '—')}</span>
                ${statusPill(j.Status || "—")}
                ${isOverdue ? '<span class="carry-badge">↻ Overdue</span>' : ''}
              </div>
              <div class="jobdesk-title">${escapeHTML(j.Jobdesk || "—")}</div>
              <div class="jobdesk-meta">
                <span class="t-xs t-muted">📅 ${escapeHTML(j.Tanggal || "—")}</span>
                <span class="t-xs t-muted">Target: ${escapeHTML(j["Target Output"] || "—")}</span>
                ${j["Actual Output"] ? `<span class="t-xs">Actual: ${escapeHTML(j["Actual Output"])}</span>` : ''}
              </div>
            </div>
          `;
        }).join("") || '<div class="empty"><div class="empty-body">Belum ada jobdesk</div></div>'}
      </div>
    `;

    setTimeout(() => {
      const c = el.querySelector("#jd-bar");
      if (c) barChart(c, [
        { label: "Done", value: done, color: "#62d68b" },
        { label: "In Progress", value: progress, color: "#f5b942" },
        { label: "To Do", value: todo, color: "#9ca3af" },
      ]);
    }, 50);
  }

  function renderImprovisasi(el) {
    el.innerHTML = `
      <div class="imp-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z"/>
        </svg>
        <h2 class="h-3 mt-3">Improvisasi</h2>
        <p class="t-muted">PIC bisa submit inisiatif: Efisiensi, Inovasi, Mentoring, Problem Solving, Self Development, Cross-functional, Customer Obsession.</p>
        <p class="t-muted t-sm">DB sudah dibuat di Notion (kosong). PIC mulai submit lewat dashboard setelah login.</p>
        <div class="imp-types mt-4">
          <span class="pill pill-success">Efisiensi</span>
          <span class="pill pill-info">Inovasi</span>
          <span class="pill pill-accent">Mentoring</span>
          <span class="pill pill-danger">Problem Solving</span>
          <span class="pill pill-warning">Self Development</span>
          <span class="pill pill-accent">Cross-functional</span>
          <span class="pill pill-info">Customer Obsession</span>
        </div>
      </div>
    `;
  }

  function scoreBreakdownHTML(pic, d) {
    const sumTarget = d.kpi.reduce((s, k) => s + (Number(k.Target) || 0), 0);
    const sumActual = d.kpi.reduce((s, k) => s + (Number(k.Realisasi) || 0), 0);
    const kpiScore = sumTarget > 0 ? Math.min(100, (sumActual / sumTarget) * 100) : 0;
    const jdDone = d.jobdesk.filter(j => j.Status === "Done").length;
    const jdScore = d.jobdesk.length ? (jdDone / d.jobdesk.length) * 100 : 0;
    const sowScore = d.sow.length ? 80 : 0; // placeholder
    const progScore = d.program.length ?
      d.program.reduce((s, p) => s + (Number(p["Progress (%)"]) || 0), 0) / d.program.length : 0;
    const impScore = 0;

    const items = [
      { label: "KPI Achievement", score: kpiScore, weight: 40 },
      { label: "Jobdesk Completion", score: jdScore, weight: 25 },
      { label: "SOW Compliance", score: sowScore, weight: 15 },
      { label: "Program Contribution", score: progScore, weight: 10 },
      { label: "Improvisasi Bonus", score: impScore, weight: 10 },
    ];
    return items.map(it => `
      <div class="formula-row">
        <div class="formula-label">
          <span>${it.label}</span>
          <span class="t-xs t-muted">${it.score.toFixed(0)}% × ${it.weight}%</span>
        </div>
        <div class="formula-bar"><div class="formula-bar-fill" style="width: ${Math.min(it.score,100)}%"></div></div>
        <div class="formula-contribution">+${(it.score * it.weight / 100).toFixed(1)}</div>
      </div>
    `).join("");
  }

  render();
}

function computeScore(pic, d) {
  const sumTarget = d.kpi.reduce((s, k) => s + (Number(k.Target) || 0), 0);
  const sumActual = d.kpi.reduce((s, k) => s + (Number(k.Realisasi) || 0), 0);
  const kpiScore = sumTarget > 0 ? Math.min(100, (sumActual / sumTarget) * 100) : 0;
  const jdDone = d.jobdesk.filter(j => j.Status === "Done").length;
  const jdScore = d.jobdesk.length ? (jdDone / d.jobdesk.length) * 100 : 0;
  const sowScore = d.sow.length ? 80 : 0;
  const progScore = d.program.length ?
    d.program.reduce((s, p) => s + (Number(p["Progress (%)"]) || 0), 0) / d.program.length : 0;
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