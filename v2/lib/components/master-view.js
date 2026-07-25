// master-view.js — V2.1
// Owner-only master control: 12 PIC dalam 1 view.
// Tiap card: avatar + nama + title + KPI mini + jobdesk count + status pill.
// Click → drill-down panel bawah.

const PIC_META = {
  "Pak Ardian":  { divisi: "Owner",      title: "Owner / Direktur" },
  "Bu Nisya":    { divisi: "Owner",      title: "Co-Director / Legal" },
  "Mada":        { divisi: "Operasional", title: "Chief of Staff" },
  "Riza":        { divisi: "Marketing",  title: "Digital Marketing" },
  "Yudi (Sdek)": { divisi: "Marketing",  title: "Sales Counter" },
  "Rizal":       { divisi: "Proyek",     title: "Kepala Pelaksana" },
  "Amir":        { divisi: "Proyek",     title: "Site Manager" },
  "Novita":      { divisi: "Admin",      title: "Admin Pemberkasan" },
  "Sinta":       { divisi: "Proyek",     title: "Purchasing + QC" },
  "Reni":        { divisi: "Media",      title: "Ketua Media" },
  "Rifki":       { divisi: "Media",      title: "Media Staff" },
  "Reta":        { divisi: "Media",      title: "Media Staff" },
};

const PIC_ORDER = ["Pak Ardian","Bu Nisya","Mada","Riza","Yudi (Sdek)","Rizal","Amir","Sinta","Novita","Reni","Rifki","Reta"];

function picInitials(nama) {
  return nama.split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase();
}

function statusForPIC(pic, kpis, jobs) {
  // Status traffic light computed from latest KPI + today's jobdesk
  const myKPI = kpis.filter(k => k.PIC === pic);
  const myJob = jobs.filter(j => j.PIC === pic && j.Tanggal === todayISO());
  if (myKPI.length === 0 && myJob.length === 0) return { tone: "muted", label: "Belum input" };
  const achievedCount = myKPI.filter(k => k.Status === "Achieved").length;
  const atRiskCount = myKPI.filter(k => k.Status === "At Risk" || k.Status === "Off Track").length;
  const doneToday = myJob.filter(j => j.Status === "Done").length;
  if (myJob.length === 0) return { tone: "warning", label: "Tidak ada job hari ini" };
  if (atRiskCount > 0) return { tone: "danger", label: `${atRiskCount} KPI at risk` };
  if (doneToday === myJob.length) return { tone: "success", label: "Semua selesai" };
  if (achievedCount > 0) return { tone: "success", label: `${achievedCount} achieved` };
  return { tone: "warning", label: `${doneToday}/${myJob.length} job done` };
}

function picCardHTML(pic, kpis, jobs) {
  const meta = PIC_META[pic] || { divisi: "—", title: "—" };
  const status = statusForPIC(pic, kpis, jobs);
  const todayJob = jobs.filter(j => j.PIC === pic && j.Tanggal === todayISO());
  const myKPI = kpis.filter(k => k.PIC === pic);
  const achieved = myKPI.filter(k => k.Status === "Achieved").length;
  const onTrack = myKPI.filter(k => k.Status === "On Track").length;
  return `
    <button class="pic-mini-card" data-pic="${escapeHTML(pic)}" type="button">
      <div class="pmc-head">
        <div class="pmc-avatar" aria-hidden="true">${picInitials(pic)}</div>
        <div class="pmc-name-block">
          <div class="pmc-name">${escapeHTML(pic)}</div>
          <div class="pmc-role">${escapeHTML(meta.title)}</div>
        </div>
      </div>
      <div class="pmc-divisi">${escapeHTML(meta.divisi)}</div>
      <div class="pmc-mini">
        <div class="pmc-stat">
          <div class="pmc-stat-val">${todayJob.filter(j => j.Status === "Done").length}/${todayJob.length}</div>
          <div class="pmc-stat-lbl">Job hari ini</div>
        </div>
        <div class="pmc-stat">
          <div class="pmc-stat-val">${achieved}/${myKPI.length}</div>
          <div class="pmc-stat-lbl">KPI achieved</div>
        </div>
        <div class="pmc-stat">
          <div class="pmc-stat-val">${onTrack}</div>
          <div class="pmc-stat-lbl">On Track</div>
        </div>
      </div>
      <div class="pmc-status">
        <span class="status-pill ${status.tone}">${escapeHTML(status.label)}</span>
      </div>
    </button>
  `;
}

