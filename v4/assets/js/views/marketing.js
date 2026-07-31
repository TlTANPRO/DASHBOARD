// views/marketing.js — Lead funnel, pipeline, PIC performance, channel mix (Marketing).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatNumber, formatPercent, formatIDR } from "../lib/format.js";
import { barChart, donutChart } from "../lib/charts.js";
import { h, Fragment } from "../lib/dom.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = "";
  hero.appendChild(h("span", { class: "section-label__index" }, "03"));
  hero.appendChild(h("h1", { style: { marginTop: "8px" } }, "Marketing"));
  hero.appendChild(h("p", { class: "u-text-muted" }, "Lead → Survey → SP3K → Closing · 4 PIC marketing"));

  const [divisi, personal, leadsData, contentData] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
    fetchData("leads.json"),
    fetchData("content.json"),
  ]);

  const mktKpis = (divisi?.divisi || []).find(d => d.slug === "marketing")?.kpis || [];
  const allLeads = leadsData?.leads || [];
  const allPosts = contentData?.posts || [];

  // 01 — Hero scorecards (4 from real data)
  const stageCounts = allLeads.reduce((acc, l) => {
    acc[l.stage] = (acc[l.stage] || 0) + 1;
    return acc;
  }, {});
  const leadScorecard = [
    { label: "Total Leads", value: allLeads.length.toString(), target: 200 },
    { label: "Qualified", value: (stageCounts["Qualified"] || 0).toString(), target: 60 },
    { label: "Proposal", value: (stageCounts["Proposal"] || 0).toString(), target: 20 },
    { label: "Won", value: (stageCounts["Won"] || 0).toString(), target: 8 },
  ];
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  // Use real KPI if available, else derive from data
  const cards = mktKpis.slice(0, 4).length ? mktKpis.slice(0, 4) : leadScorecard;
  cards.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator || k.label, value: k.actual || k.value, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const mktRows = (personal?.rows || []).filter(k => ["Mada", "Riza", "Yudi/Sdek", "Amir"].includes(k.pic));
  const missingEvidence = mktRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) {
    banner.style.position = "static";
    banner.style.transform = "none";
    banner.style.display = "inline-block";
    banner.style.margin = "16px 0";
    container.appendChild(banner);
  }

  // 02 — Lead Funnel (two-third) — REAL stage distribution from leads.json
  const funnelSec = document.createElement("section");
  funnelSec.className = "card bento-two-third";
  funnelSec.appendChild(sectionLabel(2, "Lead Funnel", `Lead → Qualified → Proposal → Won (${allLeads.length} total)`));
  const funnelWrap = document.createElement("div");
  funnelWrap.className = "u-flex-col u-align-center u-mt-3";
  funnelSec.appendChild(funnelWrap);
  funnelWrap.appendChild(barChart({
    data: ["Lead", "Qualified", "Survey", "Proposal", "Negotiation", "Won"].map(s => ({
      label: s, value: stageCounts[s] || 0,
    })),
    height: 200,
    color: 1,
  }));
  container.appendChild(funnelSec);

  // 03 — Conversion donut (third)
  const conversionSec = document.createElement("section");
  conversionSec.className = "card bento-third";
  conversionSec.appendChild(sectionLabel(3, "Conversion Rate", `${((stageCounts["Won"] || 0) / Math.max(allLeads.length, 1) * 100).toFixed(1)}%`));
  const donutWrap = document.createElement("div");
  donutWrap.className = "u-flex u-justify-end u-p-4";
  conversionSec.appendChild(donutWrap);
  donutWrap.appendChild(donutChart({
    value: stageCounts["Won"] || 0,
    max: Math.max(allLeads.length, 1),
    color: 3,
    size: 160,
    label: "Won",
  }));
  container.appendChild(conversionSec);

  // 04 — PIC Marketing Performance (full)
  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "PIC Marketing Performance", "Mada · Riza · Yudi/Sdek · Amir"));
  sec3.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
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
    onEdit: async () => { toast("Update tersimpan", "success"); },
    bulkActions: [
      { label: "Tandai Tercapai", kind: "success", onClick: sel => toast(`${sel.length} KPI ditandai closing`, "success") },
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

  // 05 — Leads Pipeline (two-third) — REAL data from leads.json
  const sec4 = document.createElement("section");
  sec4.className = "card bento-two-third";
  sec4.appendChild(sectionLabel(5, "Lead Pipeline", `${allLeads.length} lead · 8 stage · 8 source`));
  const leadsForTable = allLeads.map(l => ({
    id: l.id, name: l.name, source: l.source, stage: l.stage,
    value: l.value, pic: l.pic, cluster: l.cluster,
    last_contact: l.last_contact, score: l.score, phone: l.phone,
  }));
  sec4.appendChild(dataTable({
    columns: [
      { key: "id", label: "ID", mono: true },
      { key: "name", label: "Nama" },
      { key: "source", label: "Source", filter: true, filterLabel: "Semua source" },
      { key: "stage", label: "Stage", filter: true, chip: r => r.stage === "Won" ? "success" : r.stage === "Lost" ? "danger" : r.stage === "Dormant" ? "info" : "warning" },
      { key: "cluster", label: "Cluster" },
      { key: "pic", label: "PIC", filter: true },
      { key: "value", label: "Value", numeric: true, value: r => formatIDR(r.value) },
      { key: "score", label: "Score", numeric: true, chip: r => r.score >= 80 ? "success" : r.score >= 60 ? "info" : r.score >= 40 ? "warning" : "danger" },
    ],
    rows: leadsForTable,
    viewModes: ["list", "board"],
    groupBy: { key: "stage", columns: [
      { id: "Lead", label: "Lead", match: v => v === "Lead" },
      { id: "Qualified", label: "Qualified", match: v => v === "Qualified" },
      { id: "Survey", label: "Survey", match: v => v === "Survey" },
      { id: "Proposal", label: "Proposal", match: v => v === "Proposal" },
      { id: "Negotiation", label: "Negotiation", match: v => v === "Negotiation" },
      { id: "Won", label: "Won", match: v => v === "Won" },
      { id: "Lost", label: "Lost", match: v => v === "Lost" },
      { id: "Dormant", label: "Dormant", match: v => v === "Dormant" },
    ]},
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "leads-pipeline",
    aggregation: { label: "Total / Won / Lost", fn: rows => `${rows.length} / ${rows.filter(r => r.stage === "Won").length} / ${rows.filter(r => r.stage === "Lost").length}` },
  }));
  container.appendChild(sec4);

  // 06 — Channel performance (third) — REAL data from content.json
  const channelMix = allPosts.reduce((acc, p) => {
    const ch = p.channel;
    if (!acc[ch]) acc[ch] = { reach: 0, eng: 0, leads: 0, count: 0 };
    acc[ch].reach += p.reach;
    acc[ch].eng += p.engagement;
    acc[ch].leads += p.leads_generated;
    acc[ch].count += 1;
    return acc;
  }, {});
  const channelSec = document.createElement("section");
  channelSec.className = "card bento-third";
  channelSec.appendChild(sectionLabel(6, "Channel Performance", `${allPosts.length} post · 90 hari`));
  const channelWrap = document.createElement("div");
  channelWrap.className = "u-flex-col u-gap-3 u-mt-3";
  channelSec.appendChild(channelWrap);
  for (const [ch, s] of Object.entries(channelMix)) {
    const row = document.createElement("div");
    row.className = "u-flex-row u-justify-between u-gap-3";
    row.appendChild(h("span", { class: "u-text-sm u-text-muted" }, ch));
    row.appendChild(h("strong", { class: "u-mono" }, formatNumber(s.reach)));
    channelWrap.appendChild(row);
  }
  container.appendChild(channelSec);

  markForReveal(container);
  reveal(container);
}
