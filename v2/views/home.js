// views/home.js — Hero + KPI summary
import { API, loadSSOT } from "../lib/api.js";
import { statCard, bentoCard } from "../components/card.js";
import { pill, statusPill } from "../components/pill.js";
import { fmtIDR, fmtIDRShort, fmtNum, fmtPct, escapeHTML, initials } from "../lib/format.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";

export async function renderHome() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(4);

  // Load data parallel
  const [kpi, program, jobdesk, struktur, targetPerusahaan] = await Promise.all([
    API.listKPI().catch(() => []),
    API.listProgram().catch(() => []),
    API.listJobdesk().catch(() => []),
    loadSSOT("struktur-organisasi"),
    loadSSOT("target-perusahaan"),
  ]);

  // Stats
  const totalKPI = kpi.length;
  const achievedKPI = kpi.filter((r) => {
    const s = (r.Status || r.status || "").toLowerCase();
    return s.includes("achieve") || s.includes("done") || s.includes("selesai");
  }).length;
  const achievementRate = totalKPI > 0 ? (achievedKPI / totalKPI) * 100 : 0;

  const totalProgram = program.length;
  const activeProgram = program.filter((r) => {
    const s = (r.Status || r.status || "").toLowerCase();
    return s.includes("progress") || s.includes("active") || s.includes("running");
  }).length;

  // Render
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
          value: fmtPct(achievementRate, 1),
          delta: { direction: achievementRate >= 50 ? "up" : "down", text: `${achievedKPI}/${totalKPI} achieved` },
        })}
        ${statCard({ label: "Program Aktif", value: fmtNum(activeProgram), hint: `${totalProgram} total` })}
        ${statCard({ label: "Jobdesk", value: fmtNum(jobdesk.length), hint: "Logged" })}
      </div>
    </section>

    <section class="mt-6">
      <h2 class="h-2 mb-3">Ringkasan Cepat</h2>
      <div class="bento">
        ${bentoCard({
          title: "Top 5 PIC by KPI",
          body: renderTopPIC(kpi),
        })}
        ${bentoCard({
          title: "Status Program",
          body: renderProgramStatus(program),
        })}
        ${bentoCard({
          title: "Target Perusahaan",
          body: renderTargetPerusahaan(targetPerusahaan),
        })}
        ${bentoCard({
          title: "Recent Activity",
          body: renderRecent(jobdesk, program, kpi),
        })}
      </div>
    </section>
  `;
}

function renderTopPIC(kpi) {
  if (!kpi || kpi.length === 0) return emptyState({ title: "Belum ada KPI", body: "Tambah data KPI di menu KPI", icon: "chart" });
  const byPIC = {};
  kpi.forEach((r) => {
    const pic = r.PIC || r.pic || "Unknown";
    if (!byPIC[pic]) byPIC[pic] = { total: 0, achieved: 0 };
    byPIC[pic].total++;
    const s = (r.Status || r.status || "").toLowerCase();
    if (s.includes("achieve") || s.includes("done")) byPIC[pic].achieved++;
  });
  const ranked = Object.entries(byPIC)
    .map(([pic, v]) => ({ pic, ...v, rate: v.total > 0 ? (v.achieved / v.total) * 100 : 0 }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);
  return `<ul class="col" style="gap:var(--space-2)">${ranked
    .map(
      (r, i) => `
    <li class="row gap-3" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="t-mono t-muted t-sm" style="width:24px">${i + 1}.</span>
      <div class="auth-pic-avatar" style="width:32px;height:32px;font-size:var(--text-xs)">${initials(r.pic)}</div>
      <span class="flex-1 t-sm" style="font-weight:600">${escapeHTML(r.pic)}</span>
      <span class="t-sm t-mono">${fmtPct(r.rate, 0)}</span>
    </li>
  `
    )
    .join("")}</ul>`;
}

function renderProgramStatus(program) {
  if (!program || program.length === 0) return emptyState({ title: "Belum ada program", icon: "file" });
  const byStatus = {};
  program.forEach((r) => {
    const s = r.Status || r.status || "Unknown";
    byStatus[s] = (byStatus[s] || 0) + 1;
  });
  return `<ul class="col" style="gap:var(--space-2)">${Object.entries(byStatus)
    .map(([s, n]) => `<li class="row-between"><span>${statusPill(s)}</span><span class="t-mono t-muted">${n}</span></li>`)
    .join("")}</ul>`;
}

function renderTargetPerusahaan(target) {
  if (!target) return emptyState({ title: "Target tidak tersedia", icon: "chart" });
  const entries = Object.entries(target).slice(0, 6);
  return `<ul class="col" style="gap:var(--space-2)">${entries
    .map(
      ([k, v]) => `
    <li class="row-between" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="t-sm t-muted">${escapeHTML(String(k).replace(/_/g, " "))}</span>
      <span class="t-sm t-mono" style="font-weight:600">${escapeHTML(typeof v === "object" ? JSON.stringify(v).slice(0, 30) : String(v).slice(0, 30))}</span>
    </li>
  `
    )
    .join("")}</ul>`;
}

function renderRecent(jobdesk, program, kpi) {
  const all = [
    ...(jobdesk || []).map((r) => ({ ...r, _kind: "jobdesk" })),
    ...(program || []).map((r) => ({ ...r, _kind: "program" })),
    ...(kpi || []).map((r) => ({ ...r, _kind: "kpi" })),
  ];
  if (all.length === 0) return emptyState({ title: "Belum ada activity", icon: "inbox" });
  // sort by date if available
  all.sort((a, b) => {
    const ad = new Date(a.updatedAt || a.createdAt || 0);
    const bd = new Date(b.updatedAt || b.createdAt || 0);
    return bd - ad;
  });
  const recent = all.slice(0, 5);
  return `<ul class="col" style="gap:var(--space-2)">${recent
    .map(
      (r) => `
    <li class="row gap-2" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
      <span class="pill pill-muted">${escapeHTML(r._kind)}</span>
      <span class="t-sm flex-1" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(r.Nama || r.Judul || r["KPI ID"] || r.Id || r.id || "—")}</span>
    </li>
  `
    )
    .join("")}</ul>`;
}
