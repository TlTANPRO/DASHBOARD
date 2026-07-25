// alerts.js — V2.1
// Compute alerts dari current Store (KPI, Jobdesk, SOW).
// Rules:
//  - Inactive: PIC tidak punya jobdesk hari ini (warning)
//  - Behind: KPI on track tapi realisation < 70% mid-periode (warning)
//  - At Risk: ada KPI with status At Risk/Off Track (danger)
//  - Unblock: jobdesk status Blocked > 2 hari (danger)
//  - Bottom 3 leaderboard (warning)

const AlertRules = [
  {
    id: "no-job-today",
    label: "Tidak ada job hari ini",
    tone: "warning",
    test: (pic, ctx) => {
      const todayJob = ctx.jobs.filter(j => j.PIC === pic && j.Tanggal === todayISO());
      return { triggered: ctx.kpis.length > 0 && todayJob.length === 0, count: todayJob.length };
    },
  },
  {
    id: "kpi-at-risk",
    label: "KPI At Risk / Off Track",
    tone: "danger",
    test: (pic, ctx) => {
      const risk = ctx.kpis.filter(k => k.PIC === pic && (k.Status === "At Risk" || k.Status === "Off Track"));
      return { triggered: risk.length > 0, count: risk.length };
    },
  },
  {
    id: "blocked-job",
    label: "Jobdesk Blocked",
    tone: "danger",
    test: (pic, ctx) => {
      const blocked = ctx.jobs.filter(j => j.PIC === pic && j.Status === "Blocked");
      return { triggered: blocked.length > 0, count: blocked.length };
    },
  },
  {
    id: "achievement-low",
    label: "Achievement < 50%",
    tone: "warning",
    test: (pic, ctx) => {
      const my = ctx.kpis.filter(k => k.PIC === pic && k.Target > 0);
      if (my.length === 0) return { triggered: false };
      const avg = my.reduce((s, k) => s + (k.Realisasi / k.Target), 0) / my.length;
      return { triggered: avg < 0.5, percent: Math.round(avg * 100) };
    },
  },
];

function computeAlerts(pic) {
  const ctx = { kpis: Store.get("kpi"), jobs: Store.get("jobdesk"), sows: Store.get("sow") };
  return AlertRules.map(r => {
    const r2 = r.test(pic, ctx);
    return { id: r.id, label: r.label, tone: r.tone, ...r2 };
  }).filter(a => a.triggered);
}

function alertCountFor(pic) {
  return computeAlerts(pic).length;
}

function totalAlertCount() {
  // Sum across all PIC, return count
  return PIC_ORDER.reduce((sum, p) => sum + alertCountFor(p), 0);
}

function renderAlertBadge() {
  const badge = $("#alert-badge");
  if (!badge) return;
  const count = Session.isOwner() ? totalAlertCount() : alertCountFor(Session.pic);
  badge.textContent = count;
  badge.hidden = count === 0;
}

function renderAlertPanel(targetEl) {
  const pics = Session.isOwner() ? PIC_ORDER : [Session.pic];
  const html = pics.map(pic => {
    const alerts = computeAlerts(pic);
    if (alerts.length === 0 && Session.isOwner()) return ""; // skip quiet PICs in master view
    return `
      <div class="alert-row ${alerts.length === 0 ? 'quiet' : ''}">
        <div class="alert-pic">${escapeHTML(pic)}</div>
        <div class="alert-list">
          ${alerts.length === 0 ? '<span class="muted">Tidak ada alert</span>' :
            alerts.map(a => `<span class="status-pill ${a.tone}">${escapeHTML(a.label)}${a.count ? ' · ' + a.count : ''}${a.percent != null ? ' · ' + a.percent + '%' : ''}</span>`).join(" ")}
        </div>
      </div>
    `;
  }).filter(Boolean).join("");

  targetEl.innerHTML = html || `<p class="muted">Tidak ada alert aktif.</p>`;
}
