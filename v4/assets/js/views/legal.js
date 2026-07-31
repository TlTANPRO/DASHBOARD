// views/legal.js — SOW compliance, izin tracker, expiry timeline, vendor score (Bu Nisya).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatDate, formatNumber, formatPercent, formatIDR } from "../lib/format.js";
import { sparkline } from "../lib/charts.js";
import { h } from "../lib/dom.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = "";
  hero.appendChild(h("span", { class: "section-label__index" }, "02"));
  hero.appendChild(h("h1", { style: { marginTop: "8px" } }, "Legal"));
  hero.appendChild(h("p", { class: "u-text-muted" }, "Compliance · izin · kontrak — semua dokumen grup 3 PT"));

  const [sow, divisi, personal, vendorsData, auditData] = await Promise.all([
    fetchData("sow.json"),
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
    fetchData("vendors.json"),
    fetchData("audit-trail.json"),
  ]);

  const legalKpis = (divisi?.divisi || []).find(d => d.slug === "legal")?.kpis || [];
  const vendors = vendorsData?.vendors || [];
  const auditEntries = (auditData?.entries || []).filter(e => ["Bu Nisya", "Rifki", "Pak Ardian"].includes(e.actor) && ["approve", "reject", "comment"].includes(e.action)).slice(0, 20);

  // 01 — Hero scorecards
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  legalKpis.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator,
    value: k.actual || k.target,
    target: k.target,
    accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const buNisyaKpi = (personal?.rows || []).filter(k => ["Bu Nisya", "Rifki"].includes(k.pic));
  const missingEvidence = buNisyaKpi.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — SOW Bu Nisya (full)
  const legalSow = (sow?.sow || []).find(s => s.pic === "Bu Nisya");
  const sec = document.createElement("section");
  sec.className = "card bento-full";
  sec.appendChild(sectionLabel(2, "SOW Bu Nisya", "BAB 3"));
  sec.appendChild(dataTable({
    columns: [
      { key: "no", label: "#", numeric: true },
      { key: "items", label: "Tanggung Jawab" },
      { key: "target", label: "Standar", numeric: true },
    ],
    rows: (legalSow?.items || []).map((t, i) => ({ no: i + 1, items: t, target: "Wajib" })),
    searchable: true,
    exportable: true,
    exportName: "sow-bu-nisya",
    aggregation: { label: "Total item SOW", fn: rows => `${rows.length} item` },
  }));
  container.appendChild(sec);

  // 03 — Vendor Master + Score History (two-third)
  const sec2 = document.createElement("section");
  sec2.className = "card bento-two-third";
  sec2.appendChild(sectionLabel(3, "Vendor Master", `${vendors.length} vendor · 5 kategori · score history 6 bulan`));
  const vendorRows = vendors.map(v => ({
    id: v.id, name: v.name, kategori: v.kategori, pic: v.pic,
    score: v.score_current, score_avg: v.score_avg,
    po_count: v.po_count_ytd, value: v.total_value_ytd, status: v.status,
    score_history: v.score_history,
  }));
  sec2.appendChild(dataTable({
    columns: [
      { key: "id", label: "ID", mono: true },
      { key: "name", label: "Vendor" },
      { key: "kategori", label: "Kategori", filter: true },
      { key: "pic", label: "PIC" },
      { key: "score", label: "Score", numeric: true, chip: r => r.score >= 85 ? "success" : r.score >= 70 ? "info" : r.score >= 60 ? "warning" : "danger" },
      { key: "score_avg", label: "Avg", numeric: true },
      { key: "po_count", label: "PO YTD", numeric: true },
      { key: "value", label: "Value YTD", numeric: true, value: r => formatIDR(r.value) },
      { key: "status", label: "Status", chip: r => r.status === "active" ? "success" : r.status === "review" ? "warning" : "danger" },
    ],
    rows: vendorRows,
    viewModes: ["list", "board"],
    groupBy: { key: "kategori", columns: ["Material", "Upah", "Alat", "Subkon", "Jasa"].map(k => ({
      id: k, label: k, match: v => v === k,
    }))},
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "vendor-master",
    aggregation: {
      label: "Total vendor / Active / Blacklist",
      fn: rows => `${rows.length} / ${rows.filter(r => r.status === "active").length} / ${rows.filter(r => r.status === "blacklist").length}`,
    },
  }));
  container.appendChild(sec2);

  // 04 — Vendor Score History (third) — sparklines per vendor
  const sec3 = document.createElement("section");
  sec3.className = "card bento-third";
  sec3.appendChild(sectionLabel(4, "Top Vendor Trend", "Score history 6 bulan"));
  const sparkList = document.createElement("div");
  sparkList.className = "u-flex-col u-gap-3 u-mt-3";
  const topVendors = [...vendors].sort((a, b) => b.score_current - a.score_current).slice(0, 10);
  for (const v of topVendors) {
    const row = document.createElement("div");
    row.className = "u-flex-row u-justify-between u-align-center u-gap-3";
    const left = document.createElement("div");
    left.className = "u-flex-col u-gap-1";
    left.appendChild(h("strong", { class: "u-text-sm" }, v.name));
    left.appendChild(h("span", { class: "u-text-xs u-text-muted" }, `${v.kategori} · ${v.pic}`));
    row.appendChild(left);
    const right = document.createElement("div");
    right.className = "u-flex-row u-align-center u-gap-2";
    const spark = sparkline(v.score_history, v.score_current >= 85 ? 3 : v.score_current >= 70 ? 2 : 4, 24);
    if (spark) right.appendChild(spark);
    right.appendChild(h("strong", { class: "u-mono" }, String(v.score_current)));
    row.appendChild(right);
    sparkList.appendChild(row);
  }
  sec3.appendChild(sparkList);
  container.appendChild(sec3);

  // 05 — Legal Audit Trail (full)
  if (auditEntries.length) {
    const sec4 = document.createElement("section");
    sec4.className = "card bento-full";
    sec4.appendChild(sectionLabel(5, "Legal Audit Trail", `${auditEntries.length} entri terkait legal`));
    sec4.appendChild(dataTable({
      columns: [
        { key: "timestamp", label: "Waktu", mono: true, value: r => r.timestamp.replace("T", " ").slice(0, 19) },
        { key: "actor", label: "Aktor" },
        { key: "action", label: "Action", chip: r => r.action === "approve" ? "success" : r.action === "reject" ? "danger" : "info" },
        { key: "ref", label: "Ref", mono: true },
        { key: "target", label: "Target" },
      ],
      rows: auditEntries,
      viewModes: ["list"],
      searchable: true,
      sortable: true,
    }));
    container.appendChild(sec4);
  }

  // 06 — KPI Compliance (full)
  const sec5 = document.createElement("section");
  sec5.className = "card bento-full";
  sec5.appendChild(sectionLabel(6, "KPI Compliance", "Bu Nisya · Rifki · BAB 7"));
  sec5.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic" },
      { key: "kpi", label: "Indikator" },
      { key: "target", label: "Target" },
      { key: "actual", label: "Actual", chip: r => r.actual ? "success" : "warning" },
      { key: "evidence", label: "Evidence", chip: r => r.evidence ? "success" : "danger" },
    ],
    rows: buNisyaKpi,
    viewModes: ["list", "board"],
    groupBy: { key: "divisi", columns: [
      { id: "legal", label: "Legal", match: v => v === "legal" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan", "success"); },
    bulkActions: [
      { label: "Tandai Selesai", kind: "success", onClick: sel => toast(`${sel.length} ditandai selesai`, "success") },
    ],
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec5);
  markForReveal(container);
  reveal(container);
}
