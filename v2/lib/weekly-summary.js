// weekly-summary.js — V2.1
// Compute per PIC per week stats. Show di master view + export ke clipboard (Markdown).

function startOfWeekISO(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday-based
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

function weekRange(weekStartISO) {
  const start = new Date(weekStartISO);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: weekStartISO, end: end.toISOString().split("T")[0] };
}

function weeklyStatsForPIC(pic, weekStart) {
  const range = weekRange(weekStart);
  const jobs = Store.get("jobdesk").filter(j =>
    j.PIC === pic && j.Tanggal >= range.start && j.Tanggal <= range.end
  );
  const kpis = Store.get("kpi").filter(k => k.PIC === pic);
  const done = jobs.filter(j => j.Status === "Done").length;
  const blocked = jobs.filter(j => j.Status === "Blocked").length;
  const total = jobs.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const kpiAchieved = kpis.filter(k => k.Status === "Achieved").length;
  const kpiOnTrack = kpis.filter(k => k.Status === "On Track").length;
  const kpiRisk = kpis.filter(k => k.Status === "At Risk" || k.Status === "Off Track").length;
  return { pic, weekStart: range.start, weekEnd: range.end, jobsTotal: total, jobsDone: done, jobsBlocked: blocked, jobsPct: pct, kpis: kpis.length, kpiAchieved, kpiOnTrack, kpiRisk };
}

function weeklySummaryMarkdown(weekStart = startOfWeekISO()) {
  const stats = PIC_ORDER.map(p => weeklyStatsForPIC(p, weekStart));
  const range = weekRange(weekStart);
  let md = `# Weekly Recap ${range.start} → ${range.end}\n\n`;
  md += `| PIC | Jobdone | Blocked | KPI On Track | KPI Achieved | KPI At Risk |\n`;
  md += `|-----|---------|---------|--------------|--------------|-------------|\n`;
  stats.forEach(s => {
    md += `| ${s.pic} | ${s.jobsDone}/${s.jobsTotal} (${s.jobsPct}%) | ${s.jobsBlocked} | ${s.kpiOnTrack} | ${s.kpiAchieved} | ${s.kpiRisk} |\n`;
  });
  md += `\n_Dihasilkan otomatis oleh Dashboard V2.1 — ${new Date().toISOString()}_\n`;
  return md;
}

function renderWeeklyRecap(targetEl, weekStart = startOfWeekISO()) {
  const stats = PIC_ORDER.map(p => weeklyStatsForPIC(p, weekStart));
  const html = `
    <div class="weekly-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
      <h3 style="font-size:var(--text-h3);letter-spacing:-0.01em">Weekly Recap · ${weekRange(weekStart).start} → ${weekRange(weekStart).end}</h3>
      <button class="btn btn-sm" id="weekly-export" type="button">Export Markdown</button>
    </div>
    <table class="crud-table">
      <thead><tr><th>PIC</th><th>Jobdone</th><th>Blocked</th><th>KPI On Track</th><th>Achieved</th><th>At Risk</th></tr></thead>
      <tbody>${stats.map(s => `<tr>
        <td>${escapeHTML(s.pic)}</td>
        <td class="num">${s.jobsDone}/${s.jobsTotal} (${s.jobsPct}%)</td>
        <td class="num">${s.jobsBlocked}</td>
        <td class="num">${s.kpiOnTrack}</td>
        <td class="num">${s.kpiAchieved}</td>
        <td class="num">${s.kpiRisk}</td>
      </tr>`).join("")}</tbody>
    </table>
  `;
  targetEl.innerHTML = html;
  $("#weekly-export")?.addEventListener("click", async () => {
    const md = weeklySummaryMarkdown(weekStart);
    try {
      await navigator.clipboard.writeText(md);
      toast("success", "Recap disalin ke clipboard");
    } catch (e) {
      toast("error", "Gagal salin: " + e.message);
    }
  });
}
