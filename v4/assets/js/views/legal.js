// views/legal.js — SOW compliance, izin tracker, expiry timeline (Bu Nisya).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, kanbanBoard, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatDate, formatNumber, formatPercent } from "../lib/format.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = `
    <span class="section-label__index">02</span>
    <h1 style="margin-top:8px">Legal</h1>
    <p style="color:var(--color-text-muted)">Compliance · izin · kontrak — semua dokumen grup 3 PT</p>
  `;

  const [sow, divisi, personal] = await Promise.all([
    fetchData("sow.json"),
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
  ]);

  const legalKpis = (divisi?.divisi || []).find(d => d.slug === "legal")?.kpis || [];

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
  const buNisyaKpi = (personal?.rows || []).filter(k => k.pic === "Bu Nisya");
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

  // 03 — Izin Tracker (two-third)
  const today = new Date("2026-07-28");
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().split("T")[0]; };
  const izinRows = [
    { izin: "SHM Konsumen 1-12", jenis: "SHM",   stage: "Submitted", expiry: addDays(today, 30) },
    { izin: "IMB/PBG Cluster B-7", jenis: "IMB", stage: "Draft",    expiry: addDays(today, 14) },
    { izin: "SLF Cluster A",       jenis: "SLF", stage: "Review",   expiry: addDays(today, 60) },
    { izin: "Kontrak Vendor Semen",jenis: "Kontrak", stage: "Approved", expiry: addDays(today, 180) },
    { izin: "AJB Akad Kredit 1",   jenis: "AJB", stage: "Submitted", expiry: addDays(today, 7) },
    { izin: "AJB Akad Kredit 2",   jenis: "AJB", stage: "Approved",  expiry: addDays(today, 90) },
    { izin: "PBG Cluster A ext.",  jenis: "PBG", stage: "Draft",    expiry: addDays(today, 21) },
    { izin: "Kontrak Marketing",   jenis: "Kontrak", stage: "Review", expiry: addDays(today, 45) },
    { izin: "IMB Cluster C-1",     jenis: "IMB", stage: "Submitted", expiry: addDays(today, 100) },
    { izin: "SLF Cluster B-7",     jenis: "SLF", stage: "Draft",    expiry: addDays(today, 200) },
  ].map(r => {
    const days = Math.round((new Date(r.expiry) - today) / 86400000);
    return { ...r, countdown: days + " hari", countdown_chip: days < 30 && days > 0 ? "danger" : days < 0 ? "danger" : days < 60 ? "warning" : "success" };
  });

  const sec2 = document.createElement("section");
  sec2.className = "card bento-two-third";
  sec2.appendChild(sectionLabel(3, "Izin Tracker", "SHM · IMB · PBG · SLF · AJB · Kontrak"));
  sec2.appendChild(dataTable({
    columns: [
      { key: "izin", label: "Izin" },
      { key: "jenis", label: "Jenis", filter: true, filterLabel: "Semua jenis" },
      { key: "stage", label: "Stage", chip: r => r.stage === "Approved" ? "success" : r.stage === "Submitted" ? "info" : r.stage === "Review" ? "warning" : "danger" },
      { key: "expiry", label: "Expiry", value: r => r.expiry },
      { key: "countdown", label: "Sisa", chip: r => r.countdown_chip },
    ],
    rows: izinRows,
    viewModes: ["list", "board", "calendar"],
    groupBy: { key: "stage", columns: [
      { id: "Draft", label: "Draft", match: v => v === "Draft" },
      { id: "Review", label: "Review", match: v => v === "Review" },
      { id: "Submitted", label: "Submitted", match: v => v === "Submitted" },
      { id: "Approved", label: "Approved", match: v => v === "Approved" },
    ]},
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async (row, key) => { toast(`Izin "${row.izin}" → ${key} = ${row[key]}`, "info"); },
    bulkActions: [
      { label: "Set Approved", kind: "success", onClick: sel => toast(`${sel.length} izin disetujui`, "success") },
      { label: "Set Review",   kind: "warning", onClick: sel => toast(`${sel.length} izin di-review`, "warning") },
    ],
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "izin-tracker",
    calendarDate: "expiry",
    aggregation: {
      label: "Total / Approved / <30 hari",
      fn: rows => {
        const soon = rows.filter(r => { const d = new Date(r.expiry); return (d - Date.now()) / 86400000 < 30 && d > Date.now(); }).length;
        return `${rows.length} / ${rows.filter(r => r.stage === "Approved").length} / ${soon}`;
      }
    },
  }));
  container.appendChild(sec2);

  // 04 — Expiry timeline (third)
  const sec3 = document.createElement("section");
  sec3.className = "card bento-third";
  sec3.appendChild(sectionLabel(4, "Expiry Terdekat", "Top 5"));
  const sorted = [...izinRows].sort((a, b) => new Date(a.expiry) - new Date(b.expiry)).slice(0, 5);
  const timeline = document.createElement("ul");
  timeline.style.listStyle = "none";
  timeline.style.padding = "0";
  timeline.style.margin = "0";
  for (const r of sorted) {
    const li = document.createElement("li");
    li.style.padding = "8px 0";
    li.style.borderBottom = "1px solid var(--color-border)";
    li.style.fontSize = "var(--text-sm)";
    li.innerHTML = `<div style="font-weight:500">${r.izin}</div><div style="display:flex;gap:6px;align-items:center;margin-top:4px"><span class="chip chip--${r.countdown_chip}">${r.countdown}</span><span style="color:var(--color-text-muted);font-size:var(--text-xs)">${r.jenis} · ${formatDate(r.expiry)}</span></div>`;
    timeline.appendChild(li);
  }
  sec3.appendChild(timeline);
  container.appendChild(sec3);

  // 05 — KPI Compliance (full)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(5, "KPI Compliance", "Bu Nisya · BAB 7"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true },
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
    onEdit: async () => { toast("Update tersimpan (mock)", "success"); },
    bulkActions: [
      { label: "Tandai Selesai", kind: "success", onClick: sel => toast(`${sel.length} ditandai selesai`, "success") },
    ],
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec4);
}
