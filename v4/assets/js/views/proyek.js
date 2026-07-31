// views/proyek.js — SP3K pipeline, Gantt timeline, budget vs actual, vendor score, QC heatmap (Rizal, Amir).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatIDR, formatPercent, formatDate } from "../lib/format.js";
import { heatmap, donutChart } from "../lib/charts.js";
import { h } from "../lib/dom.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = "";
  hero.appendChild(h("span", { class: "section-label__index" }, "05"));
  hero.appendChild(h("h1", { style: { marginTop: "8px" } }, "Proyek"));
  hero.appendChild(h("p", { class: "u-text-muted" }, "SP3K pipeline · Gantt timeline · budget variance · vendor performance"));

  const [divisi, personal, sp3kData, budgetData, vendorsData] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
    fetchData("sp3k.json"),
    fetchData("budget.json"),
    fetchData("vendors.json"),
  ]);

  const pryKpis = (divisi?.divisi || []).find(d => d.slug === "proyek")?.kpis || [];
  const projects = sp3kData?.projects || [];
  const budgetLines = (budgetData?.lines || []).filter(l => ["Material", "Upah", "Maintenance", "IT"].includes(l.kategori));
  const vendors = (vendorsData?.vendors || []).filter(v => ["Material", "Upah", "Subkon", "Alat"].includes(v.kategori));

  // 01 — Hero scorecards
  const projectStageCount = projects.reduce((acc, p) => { acc[p.stage] = (acc[p.stage] || 0) + 1; return acc; }, {});
  const heroCards = pryKpis.slice(0, 4).length ? pryKpis.slice(0, 4) : [
    { indikator: "Total Proyek", target: projects.length, actual: projects.length },
    { indikator: "Stage SPK", target: projectStageCount["SPK"] || 0, actual: projectStageCount["SPK"] || 0 },
    { indikator: "Stage Retensi", target: projectStageCount["Retensi"] || 0, actual: projectStageCount["Retensi"] || 0 },
    { indikator: "Budget Variance", target: `${formatPercent(((budgetData?.summary?.total_actual || 0) / (budgetData?.summary?.total_planned || 1) - 1) * 100)}`, actual: `${projects.length} proyek` },
  ];
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  heroCards.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const pryRows = (personal?.rows || []).filter(k => ["Rizal", "Amir", "Mada"].includes(k.pic));
  const missingEvidence = pryRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — SP3K Pipeline (full) — real projects
  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(2, "SP3K Pipeline", `${projects.length} proyek · 5 stage`));
  sec.appendChild(dataTable({
    columns: [
      { key: "id", label: "ID", mono: true },
      { key: "client", label: "Client" },
      { key: "stage", label: "Stage", filter: true, chip: r => ({
        SP3K: "info", OTS: "warning", SPK: "success", Retensi: "warning", Selesai: "success",
      }[r.stage] || "info") },
      { key: "value", label: "Value", numeric: true, value: r => formatIDR(r.value) },
      { key: "progress_pct", label: "Progress", numeric: true, chip: r => r.progress_pct >= 80 ? "success" : r.progress_pct >= 50 ? "info" : r.progress_pct >= 30 ? "warning" : "danger" },
      { key: "pic", label: "PIC" },
      { key: "sp3k_date", label: "Tgl SP3K", value: r => formatDate(r.sp3k_date) },
      { key: "ots_date", label: "Tgl OTS", value: r => formatDate(r.ots_date) },
      { key: "spk_date", label: "Tgl SPK", value: r => formatDate(r.spk_date) },
      { key: "budget_used_pct", label: "Budget Used", numeric: true, chip: r => r.budget_used_pct >= 90 ? "danger" : r.budget_used_pct >= 70 ? "warning" : "success" },
      { key: "blockers", label: "Blockers", value: r => (r.blockers || []).map(b => b.issue).join("; ") || "—", truncate: true },
    ],
    rows: projects,
    viewModes: ["list", "board"],
    groupBy: { key: "stage", columns: [
      { id: "SP3K", label: "SP3K", match: v => v === "SP3K" },
      { id: "OTS", label: "OTS", match: v => v === "OTS" },
      { id: "SPK", label: "SPK", match: v => v === "SPK" },
      { id: "Retensi", label: "Retensi", match: v => v === "Retensi" },
      { id: "Selesai", label: "Selesai", match: v => v === "Selesai" },
    ]},
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "sp3k-pipeline",
    aggregation: { label: "Total / SPK / Selesai", fn: rs => `${rs.length} / ${rs.filter(r => r.stage === "SPK").length} / ${rs.filter(r => r.stage === "Selesai").length}` },
  }));
  container.appendChild(sec);

  // 03 — Gantt Timeline per project (derived from milestones)
  const ganttRows = projects.flatMap(p => p.milestones.map((m, i) => ({
    project: p.client,
    name: m.name,
    date: m.date,
    done: m.done,
    seq: i + 1,
    stage: p.stage,
  })));
  const secG = document.createElement("section");
  secG.className = "card bento-full";
  secG.appendChild(sectionLabel(3, "Gantt Timeline", `${projects.length} proyek × ${projects[0]?.milestones.length || 5} milestone`));
  secG.appendChild(dataTable({
    columns: [
      { key: "project", label: "Proyek" },
      { key: "name", label: "Milestone", filter: true },
      { key: "date", label: "Target Date", value: r => formatDate(r.date), mono: true },
      { key: "done", label: "Status", chip: r => r.done ? "success" : "warning" },
      { key: "seq", label: "Step", numeric: true },
    ],
    rows: ganttRows,
    viewModes: ["list", "board"],
    groupBy: { key: "project", columns: projects.map(p => ({ id: p.client, label: p.client, match: v => v === p.client })) },
    searchable: true,
    sortable: true,
    calendarDate: "date",
    aggregation: { label: "Total milestone / Done", fn: rs => `${rs.length} / ${rs.filter(r => r.done).length}` },
  }));
  container.appendChild(secG);

  // 04 — Budget vs Actual (half) — real data
  const sec2 = document.createElement("section");
  sec2.className = "card bento-half";
  sec2.appendChild(sectionLabel(4, "Budget vs Actual", `${budgetLines.length} line item proyek`));
  sec2.appendChild(dataTable({
    columns: [
      { key: "line_id", label: "Line", mono: true },
      { key: "kategori", label: "Kategori", filter: true },
      { key: "deskripsi", label: "Deskripsi", truncate: true },
      { key: "planned", label: "Planned", numeric: true, value: r => formatIDR(r.planned) },
      { key: "actual", label: "Actual", numeric: true, value: r => formatIDR(r.actual) },
      { key: "variance_pct", label: "Variance %", numeric: true, chip: r => r.variance_pct > 5 ? "danger" : r.variance_pct >= 0 ? "warning" : "success" },
      { key: "status", label: "Status", chip: r => r.status === "over" ? "danger" : r.status === "under" ? "warning" : "success" },
    ],
    rows: budgetLines,
    searchable: true,
    exportable: true,
    exportName: "budget-proyek",
    aggregation: {
      label: "Total Planned / Actual / Variance",
      fn: rows => `${formatIDR(rows.reduce((a, r) => a + r.planned, 0))} / ${formatIDR(rows.reduce((a, r) => a + r.actual, 0))} / ${formatIDR(rows.reduce((a, r) => a + r.variance, 0))}`,
    },
  }));
  container.appendChild(sec2);

  // 05 — Vendor Performance (half)
  const sec3 = document.createElement("section");
  sec3.className = "card bento-half";
  sec3.appendChild(sectionLabel(5, "Vendor Performance", `${vendors.length} vendor · score history 6 bulan`));
  sec3.appendChild(dataTable({
    columns: [
      { key: "id", label: "ID", mono: true },
      { key: "name", label: "Vendor" },
      { key: "kategori", label: "Kategori", filter: true },
      { key: "pic", label: "PIC" },
      { key: "score_current", label: "Score", numeric: true, chip: r => r.score_current >= 85 ? "success" : r.score_current >= 70 ? "info" : r.score_current >= 60 ? "warning" : "danger" },
      { key: "score_avg", label: "Avg 6mo", numeric: true },
      { key: "po_count_ytd", label: "PO YTD", numeric: true },
      { key: "total_value_ytd", label: "Value YTD", numeric: true, value: r => formatIDR(r.total_value_ytd) },
      { key: "status", label: "Status", chip: r => r.status === "active" ? "success" : r.status === "review" ? "warning" : "danger" },
    ],
    rows: vendors,
    viewModes: ["list", "board"],
    groupBy: { key: "kategori", columns: ["Material", "Upah", "Alat", "Subkon"].map(k => ({
      id: k, label: k, match: v => v === k,
    }))},
    searchable: true,
    sortable: true,
    aggregation: {
      label: "Avg score",
      fn: rows => rows.length ? rows.reduce((a, r) => a + r.score_current, 0) / rows.length : 0,
    },
  }));
  container.appendChild(sec3);

  // 06 — KPI Proyek Personal (full)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(6, "KPI Proyek Personal", "Rizal · Amir · Mada · BAB 7"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
      { key: "kpi", label: "KPI" },
      { key: "target", label: "Target" },
      { key: "actual", label: "Actual", chip: r => r.actual ? "success" : "warning" },
      { key: "evidence", label: "Evidence", chip: r => r.evidence ? "success" : "danger" },
    ],
    rows: pryRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: [
      { id: "Rizal", label: "Rizal", match: v => v === "Rizal" },
      { id: "Amir",  label: "Amir",  match: v => v === "Amir" },
      { id: "Mada",  label: "Mada",  match: v => v === "Mada" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan", "success"); },
    bulkActions: [
      { label: "Tandai On-time", kind: "success", onClick: sel => toast(`${sel.length} ditandai on-time`, "success") },
      { label: "Tandai QC PASS", kind: "info",    onClick: sel => toast(`${sel.length} ditandai QC PASS`, "info") },
    ],
    searchable: true,
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec4);

  // 07 — QC Heatmap (third) — derived from project milestone status
  const heatmapWrap = document.createElement("div");
  heatmapWrap.className = "u-flex-col u-align-center u-mt-3";
  // Build matrix from milestone completion rates per stage
  const stages = ["SP3K", "OTS", "SPK", "Retensi", "Selesai"];
  const matrix = stages.map(s => {
    const projs = projects.filter(p => p.stage === s);
    return [
      projs.length ? Math.round(projs.reduce((a, p) => a + p.progress_pct, 0) / projs.length) : 0,
      projs.length ? Math.min(100, projs.reduce((a, p) => a + p.budget_used_pct, 0) / projs.length) : 0,
      projs.length * 10 + 60,
      projs.length ? Math.round(projs.reduce((a, p) => a + p.milestones.filter(m => m.done).length, 0) / (projs.length * 5) * 100) : 0,
    ];
  });
  const qcSec = document.createElement("section");
  qcSec.className = "card bento-third";
  qcSec.appendChild(sectionLabel(7, "QC Heatmap", "5 stage × 4 kriteria"));
  qcSec.appendChild(heatmapWrap);
  heatmapWrap.appendChild(heatmap({ data: matrix, rows: 5, cols: 4, color: 3 }));
  const legend = document.createElement("div");
  legend.className = "u-flex-col u-gap-1 u-mt-3 u-text-xs u-text-muted";
  legend.appendChild(h("div", {}, "Kolom: Progress · Budget used · Volume · Milestone completion"));
  legend.appendChild(h("div", {}, "Baris: 5 stage (SP3K → Selesai)"));
  heatmapWrap.appendChild(legend);
  container.appendChild(qcSec);

  // 08 — Stage distribution donut (third)
  const stageSec = document.createElement("section");
  stageSec.className = "card bento-third";
  stageSec.appendChild(sectionLabel(8, "Stage Distribution", `${projects.length} proyek`));
  const donutWrap = document.createElement("div");
  donutWrap.className = "u-flex u-justify-end u-p-4";
  stageSec.appendChild(donutWrap);
  donutWrap.appendChild(donutChart({
    value: projectStageCount["Selesai"] || 0,
    max: projects.length,
    color: 3,
    size: 140,
    label: "Selesai",
  }));
  container.appendChild(stageSec);
  markForReveal(container);
  reveal(container);
}