function renderMasterView() {
  const kpis = Store.get("kpi");
  const jobs = Store.get("jobdesk");

  // Filter state
  const filterDivisi = $("#master-filter-divisi")?.value || "";
  const filterStatus = $("#master-filter-status")?.value || "";
  const list = PIC_ORDER.filter(pic => {
    const meta = PIC_META[pic];
    if (filterDivisi && meta?.divisi !== filterDivisi) return false;
    if (filterStatus) {
      const s = statusForPIC(pic, kpis, jobs);
      if (filterStatus === "active" && s.tone === "muted") return false;
      if (filterStatus !== "active" && s.tone !== filterStatus) return false;
    }
    return true;
  });

  const grid = $("#master-grid");
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `<p class="muted">Tidak ada PIC sesuai filter.</p>`;
  } else {
    grid.innerHTML = list.map(p => picCardHTML(p, kpis, jobs)).join("");
    grid.querySelectorAll(".pic-mini-card").forEach(btn => {
      btn.addEventListener("click", () => openPICDrill(btn.dataset.pic));
    });
  }
  $("#master-count").textContent = `${list.length} dari ${PIC_ORDER.length} PIC`;
}

function openPICDrill(pic) {
  const kpis = Store.get("kpi").filter(k => k.PIC === pic);
  const jobs = Store.get("jobdesk").filter(j => j.PIC === pic);
  const sows = Store.get("sow").filter(s => s.PIC === pic);
  const meta = PIC_META[pic] || { divisi: "—", title: "—" };
  const status = statusForPIC(pic, Store.get("kpi"), Store.get("jobdesk"));

  const html = `
    <div class="drill-head">
      <div>
        <h3 style="font-size: var(--text-h2); letter-spacing: -0.02em;">${escapeHTML(pic)}</h3>
        <p class="muted" style="font-size: var(--text-small);">${escapeHTML(meta.title)} · ${escapeHTML(meta.divisi)}</p>
        <div style="margin-top: var(--space-3);"><span class="status-pill ${status.tone}">${escapeHTML(status.label)}</span></div>
      </div>
      <button class="btn btn-ghost btn-sm" data-close-drill type="button">← Kembali</button>
    </div>

    <h4 class="drill-h4">KPI (${kpis.length})</h4>
    ${kpis.length === 0 ? `<p class="muted">Belum ada KPI.</p>` :
      `<table class="crud-table drill-table"><thead><tr><th>KPI ID</th><th>Target</th><th>Realisasi</th><th>Status</th></tr></thead>
       <tbody>${kpis.map(k => `<tr>
         <td><code>${escapeHTML(k["KPI ID"] || k.id)}</code></td>
         <td class="num">${k.Target ?? "—"} ${escapeHTML(k.Satuan || "")}</td>
         <td class="num">${k.Realisasi ?? "—"}</td>
         <td>${k.Status ? `<span class="status-pill ${k.Status === "Achieved" ? "success" : k.Status === "At Risk" ? "warning" : k.Status === "Off Track" ? "danger" : "muted"}">${escapeHTML(k.Status)}</span>` : "—"}</td>
       </tr>`).join("")}</tbody></table>`}

    <h4 class="drill-h4">Jobdesk hari ini (${jobs.filter(j => j.Tanggal === todayISO()).length})</h4>
    ${(() => {
      const today = jobs.filter(j => j.Tanggal === todayISO());
      if (today.length === 0) return `<p class="muted">Tidak ada jobdesk hari ini.</p>`;
      return `<ul class="drill-job-list">${today.map(j => `
        <li>
          <div class="djl-prio">${escapeHTML(j.Prioritas || "P3")}</div>
          <div class="djl-text">
            <div class="djl-name">${escapeHTML(j.Jobdesk || "")}</div>
            <div class="djl-target muted">Target: ${escapeHTML(j["Target Output"] || "—")}</div>
          </div>
          <span class="status-pill ${j.Status === "Done" ? "success" : j.Status === "Blocked" ? "danger" : j.Status === "In Progress" ? "warning" : "muted"}">${escapeHTML(j.Status || "To Do")}</span>
        </li>`).join("")}</ul>`;
    })()}

    <h4 class="drill-h4">SOW aktif (${sows.length})</h4>
    ${sows.length === 0 ? `<p class="muted">Belum ada SOW.</p>` :
      `<ul class="drill-sow-list">${sows.map(s => `<li>
        <div class="dsl-bullet" aria-hidden="true">•</div>
        <div>
          <div class="dsl-name">${escapeHTML(s.Deskripsi || s["SOW ID"] || "")}</div>
          <div class="muted" style="font-size: var(--text-xs);">${escapeHTML(s.Frekuensi || "")} · Bobot ${s["Bobot (%)"] ?? "—"}%</div>
        </div>
      </li>`).join("")}</ul>`}
  `;
  openModal(`Drill-down · ${pic}`, html);
  $("#modal-body").addEventListener("click", (e) => {
    if (e.target.closest("[data-close-drill]")) closeModal();
  }, { once: true });
}
