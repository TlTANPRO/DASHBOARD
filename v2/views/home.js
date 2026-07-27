// views/home.js — Hero + KPI summary with charts
import { API, loadSSOT } from "../lib/api.js";
import { statCard, bentoCard } from "../components/card.js";
import { statusPill } from "../components/pill.js";
import { fmtIDR, fmtNum, fmtPct, escapeHTML, initials } from "../lib/format.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { barChart, donutChart } from "../components/charts.js";

export async function renderHome() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(4);

  const [kpi, program, jobdesk, struktur, targetPerusahaan] = await Promise.all([
    API.listKPI().catch(() => []),
    API.listProgram().catch(() => []),
    API.listJobdesk().catch(() => []),
    loadSSOT("struktur-organisasi"),
    loadSSOT("target-perusahaan"),
  ]);

  const totalKPI = kpi.length;
  const achievedKPI = kpi.filter((r) => {
    const s = (r.Status || "").toLowerCase();
    return s.includes("achieve") || s.includes("done");
  }).length;
  const achievementRate = totalKPI > 0 ? (achievedKPI / totalKPI) * 100 : null;

  const totalProgram = program.length;
  const activeProgram = program.filter((r) => {
    const s = (r.Status || "").toLowerCase();
    return s.includes("track") || s.includes("progress") || s.includes("planning");
  }).length;

  // Charts data
  const picAchievement = computePICAchievement(kpi);
  const statusDist = computeStatusDist(kpi);

  root.innerHTML = `
    <section class="hero">
      <span class="hero-eyebrow">
        <span class="dot" aria-hidden="true"></span>
        ${API.mode === "live" ? "Live mode — Notion" : "Demo mode — LocalStorage"}
      </span>
      <h1 class="hero-title">Dashboard Syahfalah</h1>
      <p class="hero-sub">Management control center untuk 12 PIC, 4 divisi. KPI, SOW, Program Kerja, Jobdesk Harian — semua dalam satu tempat.</p>

      <div class="hero-stats">
        ${statCard({ label: "Total KPI", value: fmtNum(totalKPI), hint: "Across all PIC" })}
        ${statCard({
          label: "Achievement Rate",
          value: achievementRate != null ? fmtPct(achievementRate, 1) : "—",
          delta: achievementRate != null
            ? { direction: achievementRate >= 50 ? "up" : "down", text: `${achievedKPI}/${totalKPI} achieved` }
            : null,
        })}
        ${statCard({ label: "Program Aktif", value: fmtNum(activeProgram), hint: totalProgram > 0 ? `${totalProgram} total` : "—" })}
        ${statCard({ label: "Jobdesk", value: fmtNum(jobdesk.length), hint: "Logged total" })}
      </div>
    </section>

    <section class="mt-6">
      <h2 class="h-2 mb-3">Visualisasi</h2>
      <div class="chart-grid">
        <div class="chart-card">
          <div class="chart-title">KPI Achievement per PIC</div>
          <div class="chart-canvas-wrap tall"><canvas id="chart-pic"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">Status Distribution</div>
          <div class="chart-canvas-wrap tall"><canvas id="chart-status"></canvas></div>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <h2 class="h-2 mb-3">Ringkasan Cepat</h2>
      <div class="bento">
        ${bentoCard({ title: "Top 5 PIC by KPI", body: renderTopPIC(kpi) })}
        ${bentoCard({ title: "Status Program", body: renderProgramStatus(program) })}
        ${bentoCard({ title: "Target Perusahaan", body: renderTargetPerusahaan(targetPerusahaan) })}
        ${bentoCard({ title: "Recent Activity", body: renderRecent(jobdesk, kpi) })}
      </div>
    </section>
  `;

  // Render charts after DOM ready
  if (picAchievement.length > 0) {
    setTimeout(() => barChart(document.getElementById("chart-pic"), picAchievement), 50);
  }
  if (statusDist.length > 0) {
    setTimeout(() => donutChart(document.getElementById("chart-status"), statusDist, { center: totalKPI, label: "TOTAL KPI" }), 50);
  }
}

