// views/owner.js — Owner / Pak Ardian executive view.
// BEAT-Notion UX: bento grid, 4 scorecards, KPI perusahaan + PIC ranking + personal detail.

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { leaderboardSection, kpiDimensiSection, feeMediaSection, pricingTiersSection, managerSection, glosariumSection } from "./extras.js";
import { formatPercent, formatIDR } from "../lib/format.js";
import { getCurrentUser } from "../auth.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";

  const isOwner = !!getCurrentUser()?.is_owner;

  // ---------- Load data ----------
  const [perusahaan, personal, ref, budget, audit] = await Promise.all([
    fetchData("kpi-perusahaan.json"),
    fetchData("kpi-personal.json"),
    fetchData("reference.json"),
    fetchData("budget.json"),
    fetchData("audit-trail.json"),
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
        chip: row => row.pct >= 75 ? "success" : row.pct >= 50 ? "info" : row.pct >= 30 ? "warning" : "danger",
      },
      {
        key: "grade",
        label: "Grade",
        value: row => {
          if (row.pct >= 90) return "A";
          if (row.pct >= 75) return "B";
          if (row.pct >= 60) return "C";
          return "D";
        },
        chip: row => {
          const g = row.pct >= 90 ? "success" : row.pct >= 75 ? "info" : row.pct >= 60 ? "warning" : "danger";
          return g;
        },
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
      {
        key: "_grade",
        label: "Grade",
        value: row => {
          if (!row.actual) return "—";
          if (row.evidence) return "A";
          return "B";
        },
        chip: row => {
          if (!row.actual) return "warning";
          return row.evidence ? "success" : "info";
        },
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

  // ============================================================
  // 05–12 — V5.0 reference blocks (Leaderboard, KPI Dimensi, Fee,
  //         Pricing, Manager 3 Sifat, Glosarium)
  // ============================================================
  if (ref) {
    const lb = leaderboardSection(ref);
    if (lb) container.appendChild(lb);

    const dim = kpiDimensiSection(ref);
    if (dim) container.appendChild(dim);

    const fee = feeMediaSection(ref);
    if (fee) container.appendChild(fee);

    const tier = pricingTiersSection(ref);
    if (tier) container.appendChild(tier);

    const mgr = managerSection(ref);
    if (mgr) container.appendChild(mgr);

    const glos = glosariumSection(ref);
    if (glos) container.appendChild(glos);
  }

  // ============================================================
  // 13 — Budget line-item Q3-2026 (50 lines)
  // ============================================================
  const budgetLines = budget?.lines || [];
  if (budgetLines.length) {
    const budgetSec = document.createElement("section");
    budgetSec.className = "card bento-full";
    budgetSec.appendChild(sectionLabel(8, "Budget Q3-2026 · Line Item",
      `${budgetLines.length} baris · 8 kategori · planned vs actual`));
    budgetSec.appendChild(dataTable({
      columns: [
        { key: "line_id", label: "Line", mono: true },
        { key: "kategori", label: "Kategori", filter: true },
        { key: "deskripsi", label: "Deskripsi", truncate: true },
        { key: "planned", label: "Planned", numeric: true, value: r => formatIDR(r.planned) },
        { key: "actual", label: "Actual", numeric: true, value: r => formatIDR(r.actual) },
        {
          key: "variance",
          label: "Variance",
          numeric: true,
          value: r => formatIDR(r.variance),
          chip: r => r.variance > 0 ? "danger" : r.variance < 0 ? "success" : "info",
        },
        { key: "pic", label: "PIC" },
        {
          key: "status",
          label: "Status",
          chip: r => r.status === "over" ? "danger" : r.status === "under" ? "warning" : "success",
        },
      ],
      rows: budgetLines,
      viewModes: ["list", "board"],
      groupBy: {
        key: "kategori",
        columns: ["Material", "Upah", "Overhead", "Marketing", "Legal", "Admin", "Maintenance", "IT"].map(k => ({
          id: k, label: k, match: v => v === k,
        })),
      },
      searchable: true,
      sortable: true,
      aggregation: {
        label: "Total Planned / Actual / Variance",
        fn: rs => `${formatIDR(rs.reduce((a, r) => a + r.planned, 0))} / ${formatIDR(rs.reduce((a, r) => a + r.actual, 0))} / ${formatIDR(rs.reduce((a, r) => a + r.variance, 0))}`,
      },
    }));
    container.appendChild(budgetSec);
  }

  // ============================================================
  // 14 — Audit Trail (latest 50 entries)
  // ============================================================
  const auditEntries = audit?.entries || [];
  if (auditEntries.length) {
    const auditSec = document.createElement("section");
    auditSec.className = "card bento-full";
    auditSec.appendChild(sectionLabel(9, "Audit Trail",
      `${auditEntries.length} entri · append-only log`));
    auditSec.appendChild(dataTable({
      columns: [
        { key: "timestamp", label: "Waktu", mono: true, value: r => r.timestamp.replace("T", " ").slice(0, 19) },
        { key: "actor", label: "Aktor" },
        { key: "action", label: "Action", chip: r => r.action === "approve" ? "success" : r.action === "reject" ? "danger" : "info" },
        { key: "target", label: "Target" },
        { key: "ref", label: "Ref", mono: true },
        { key: "ip", label: "IP", mono: true },
        { key: "device", label: "Device" },
      ],
      rows: auditEntries,
      viewModes: ["list"],
      searchable: true,
      sortable: true,
    }));
    container.appendChild(auditSec);
  }

  // Reveal motion choreography
  markForReveal(container);
  reveal(container);
}
