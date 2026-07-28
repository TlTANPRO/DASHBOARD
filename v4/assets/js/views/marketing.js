// views/marketing.js — Lead funnel, pipeline, PIC performance, channel mix (Marketing).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./_partials.js";
import { getCurrentUser } from "../auth.js";
import { formatNumber, formatPercent } from "../lib/format.js";
import * as charts from "../charts/index.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = `
    <span class="section-label__index">03</span>
    <h1 style="margin-top:8px">Marketing</h1>
    <p style="color:var(--color-text-muted)">Lead → Survey → SP3K → Closing · 4 PIC marketing</p>
  `;

  const [divisi, personal] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
  ]);

  const mktKpis = (divisi?.divisi || []).find(d => d.slug === "marketing")?.kpis || [];

  // 01 — Hero scorecards
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  mktKpis.slice(0, 4).forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const mktRows = (personal?.rows || []).filter(k => ["Mada", "Riza", "Yudi/Sdek", "Amir"].includes(k.pic));
  const missingEvidence = mktRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Lead Funnel (two-third)
  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(2, "Lead Funnel", "Lead → Survey → SP3K → Closing"));
  const funnelChart = document.createElement("div");
  funnelChart.style.height = "220px";
  sec.appendChild(funnelChart);
  charts.bar(funnelChart, {
    data: [
      { label: "Lead",    value: 250, target: 250 },
      { label: "Survey",  value: 38,  target: 38 },
      { label: "SP3K",    value: 14,  target: 14 },
      { label: "Closing", value: 6,   target: 6 },
    ],
    height: 220,
  });
  container.appendChild(sec);

  // 03 — Conversion donut (third)
  const sec2 = document.createElement("section");
  sec2.className = "card bento-third";
  sec2.appendChild(sectionLabel(3, "Conversion Rate", "Target min 2.4%"));
  const donutWrap = document.createElement("div");
  donutWrap.style.display = "flex";
  donutWrap.style.justifyContent = "center";
  donutWrap.style.padding = "16px 0";
  sec2.appendChild(donutWrap);
  charts.donut(donutWrap, {
    segments: [{ label: "Closing", value: 6 }, { label: "Lost", value: 244 }],
    size: 160,
  });
  container.appendChild(sec2);

  // 04 — PIC Marketing Performance (full)
  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "PIC Marketing Performance", "Mada · Riza · Yudi/Sdek · Amir"));
  sec3.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "kpi", label: "KPI" },
      { key: "target", label: "Target" },
      { key: "actual", label: "Actual", chip: r => r.actual ? "success" : "warning" },
      { key: "evidence", label: "Evidence", chip: r => r.evidence ? "success" : "danger" },
      { key: "divisi", label: "Divisi" },
    ],
    rows: mktRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: [
      { id: "Mada", label: "Mada", match: v => v === "Mada" },
      { id: "Riza", label: "Riza", match: v => v === "Riza" },
      { id: "Yudi", label: "Yudi/Sdek", match: v => v === "Yudi/Sdek" },
      { id: "Amir", label: "Amir", match: v => v === "Amir" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan (mock)", "success"); },
    bulkActions: [
      { label: "Tandai Closing", kind: "success", onClick: sel => toast(`${sel.length} KPI ditandai closing`, "success") },
      { label: "Reset Actual",   kind: "warning", onClick: sel => toast(`${sel.length} KPI di-reset`, "warning") },
    ],
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "marketing-kpi",
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec3);

  // 05 — Lead Pipeline (two-third)
  const leads = [
    { nama: "Budi Santoso",   source: "IG",      stage: "Closing",   days_in_stage: 3  },
    { nama: "Siti Aminah",    source: "TikTok",  stage: "SP3K",      days_in_stage: 5  },
    { nama: "Andi Wijaya",    source: "Web",     stage: "Survey",    days_in_stage: 2  },
    { nama: "Dewi Lestari",   source: "Walk-in", stage: "New",       days_in_stage: 1  },
    { nama: "Rian Hidayat",   source: "FB",      stage: "Lost",      days_in_stage: 21 },
    { nama: "Maya Sari",      source: "IG",      stage: "Contacted", days_in_stage: 4  },
    { nama: "Hendra",         source: "Walk-in", stage: "SP3K",      days_in_stage: 7  },
    { nama: "Lina Marlina",   source: "TikTok",  stage: "Survey",    days_in_stage: 2  },
    { nama: "Yusuf",          source: "IG",      stage: "Closing",   days_in_stage: 1  },
    { nama: "Rina Wati",      source: "Web",     stage: "Contacted", days_in_stage: 3  },
    { nama: "Tono",           source: "Walk-in", stage: "Lost",      days_in_stage: 30 },
    { nama: "Sari",           source: "FB",      stage: "Survey",    days_in_stage: 5  },
  ];

  const sec4 = document.createElement("section");
  sec4.className = "card bento-two-third";
  sec4.appendChild(sectionLabel(5, "Lead Pipeline", "12 lead aktif"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "nama", label: "Nama" },
      { key: "source", label: "Source", filter: true, filterLabel: "Semua source" },
      { key: "stage", label: "Stage", chip: r => r.stage === "Closing" ? "success" : r.stage === "SP3K" || r.stage === "Survey" ? "warning" : r.stage === "New" || r.stage === "Contacted" ? "info" : "danger" },
      { key: "days_in_stage", label: "Hari", numeric: true, chip: r => r.days_in_stage > 14 ? "danger" : null },
    ],
    rows: leads,
    viewModes: ["list", "board"],
    groupBy: { key: "stage", columns: [
      { id: "New", label: "New", match: v => v === "New" },
      { id: "Contacted", label: "Contacted", match: v => v === "Contacted" },
      { id: "Survey", label: "Survey", match: v => v === "Survey" },
      { id: "SP3K", label: "SP3K", match: v => v === "SP3K" },
      { id: "Closing", label: "Closing", match: v => v === "Closing" },
      { id: "Lost", label: "Lost", match: v => v === "Lost" },
    ]},
    editable: true,
    onEdit: async () => { toast("Stage diupdate", "info"); },
    searchable: true,
    aggregation: { label: "Total lead / Closing / Lost", fn: rows => `${rows.length} / ${rows.filter(r => r.stage === "Closing").length} / ${rows.filter(r => r.stage === "Lost").length}` },
  }));
  container.appendChild(sec4);

  // 06 — Channel Mix (third)
  const sec5 = document.createElement("section");
  sec5.className = "card bento-third";
  sec5.appendChild(sectionLabel(6, "Channel Mix", "Sumber lead Juli"));
  const donutWrap2 = document.createElement("div");
  donutWrap2.style.display = "flex";
  donutWrap2.style.justifyContent = "center";
  donutWrap2.style.padding = "16px 0";
  sec5.appendChild(donutWrap2);
  charts.donut(donutWrap2, {
    segments: [
      { label: "IG", value: 40 },
      { label: "FB", value: 25 },
      { label: "TikTok", value: 20 },
      { label: "Web", value: 10 },
      { label: "Walk-in", value: 5 },
    ],
    size: 160,
  });
  container.appendChild(sec5);
}
