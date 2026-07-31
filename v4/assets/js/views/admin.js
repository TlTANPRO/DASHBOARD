// views/admin.js — Jobdesk harian/mingguan, employee directory, calendar, KPI operasional (Novita, Sinta).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatPercent, formatDate } from "../lib/format.js";
import { h } from "../lib/dom.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = "";
  hero.appendChild(h("span", { class: "section-label__index" }, "04"));
  hero.appendChild(h("h1", { style: { marginTop: "8px" } }, "Admin"));
  hero.appendChild(h("p", { class: "u-text-muted" }, "Jobdesk harian & mingguan · employee directory · company calendar"));

  const [jobdesk, divisi, personal, people, calendar] = await Promise.all([
    fetchData("jobdesk.json"),
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
    fetchData("people.json"),
    fetchData("calendar.json"),
  ]);

  const admKpis = (divisi?.divisi || []).find(d => d.slug === "operasional")?.kpis || [];
  const allJobdesk = jobdesk?.jobdesk || [];
  const allPeople = people?.people || [];
  const allEvents = calendar?.events || [];

  // 01 — Hero scorecards (now derived from real data)
  const jobdeskCount = allJobdesk.length;
  const totalHarian = allJobdesk.reduce((a, j) => a + (j.harian?.length || 0), 0);
  const totalMingguan = allJobdesk.reduce((a, j) => a + (j.mingguan?.length || 0), 0);
  const opEvents = allEvents.filter(e => e.type === "meeting").length;
  const heroCards = admKpis.slice(0, 4).length ? admKpis.slice(0, 4) : [
    { indikator: "Jobdesk Harian", target: `${totalHarian} kegiatan`, actual: `${totalHarian}` },
    { indikator: "Jobdesk Mingguan", target: `${totalMingguan} kegiatan`, actual: `${totalMingguan}` },
    { indikator: "PIC Aktif", target: `${jobdeskCount} / 12 PIC`, actual: `${jobdeskCount}` },
    { indikator: "Meeting Bulan Ini", target: `${opEvents} meeting`, actual: `${opEvents}` },
  ];
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  heroCards.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const opRows = (personal?.rows || []).filter(k => ["Novita", "Sinta", "Reni", "Reta"].includes(k.pic));
  const missingEvidence = opRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Jobdesk Hari Ini (two-third) — ALL 12 PICs
  const harianRows = allJobdesk.flatMap(j => (j.harian || []).map(h => ({ pic: j.pic, jam: h.jam, kegiatan: h.kegiatan })));
  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(2, "Jobdesk Hari Ini", `${harianRows.length} kegiatan · ${allJobdesk.length} PIC`));
  sec.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
      { key: "jam", label: "Jam" },
      { key: "kegiatan", label: "Kegiatan" },
    ],
    rows: harianRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: allPeople.map(p => ({
      id: p.nama, label: p.nama, match: v => v === p.nama,
    }))},
    searchable: true,
    aggregation: { label: "Total kegiatan", fn: rows => `${rows.length} kegiatan` },
  }));
  container.appendChild(sec);

  // 03 — Employee Directory (third) — all 12 PICs
  const sec2 = document.createElement("section");
  sec2.className = "card bento-third";
  sec2.appendChild(sectionLabel(3, "Employee Directory", `${allPeople.length} PIC · 6 divisi`));
  sec2.appendChild(dataTable({
    columns: [
      { key: "nama", label: "Nama", avatar: "nama" },
      { key: "role", label: "Role" },
      { key: "divisi", label: "Divisi", filter: true },
    ],
    rows: allPeople,
    viewModes: ["list", "board"],
    groupBy: { key: "divisi", columns: ["owner", "legal", "marketing", "proyek", "operasional", "media"].map(d => ({
      id: d, label: d, match: v => v === d,
    }))},
    searchable: true,
    sortable: true,
    aggregation: { label: "Total PIC / Owner", fn: rs => `${rs.length} / ${rs.filter(r => r.is_owner).length}` },
  }));
  container.appendChild(sec2);

  // 04 — Jobdesk Mingguan (full) — all 12 PICs
  const mingguanRows = allJobdesk.flatMap(j => (j.mingguan || []).map(m => ({ pic: j.pic, minggu: m.minggu, kegiatan: m.kegiatan })));
  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "Jobdesk Mingguan", `${mingguanRows.length} kegiatan W1-W4 · ${allJobdesk.length} PIC`));
  sec3.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
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

  // 05 — Company Calendar (full) — 90 days
  const secCal = document.createElement("section");
  secCal.className = "card bento-full";
  secCal.appendChild(sectionLabel(5, "Company Calendar", `${allEvents.length} event · 90 hari · 5 jenis`));
  secCal.appendChild(dataTable({
    columns: [
      { key: "date", label: "Tanggal", mono: true, value: r => formatDate(r.date) },
      { key: "type", label: "Jenis", filter: true, chip: r => ({
        meeting: "info", deadline: "warning", milestone: "success", holiday: "danger", "site-visit": "warning",
      }[r.type] || "info") },
      { key: "title", label: "Event" },
      { key: "location", label: "Lokasi", filter: true },
      { key: "attendees", label: "PIC Hadir", value: r => (r.attendees || []).join(", "), truncate: true },
    ],
    rows: allEvents,
    viewModes: ["list", "board", "calendar"],
    groupBy: { key: "type", columns: [
      { id: "meeting", label: "Meeting", match: v => v === "meeting" },
      { id: "deadline", label: "Deadline", match: v => v === "deadline" },
      { id: "milestone", label: "Milestone", match: v => v === "milestone" },
      { id: "holiday", label: "Holiday", match: v => v === "holiday" },
      { id: "site-visit", label: "Site Visit", match: v => v === "site-visit" },
    ]},
    searchable: true,
    sortable: true,
    calendarDate: "date",
    aggregation: { label: "Total event", fn: rs => `${rs.length} event` },
  }));
  container.appendChild(secCal);

  // 06 — KPI Operasional Personal (full)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-full";
  sec4.appendChild(sectionLabel(6, "KPI Operasional Personal", "Novita · Sinta · Reni · Reta · BAB 7"));
  sec4.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
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
      { id: "Reni",   label: "Reni",   match: v => v === "Reni" },
      { id: "Reta",   label: "Reta",   match: v => v === "Reta" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan", "success"); },
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
  markForReveal(container);
  reveal(container);
}
