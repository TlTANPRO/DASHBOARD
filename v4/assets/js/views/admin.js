// views/admin.js — Jobdesk harian/mingguan, SP3K tracker, KPI operasional (Novita, Sinta).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, kanbanBoard, evidenceBanner, toast } from "./_partials.js";
import { getCurrentUser } from "../auth.js";
import { formatPercent } from "../lib/format.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = `
    <span class="section-label__index">04</span>
    <h1 style="margin-top:8px">Admin</h1>
    <p style="color:var(--color-text-muted)">Jobdesk harian & mingguan · pemberkasan · SP3K tracker</p>
  `;

  const [jobdesk, divisi, personal] = await Promise.all([
    fetchData("jobdesk.json"),
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
  ]);

  const admKpis = (divisi?.divisi || []).find(d => d.slug === "operasional")?.kpis || [];

  // 01 — Hero scorecards
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  admKpis.slice(0, 4).forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const opRows = (personal?.rows || []).filter(k => k.divisi === "operasional");
  const missingEvidence = opRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Jobdesk Hari Ini (two-third)
  const harianRows = (jobdesk?.jobdesk || []).flatMap(j => j.harian.map(h => ({ pic: j.pic, jam: h.jam, kegiatan: h.kegiatan })));
  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(2, "Jobdesk Hari Ini", `${harianRows.length} kegiatan`));
  sec.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "jam", label: "Jam" },
      { key: "kegiatan", label: "Kegiatan" },
    ],
    rows: harianRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: [
      { id: "Pak Ardian", label: "Pak Ardian", match: v => v === "Pak Ardian" },
      { id: "Mada", label: "Mada", match: v => v === "Mada" },
      { id: "Riza", label: "Riza", match: v => v === "Riza" },
    ]},
    searchable: true,
    aggregation: { label: "Total kegiatan", fn: rows => `${rows.length} kegiatan` },
  }));
  container.appendChild(sec);

  // 03 — Overdue Kanban (third)
  const sec2 = document.createElement("section");
  sec2.className = "card bento-third";
  sec2.appendChild(sectionLabel(3, "Status Jobdesk", "Todo · In Progress · Done · Overdue"));
  sec2.appendChild(kanbanBoard({
    columns: [
      { id: "todo",        label: "Belum" },
      { id: "in_progress", label: "Proses" },
      { id: "done",        label: "Selesai" },
      { id: "overdue",     label: "Overdue" },
    ],
    cards: {
      todo: [
        { title: "Pemberkasan konsumen baru", meta: "Novita · 2 hari lagi" },
        { title: "Stock opname mingguan",     meta: "Sinta · besok" },
      ],
      in_progress: [
        { title: "SP3K follow up bank BNI", meta: "Novita · 3 hari lagi" },
        { title: "PO semen 200 sak",        meta: "Sinta · besok" },
      ],
      done: [
        { title: "Rekonsiliasi bank BCA", meta: "Novita · done" },
        { title: "PO besi 10mm 2 ton",     meta: "Sinta · done" },
      ],
      overdue: [
        { title: "Material telat 3 hari", meta: "Sinta · ⚠ 3d" },
        { title: "SP3K submit telat",     meta: "Novita · ⚠ 1d" },
      ],
    },
  }));
  container.appendChild(sec2);

  // 04 — Jobdesk Mingguan (full)
  const mingguanRows = (jobdesk?.jobdesk || []).flatMap(j => j.mingguan.map(m => ({ pic: j.pic, minggu: m.minggu, kegiatan: m.kegiatan })));
  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "Jobdesk Mingguan", `${mingguanRows.length} kegiatan W1-W4`));
  sec3.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "minggu", label: "Minggu", filter: true, filterLabel: "Semua minggu" },
      { key: "kegiatan", label: "Kegiatan" },
    ],
    rows: mingguanRows,
    viewModes: ["list", "board"],
    groupBy: { key: "minggu", columns: [
      { id: "W1", label: "Week 1", match: v => v === "W1" },
      { id: "W2", label: "Week 2", match: v => v === "W2" },
      { id: "W3", label: "Week 3", match: v => v === "W3" },
      { id: "W4", label: "Week 4", match: v => v === "W4" },
    ]},
    searchable: true,
    aggregation: { label: "Total minggu", fn: rows => `${rows.length} kegiatan` },
  }));
  container.appendChild(sec3);

  // 05 — KPI Operasional Personal (full)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(5, "KPI Operasional Personal", "Novita · Sinta · BAB 7"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "kpi", label: "KPI" },
      { key: "target", label: "Target" },
      { key: "actual", label: "Actual", chip: r => r.actual ? "success" : "warning" },
      { key: "evidence", label: "Evidence", chip: r => r.evidence ? "success" : "danger" },
    ],
    rows: opRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: [
      { id: "Novita", label: "Novita", match: v => v === "Novita" },
      { id: "Sinta",  label: "Sinta",  match: v => v === "Sinta" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan (mock)", "success"); },
    bulkActions: [
      { label: "Tandai Selesai", kind: "success", onClick: sel => toast(`${sel.length} ditandai selesai`, "success") },
    ],
    searchable: true,
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec4);

  // 06 — SP3K Tracker (full)
  const sp3k = [
    { nama: "Budi Santoso",  bank: "BCA",     stage: "Pemberkasan",  tanggal_submit: "2026-07-15", due_date: "2026-07-29", status: "on-track" },
    { nama: "Siti Aminah",   bank: "BNI",     stage: "Submit SP3K",  tanggal_submit: "2026-07-18", due_date: "2026-08-01", status: "on-track" },
    { nama: "Andi Wijaya",   bank: "Mandiri", stage: "Analis Bank",  tanggal_submit: "2026-07-10", due_date: "2026-07-24", status: "delayed" },
    { nama: "Dewi Lestari",  bank: "BRI",     stage: "Survey Bank",  tanggal_submit: "2026-07-20", due_date: "2026-08-03", status: "on-track" },
    { nama: "Rian Hidayat",  bank: "BCA",     stage: "Approval",     tanggal_submit: "2026-07-12", due_date: "2026-07-26", status: "delayed" },
    { nama: "Maya Sari",     bank: "BNI",     stage: "Akad",         tanggal_submit: "2026-07-08", due_date: "2026-07-22", status: "done" },
    { nama: "Hendra",        bank: "Mandiri", stage: "Submit SP3K",  tanggal_submit: "2026-07-22", due_date: "2026-08-05", status: "on-track" },
    { nama: "Lina Marlina",  bank: "BRI",     stage: "Pemberkasan",  tanggal_submit: "2026-07-25", due_date: "2026-08-08", status: "on-track" },
    { nama: "Yusuf",         bank: "BCA",     stage: "Akad",         tanggal_submit: "2026-07-05", due_date: "2026-07-19", status: "done" },
    { nama: "Rina Wati",     bank: "BNI",     stage: "Analis Bank",  tanggal_submit: "2026-07-21", due_date: "2026-08-04", status: "on-track" },
  ];

  const sec5 = document.createElement("section");
  sec5.className = "card bento-full";
  sec5.appendChild(sectionLabel(6, "SP3K Tracker", "10 konsumen aktif · 4 bank"));
  sec5.appendChild(dataTable({
    columns: [
      { key: "nama", label: "Konsumen" },
      { key: "bank", label: "Bank", filter: true, filterLabel: "Semua bank" },
      { key: "stage", label: "Stage", chip: r => r.stage === "Akad" ? "success" : r.stage === "Approval" ? "info" : r.stage === "Submit SP3K" ? "info" : "warning" },
      { key: "tanggal_submit", label: "Tgl Submit" },
      { key: "due_date", label: "Due", chip: r => r.status === "delayed" ? "danger" : null },
      { key: "status", label: "Status", chip: r => r.status === "done" ? "success" : r.status === "delayed" ? "danger" : "info" },
    ],
    rows: sp3k,
    viewModes: ["list", "board", "calendar"],
    groupBy: { key: "stage", columns: [
      { id: "Pemberkasan", label: "Pemberkasan", match: v => v === "Pemberkasan" },
      { id: "Submit SP3K", label: "Submit SP3K", match: v => v === "Submit SP3K" },
      { id: "Analis Bank", label: "Analis Bank", match: v => v === "Analis Bank" },
      { id: "Survey Bank", label: "Survey Bank", match: v => v === "Survey Bank" },
      { id: "Approval", label: "Approval", match: v => v === "Approval" },
      { id: "Akad", label: "Akad", match: v => v === "Akad" },
    ]},
    editable: true,
    onEdit: async () => { toast("SP3K stage diupdate", "info"); },
    searchable: true,
    exportable: true,
    exportName: "sp3k-tracker",
    calendarDate: "tanggal_submit",
    aggregation: { label: "Total / Done / Delayed", fn: rows => `${rows.length} / ${rows.filter(r => r.status === "done").length} / ${rows.filter(r => r.status === "delayed").length}` },
  }));
  container.appendChild(sec5);
}