function computePICAchievement(kpi) {
  if (!kpi || kpi.length === 0) return [];
  const byPIC = {};
  kpi.forEach((r) => {
    const pic = r.PIC || "Unknown";
    if (!byPIC[pic]) byPIC[pic] = { total: 0, achieved: 0 };
    byPIC[pic].total++;
    const s = (r.Status || "").toLowerCase();
    if (s.includes("achieve") || s.includes("done")) byPIC[pic].achieved++;
  });
  return Object.entries(byPIC)
    .map(([pic, v]) => ({ label: pic, value: v.total > 0 ? Math.round((v.achieved / v.total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function computeStatusDist(kpi) {
  if (!kpi || kpi.length === 0) return [];
  const byStatus = {};
  kpi.forEach((r) => {
    const s = r.Status || "Unknown";
    byStatus[s] = (byStatus[s] || 0) + 1;
  });
  return Object.entries(byStatus).map(([s, n]) => ({ label: s, value: n }));
}

function renderTopPIC(kpi) {
  if (!kpi || kpi.length === 0) {
    const picList = window.DASHBOARD_CONFIG?.picList || [];
    if (picList.length === 0) return emptyState({ title: "Belum ada KPI", icon: "chart" });
    return `<ul class="col" style="gap:var(--space-2)">${picList.slice(0, 5).map((pic, i) => `
      <li class="row gap-3" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
        <span class="t-mono t-muted t-sm" style="width:24px">${i + 1}.</span>
        <div class="auth-pic-avatar" style="width:32px;height:32px;font-size:var(--text-xs)">${initials(pic)}</div>
        <span class="flex-1 t-sm" style="font-weight:600">${escapeHTML(pic)}</span>
        <span class="t-sm t-muted t-mono">—</span>
      </li>`).join("")}</ul>`;
  }
  const byPIC = {};
  kpi.forEach((r) => {
    const pic = r.PIC || "Unknown";
    if (!byPIC[pic]) byPIC[pic] = { total: 0, achieved: 0, score: 0 };
    byPIC[pic].total++;
    const s = (r.Status || "").toLowerCase();
    const isAchieved = s.includes("achieve") || s.includes("done");
    if (isAchieved) {
      byPIC[pic].achieved++;
      byPIC[pic].score += 100;
    } else {
      const t = Number(r.Target) || 0;
      const a = Number(r.Actual) || 0;
      if (t > 0) byPIC[pic].score += (a / t) * 70;
      else byPIC[pic].score += 30;
    }
  });
  const ranked = Object.entries(byPIC)
    .map(([pic, v]) => ({ pic, ...v, rate: v.total > 0 ? (v.achieved / v.total) * 100 : 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  return `<ul class="col" style="gap:var(--space-2)">${ranked
    .map(
      (r, i) => `
    <li class="row gap-3" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="t-mono t-muted t-sm" style="width:24px">${i + 1}.</span>
      <div class="auth-pic-avatar" style="width:32px;height:32px;font-size:var(--text-xs)">${initials(r.pic)}</div>
      <span class="flex-1 t-sm" style="font-weight:600">${escapeHTML(r.pic)}</span>
      <span class="t-sm t-mono">${fmtPct(r.rate, 0)}</span>
    </li>`)
    .join("")}</ul>`;
}

function renderProgramStatus(program) {
  if (!program || program.length === 0) return emptyState({ title: "Belum ada program", icon: "file" });
  const byStatus = {};
  program.forEach((r) => {
    const s = r.Status || "Unknown";
    byStatus[s] = (byStatus[s] || 0) + 1;
  });
  return `<ul class="col" style="gap:var(--space-2)">${Object.entries(byStatus)
    .map(([s, n]) => `<li class="row-between"><span>${statusPill(s)}</span><span class="t-mono t-muted">${n}</span></li>`)
    .join("")}</ul>`;
}

function renderTargetPerusahaan(target) {
  if (!target || typeof target !== "object") return emptyState({ title: "Target belum tersedia", icon: "chart" });
  const entries = Object.entries(target)
    .filter(([k, v]) => v != null && typeof v !== "object")
    .slice(0, 6);
  if (entries.length === 0) return emptyState({ title: "Target belum tersedia", icon: "chart" });
  return `<ul class="col" style="gap:var(--space-2)">${entries
    .map(([k, v]) => `
    <li class="row-between" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="t-sm t-muted">${escapeHTML(String(k).replace(/_/g, " "))}</span>
      <span class="t-sm t-mono" style="font-weight:600">${escapeHTML(String(v))}</span>
    </li>`).join("")}</ul>`;
}

function renderRecent(jobdesk, kpi) {
  const all = [
    ...(jobdesk || []).map((r) => ({ ...r, _kind: "jobdesk", _date: r.Tanggal })),
    ...(kpi || []).map((r) => ({ ...r, _kind: "kpi", _date: r._editTime })),
  ];
  if (all.length === 0) return emptyState({ title: "Belum ada activity", icon: "inbox" });
  all.sort((a, b) => (b._date || "").localeCompare(a._date || ""));
  const recent = all.slice(0, 5);
  return `<ul class="col" style="gap:var(--space-2)">${recent
    .map((r) => `
    <li class="row gap-2" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="pill ${r._kind === "kpi" ? "pill-accent" : "pill-info"}">${r._kind === "kpi" ? "📊 KPI" : "✓ Jobdesk"}</span>
      <span class="t-sm flex-1" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(r.Aktivitas || r.Indikator || r["KPI ID"] || r["Jobdesk ID"] || "(tanpa judul)")}</span>
      <span class="t-xs t-muted">${escapeHTML(r.PIC || "")}</span>
    </li>`).join("")}</ul>`;
}