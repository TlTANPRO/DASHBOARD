// views/proyek.js — Gantt timeline, budget vs actual, vendor score, QC heatmap (Rizal, Amir).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./_partials.js";
import { getCurrentUser } from "../auth.js";
import { formatIDR, formatPercent } from "../lib/format.js";
import * as charts from "../charts/index.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = `
    <span class="section-label__index">05</span>
    <h1 style="margin-top:8px">Proyek</h1>
    <p style="color:var(--color-text-muted)">Timeline eksekusi · quality control · budget variance</p>
  `;

  const [divisi, personal] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
  ]);

  const pryKpis = (divisi?.divisi || []).find(d => d.slug === "proyek")?.kpis || [];

  // 01 — Hero scorecards
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  pryKpis.slice(0, 4).forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const pryRows = (personal?.rows || []).filter(k => k.divisi === "proyek");
  const missingEvidence = pryRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Timeline Gantt (full)
  const timeline = [
    { name: "Pondasi Cluster B-7",    start: 0,  end: 30, label: "Wk 1-12" },
    { name: "Struktur Cluster B-7",   start: 25, end: 60, label: "Wk 10-24" },
    { name: "Dinding Cluster B-7",    start: 55, end: 85, label: "Wk 22-34" },
    { name: "Atap Cluster B-7",       start: 75, end: 100, label: "Wk 30-40" },
    { name: "Finishing Cluster A",    start: 10, end: 50, label: "Wk 4-20", color: "var(--color-success)" },
    { name: "Pondasi Cluster B-8",    start: 5,  end: 35, label: "Wk 2-14" },
    { name: "Serah Terima Cluster A", start: 60, end: 80, label: "Wk 24-32" },
  ];

  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(2, "Timeline Proyek", "Q3 2026 · 7 fase"));
  sec.appendChild(dataTable({
    columns: [
      { key: "name",  label: "Fase" },
      { key: "start", label: "Start %", numeric: true },
      { key: "end",   label: "End %",   numeric: true },
      { key: "label", label: "Periode", ganttLabel: true },
    ],
    rows: timeline,
    viewModes: ["list", "gantt"],
    ganttStart: "start",
    ganttEnd: "end",
    ganttLabel: "label",
    searchable: true,
    exportable: true,
    exportName: "timeline",
  }));
  container.appendChild(sec);

  // 03 — Budget vs Actual (half)
  const budget = [
    { kategori: "Material",    budget: 800000000, actual: 820000000, variance: 2.5 },
    { kategori: "Upah tukang", budget: 400000000, actual: 380000000, variance: -5 },
    { kategori: "Vendor",      budget: 200000000, actual: 210000000, variance: 5 },
    { kategori: "Overhead",    budget: 150000000, actual: 145000000, variance: -3.3 },
  ];

  const sec2 = document.createElement("section");
  sec2.className = "card bento-half";
  sec2.appendChild(sectionLabel(3, "Budget vs Actual", "Per kategori biaya"));
  sec2.appendChild(dataTable({
    columns: [
      { key: "kategori", label: "Kategori" },
      { key: "budget",   label: "Budget", numeric: true, value: r => formatIDR(r.budget) },
      { key: "actual",   label: "Actual", numeric: true, value: r => formatIDR(r.actual) },
      { key: "variance", label: "Variance", numeric: true, chip: r => r.variance > 5 ? "danger" : r.variance >= 0 ? "warning" : "success" },
    ],
    rows: budget,
    searchable: true,
    exportable: true,
    exportName: "budget-vs-actual",
    aggregation: {
      label: "Total Budget / Actual / Variance",
      fn: rows => {
        const t = rows.reduce((a, r) => ({ b: a.b + (+r.budget || 0), ac: a.ac + (+r.actual || 0) }), { b: 0, ac: 0 });
        return `${formatIDR(t.b)} / ${formatIDR(t.ac)} / ${formatPercent((t.ac - t.b) / (t.b || 1) * 100)}`;
      }
    },
  }));
  container.appendChild(sec2);

  // 04 — Vendor Performance (half)
  const vendors = [
    { vendor: "Toko Bangunan Jaya",   kategori: "Material",  score: 88, last_delivery: "2026-07-20", status: "Aktif" },
    { vendor: "UD Sumber Rezeki",     kategori: "Material",  score: 75, last_delivery: "2026-07-18", status: "Aktif" },
    { vendor: "CV Mitra Konstruksi",  kategori: "Subkon",    score: 92, last_delivery: "2026-07-22", status: "Aktif" },
    { vendor: "Pak Tukang Solo",      kategori: "Upah",      score: 85, last_delivery: "2026-07-15", status: "Aktif" },
    { vendor: "TB Makmur",            kategori: "Material",  score: 65, last_delivery: "2026-07-10", status: "Evaluasi" },
    { vendor: "Cat Sejahtera",        kategori: "Finishing", score: 78, last_delivery: "2026-07-19", status: "Aktif" },
    { vendor: "Besi Baja Nusantara",  kategori: "Material",  score: 90, last_delivery: "2026-07-21", status: "Aktif" },
  ];

  const sec3 = document.createElement("section");
  sec3.className = "card bento-half";
  sec3.appendChild(sectionLabel(4, "Vendor Performance", "7 vendor aktif"));
  sec3.appendChild(dataTable({
    columns: [
      { key: "vendor", label: "Vendor" },
      { key: "kategori", label: "Kategori", filter: true, filterLabel: "Semua kategori" },
      { key: "score", label: "Score", numeric: true, chip: r => r.score >= 80 ? "success" : r.score >= 60 ? "warning" : "danger" },
      { key: "last_delivery", label: "Last Delivery" },
      { key: "status", label: "Status", chip: r => r.status === "Aktif" ? "success" : "warning" },
    ],
    rows: vendors,
    viewModes: ["list", "board"],
    groupBy: { key: "kategori", columns: [
      { id: "Material",  label: "Material",  match: v => v === "Material" },
      { id: "Subkon",    label: "Subkon",    match: v => v === "Subkon" },
      { id: "Upah",      label: "Upah",      match: v => v === "Upah" },
      { id: "Finishing", label: "Finishing", match: v => v === "Finishing" },
    ]},
    searchable: true,
    aggregation: {
      label: "Avg score",
      fn: rows => rows.length ? formatPercent(rows.reduce((a, r) => a + (+r.score || 0), 0) / rows.length) : "—"
    },
  }));
  container.appendChild(sec3);

  // 05 — KPI Proyek Personal (full)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(5, "KPI Proyek Personal", "Rizal · Amir · BAB 7"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
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
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan (mock)", "success"); },
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

  // 06 — Material Stock (third)
  const stock = [
    { name: "Semen",  current: 80,  target: 100, unit: "sak" },
    { name: "Bata",   current: 5000, target: 6000, unit: "pcs" },
    { name: "Besi",   current: 200, target: 300, unit: "batang" },
    { name: "Pasir",  current: 50,  target: 50,  unit: "truck" },
  ];
  const sec5 = document.createElement("section");
  sec5.className = "card bento-third";
  sec5.appendChild(sectionLabel(6, "Material Stock", "4 material kritis"));
  const stockWrap = document.createElement("div");
  stockWrap.style.display = "grid";
  stockWrap.style.gridTemplateColumns = "1fr 1fr";
  stockWrap.style.gap = "var(--space-3)";
  for (const s of stock) {
    const pct = s.current / s.target;
    const card = document.createElement("div");
    card.style.padding = "var(--space-3)";
    card.style.background = "var(--color-bg)";
    card.style.borderRadius = "var(--radius-md)";
    const chipKind = pct >= 0.9 ? "success" : pct >= 0.5 ? "warning" : "danger";
    card.innerHTML = `
      <div style="font-weight:500;font-size:var(--text-sm)">${s.name}</div>
      <div style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:700;margin-top:4px">${s.current}<span style="font-size:var(--text-sm);color:var(--color-text-muted)">/${s.target} ${s.unit}</span></div>
      <div style="margin-top:6px"><span class="chip chip--${chipKind}">${Math.round(pct * 100)}%</span></div>
    `;
    stockWrap.appendChild(card);
  }
  sec5.appendChild(stockWrap);
  container.appendChild(sec5);

  // 07 — QC Heatmap (third)
  const sec6 = document.createElement("section");
  sec6.className = "card bento-third";
  sec6.appendChild(sectionLabel(7, "QC Heatmap", "5 fase × 4 kriteria"));
  const heatmapWrap = document.createElement("div");
  heatmapWrap.style.padding = "8px 0";
  sec6.appendChild(heatmapWrap);
  charts.heatmap(heatmapWrap, {
    matrix: [
      [90, 85, 95, 80],
      [85, 80, 90, 75],
      [75, 70, 85, 70],
      [80, 75, 90, 80],
      [85, 80, 95, 85],
    ],
    xLabels: ["Kualitas", "Kecepatan", "Kepatuhan", "Safety"],
    yLabels: ["Pondasi", "Struktur", "Dinding", "Atap", "Finishing"],
    size: 14,
  });
  container.appendChild(sec6);
}
