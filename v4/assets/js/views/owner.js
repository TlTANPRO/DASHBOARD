// views/owner.js — Owner / Pak Ardian executive view.
// BEAT-Notion UX: bento grid, 4 scorecards, KPI perusahaan + PIC ranking + personal detail.

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./_partials.js";
import { formatPercent } from "../lib/format.js";
import { getCurrentUser } from "../auth.js";

export async function render({ container }) {
  container.innerHTML = "";

  const isOwner = !!getCurrentUser()?.is_owner;

  // ---------- Load data ----------
  const [perusahaan, personal] = await Promise.all([
    fetchData("kpi-perusahaan.json"),
    fetchData("kpi-personal.json"),
  ]);

  const l1 = perusahaan?.level_1 || [];
  const l2 = perusahaan?.level_2 || [];
  const personalRows = personal?.rows || [];

  // ---------- Hero (uses section-label DNA) ----------
  const hero = document.querySelector("#divisi-hero");
  if (hero) {
    hero.innerHTML = "";
    const lbl = sectionLabel(1, "Owner", "Pandangan eksekutif keseluruhan grup");
    const h1 = document.createElement("h1");
    h1.style.marginTop = "8px";
    h1.textContent = "KPI Perusahaan + Ranking PIC";
    const p = document.createElement("p");
    p.style.color = "var(--color-text-muted)";
    p.textContent = "Level 1 + Level 2 + 60 KPI personal dari 12 PIC. Editable oleh Owner.";
    hero.appendChild(lbl);
    hero.appendChild(h1);
    hero.appendChild(p);
  }

  // ---------- Evidence banner (top, before sections) ----------
  const missingEvidence = personalRows.filter(k => !k.evidence).length;
  if (missingEvidence > 0) {
    const banner = evidenceBanner(missingEvidence);
    if (banner) container.appendChild(banner);
  }

  // ============================================================
  // 01 — Hero: 4 scorecards from kpi-perusahaan.level_1
  // ============================================================
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  l1.slice(0, 4).forEach((k, i) => {
    scorecards.appendChild(kpiCard({
      label: k.indikator,
      value: k.actual || k.target,
      target: k.target,
      accent: i === 0,
    }));
  });
  container.appendChild(scorecards);

  // ============================================================
  // 02 — KPI Perusahaan (level_1 + level_2, bento-two-third)
  // ============================================================
  const sec2 = document.createElement("section");
  sec2.className = "card bento-two-third";
  sec2.appendChild(sectionLabel(2, "KPI Perusahaan", "Level 1 + Level 2"));

  const perusahaanRows = [
    ...l1.map(k => ({ ...k, level: "L1" })),
    ...l2.map(k => ({ ...k, level: "L2" })),
  ].map(k => ({
    ...k,
    status_chip: k.actual ? "OK" : "Pending",
  }));

  sec2.appendChild(dataTable({
    columns: [
      { key: "indikator", label: "Indikator" },
      { key: "level", label: "Level" },
      { key: "target", label: "Target" },
      {
        key: "actual",
        label: "Actual",
        chip: row => row.actual ? "success" : "warning",
        editable: isOwner,
      },
      {
        key: "status_chip",
        label: "Status",
        chip: row => row.status_chip === "OK" ? "success" : "warning",
        boardTitle: true,
      },
    ],
    rows: perusahaanRows,
    viewModes: ["list", "board"],
    groupBy: {
      key: "status_chip",
      columns: [
        { id: "OK", label: "Tercapai", match: v => v === "OK" },
        { id: "Pending", label: "Pending", match: v => v === "Pending" },
      ],
    },
    searchable: true,
    sortable: true,
    evidenceRequired: true,
    editable: isOwner,
    onEdit: async (row, colKey, newVal) => {
      toast(`Updated ${row.indikator} → ${newVal}`, "success");
    },
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`,
    },
  }));
  container.appendChild(sec2);

  // ============================================================
  // 03 — PIC Ranking (bento-third)
  // ============================================================
  const sec3 = document.createElement("section");
  sec3.className = "card bento-third";
  sec3.appendChild(sectionLabel(3, "Ranking PIC", "Pencapaian KPI personal"));

  const grouped = personalRows.reduce((acc, k) => {
    const key = k.pic || "—";
    if (!acc[key]) acc[key] = { pic: key, total_target: 0, total_actual: 0, count: 0 };
    if (k.target) acc[key].total_target += 1;
    if (k.actual) acc[key].total_actual += 1;
    acc[key].count += 1;
    return acc;
  }, {});

  const rankRows = Object.values(grouped)
    .map(r => ({
      pic: r.pic,
      total_target: r.total_target,
      total_actual: r.total_actual,
      pct: r.total_target > 0 ? Math.round((r.total_actual / r.total_target) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const topPic = rankRows[0]?.pic || "—";

  sec3.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic" },
      { key: "total_target", label: "Target", numeric: true },
      { key: "total_actual", label: "Actual", numeric: true },
      {
        key: "pct",
        label: "%",
        numeric: true,
        chip: row => row.pct >= 50 ? "success" : "danger",
      },
    ],
    rows: rankRows,
    viewModes: ["list"],
    searchable: true,
    sortable: true,
    aggregation: {
      label: "Top PIC",
      fn: () => topPic,
    },
  }));
  container.appendChild(sec3);

  // ============================================================
  // 04 — Personal KPI Detail (bento-full, 60 rows)
  // ============================================================
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(4, "Detail KPI Personal", "60 baris · 6 divisi · 12 PIC"));

  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic" },
      { key: "kpi", label: "KPI" },
      { key: "target", label: "Target" },
      {
        key: "actual",
        label: "Actual",
        chip: row => row.actual ? "success" : "warning",
        editable: true,
      },
      {
        key: "evidence",
        label: "Evidence",
        chip: row => row.evidence ? "success" : "danger",
        editable: true,
      },
      { key: "divisi", label: "Divisi", filter: true, filterLabel: "Semua divisi" },
    ],
    rows: personalRows,
    viewModes: ["list", "board"],
    groupBy: {
      key: "divisi",
      columns: [
        { id: "owner", label: "Owner", match: v => v === "owner" },
        { id: "legal", label: "Legal", match: v => v === "legal" },
        { id: "marketing", label: "Marketing", match: v => v === "marketing" },
        { id: "operasional", label: "Operasional", match: v => v === "operasional" },
        { id: "proyek", label: "Proyek", match: v => v === "proyek" },
        { id: "media", label: "Media", match: v => v === "media" },
      ],
    },
    searchable: true,
    sortable: true,
    evidenceRequired: true,
    editable: true,
    onEdit: async (row, colKey, newVal) => {
      toast(`Updated ${row.kpi} (${colKey}) → ${newVal}`, "success");
    },
    bulkActions: [
      {
        label: "Tandai Tercapai",
        kind: "success",
        onClick: sel => toast(`${sel.length} KPI ditandai tercapai`, "success"),
      },
      {
        label: "Tandai Pending",
        kind: "warning",
        onClick: sel => toast(`${sel.length} KPI ditandai pending`, "warning"),
      },
    ],
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`,
    },
  }));
  container.appendChild(sec4);
}
