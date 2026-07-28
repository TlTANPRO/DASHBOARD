// views/media.js — Engagement trend, content calendar, type mix, top performing (Reni, Rifki, Reta).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./_partials.js";
import { getCurrentUser } from "../auth.js";
import { formatNumber, formatPercent } from "../lib/format.js";
import * as charts from "../charts/index.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = `
    <span class="section-label__index">06</span>
    <h1 style="margin-top:8px">Media</h1>
    <p style="color:var(--color-text-muted)">Majang Mejeng Media · konten · engagement · lead from content</p>
  `;

  const [divisi, personal] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
  ]);

  const medKpis = (divisi?.divisi || []).find(d => d.slug === "media")?.kpis || [];

  // 01 — Hero scorecards
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  medKpis.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator, value: k.actual || k.target, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const medRows = (personal?.rows || []).filter(k => k.divisi === "media");
  const missingEvidence = medRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Engagement Trend (two-third)
  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(2, "Engagement Trend", "IG Reels views 6 minggu"));
  const chartWrap = document.createElement("div");
  chartWrap.style.height = "220px";
  sec.appendChild(chartWrap);
  charts.line(chartWrap, {
    data: [
      { label: "W1", value: 1200 },
      { label: "W2", value: 2400 },
      { label: "W3", value: 3800 },
      { label: "W4", value: 10500 },
      { label: "W5", value: 8200 },
      { label: "W6", value: 12300 },
    ],
    height: 220,
  });
  container.appendChild(sec);

  // 03 — Engagement Gauge (third)
  const sec2 = document.createElement("section");
  sec2.className = "card bento-third";
  sec2.appendChild(sectionLabel(3, "Engagement Rate", "Target 3.0%"));
  const gaugeWrap = document.createElement("div");
  gaugeWrap.style.display = "flex";
  gaugeWrap.style.justifyContent = "center";
  gaugeWrap.style.padding = "16px 0";
  sec2.appendChild(gaugeWrap);
  charts.gauge(gaugeWrap, { value: 3.4, target: 3.0, min: 0, max: 5, size: 160 });
  container.appendChild(sec2);

  // 04 — Content Calendar (full)
  const calendar = [
    { tanggal: "2026-07-06", topik: "Reel tour rumah contoh",      jenis: "Reel",     platform: "IG",     pic: "Rifki", status: "Posted",  views: 8400,  engagement_pct: 4.2 },
    { tanggal: "2026-07-07", topik: "Carousel 5 tips KPR",          jenis: "Carousel", platform: "IG",     pic: "Reta",  status: "Posted",  views: 3200,  engagement_pct: 3.8 },
    { tanggal: "2026-07-08", topik: "Behind the scene renovasi",    jenis: "Story",    platform: "IG",     pic: "Rifki", status: "Posted",  views: 1800,  engagement_pct: 5.1 },
    { tanggal: "2026-07-10", topik: "Post promo akhir bulan",       jenis: "Post",     platform: "FB",     pic: "Reni",  status: "Posted",  views: 2400,  engagement_pct: 2.1 },
    { tanggal: "2026-07-12", topik: "Reel testimoni konsumen",      jenis: "Reel",     platform: "TikTok", pic: "Rifki", status: "Viral",   views: 15200, engagement_pct: 7.3 },
    { tanggal: "2026-07-14", topik: "Article: Investasi properti",  jenis: "Article",  platform: "Web",    pic: "Reta",  status: "Posted",  views: 950,   engagement_pct: 2.8 },
    { tanggal: "2026-07-16", topik: "Carousel progress Cluster B",  jenis: "Carousel", platform: "IG",     pic: "Reta",  status: "Posted",  views: 4100,  engagement_pct: 3.4 },
    { tanggal: "2026-07-18", topik: "Story Q&A dengan Mada",        jenis: "Story",    platform: "IG",     pic: "Reni",  status: "Posted",  views: 2100,  engagement_pct: 4.6 },
    { tanggal: "2026-07-20", topik: "Reel drone shot Cluster A",    jenis: "Reel",     platform: "TikTok", pic: "Rifki", status: "Viral",   views: 12400, engagement_pct: 6.8 },
    { tanggal: "2026-07-22", topik: "Post edukasi KPR untuk Gen Z", jenis: "Post",     platform: "IG",     pic: "Reta",  status: "Posted",  views: 3800,  engagement_pct: 4.0 },
    { tanggal: "2026-07-24", topik: "Reel tips pilih lokasi rumah", jenis: "Reel",     platform: "IG",     pic: "Rifki", status: "Posted",  views: 6700,  engagement_pct: 4.9 },
    { tanggal: "2026-07-26", topik: "Carousel promo FLPP 2026",     jenis: "Carousel", platform: "FB",     pic: "Reni",  status: "Posted",  views: 2900,  engagement_pct: 3.2 },
    { tanggal: "2026-07-28", topik: "Reel tour rumah contoh",      jenis: "Reel",     platform: "IG",     pic: "Rifki", status: "Scheduled", views: 0,  engagement_pct: 0 },
    { tanggal: "2026-07-29", topik: "Carousel 5 tips KPR",          jenis: "Carousel", platform: "IG",     pic: "Reta",  status: "Scheduled", views: 0,  engagement_pct: 0 },
    { tanggal: "2026-07-30", topik: "Story behind the scene",      jenis: "Story",    platform: "IG",     pic: "Rifki", status: "Draft",  views: 0,    engagement_pct: 0 },
    { tanggal: "2026-08-01", topik: "Post promo akhir bulan",       jenis: "Post",     platform: "FB",     pic: "Reni",  status: "Draft",  views: 0,    engagement_pct: 0 },
    { tanggal: "2026-08-02", topik: "Reel testimoni konsumen",      jenis: "Reel",     platform: "TikTok", pic: "Rifki", status: "Draft",  views: 0,    engagement_pct: 0 },
    { tanggal: "2026-08-05", topik: "Article: tren properti 2027",  jenis: "Article",  platform: "Web",    pic: "Reta",  status: "Draft",  views: 0,    engagement_pct: 0 },
  ];

  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "Content Calendar", "18 konten · 3 minggu"));
  sec3.appendChild(dataTable({
    columns: [
      { key: "tanggal", label: "Tanggal", calendarDate: true },
      { key: "topik",   label: "Topik" },
      { key: "jenis",   label: "Jenis", filter: true, filterLabel: "Semua jenis" },
      { key: "platform", label: "Platform", filter: true, filterLabel: "Semua platform" },
      { key: "pic",     label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "status",  label: "Status", chip: r => r.status === "Viral" ? "accent" : r.status === "Posted" ? "success" : r.status === "Scheduled" ? "info" : "warning" },
      { key: "views",   label: "Views", numeric: true, value: r => formatNumber(r.views) },
      { key: "engagement_pct", label: "Eng %", numeric: true, chip: r => r.engagement_pct >= 5 ? "success" : r.engagement_pct >= 3 ? "warning" : r.engagement_pct > 0 ? "danger" : null },
    ],
    rows: calendar,
    viewModes: ["list", "board", "calendar"],
    groupBy: { key: "status", columns: [
      { id: "Draft",     label: "Draft",     match: v => v === "Draft" },
      { id: "Scheduled", label: "Scheduled", match: v => v === "Scheduled" },
      { id: "Posted",    label: "Posted",    match: v => v === "Posted" },
      { id: "Viral",     label: "Viral",     match: v => v === "Viral" },
    ]},
    editable: true,
    onEdit: async () => { toast("Konten diupdate", "info"); },
    bulkActions: [
      { label: "Tandai Posted", kind: "success", onClick: sel => toast(`${sel.length} ditandai posted`, "success") },
      { label: "Tandai Viral",  kind: "accent",  onClick: sel => toast(`${sel.length} ditandai viral`, "success") },
    ],
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "content-calendar",
    calendarDate: "tanggal",
    aggregation: {
      label: "Posted / Total Views / Avg Eng",
      fn: rows => {
        const posted = rows.filter(r => r.status === "Posted" || r.status === "Viral");
        const sumViews = posted.reduce((a, r) => a + (+r.views || 0), 0);
        const avgEng = posted.length ? posted.reduce((a, r) => a + (+r.engagement_pct || 0), 0) / posted.length : 0;
        return `${posted.length} / ${formatNumber(sumViews)} / ${formatPercent(avgEng)}`;
      }
    },
  }));
  container.appendChild(sec3);

  // 05 — Content Type Mix (two-third)
  const sec4 = document.createElement("section");
  sec4.className = "card bento-two-third";
  sec4.appendChild(sectionLabel(5, "Content Type Mix", "Distribusi jenis konten"));
  const donutWrap = document.createElement("div");
  donutWrap.style.display = "flex";
  donutWrap.style.justifyContent = "center";
  donutWrap.style.padding = "16px 0";
  sec4.appendChild(donutWrap);
  charts.donut(donutWrap, {
    segments: [
      { label: "Reel",     value: 40 },
      { label: "Carousel", value: 25 },
      { label: "Story",    value: 15 },
      { label: "Post",     value: 12 },
      { label: "Article",  value: 8 },
    ],
    size: 200,
  });
  container.appendChild(sec4);

  // 06 — Top Performing (third)
  const top5 = [...calendar].filter(c => c.views > 0).sort((a, b) => b.views - a.views).slice(0, 5);
  const sec5 = document.createElement("section");
  sec5.className = "card bento-third";
  sec5.appendChild(sectionLabel(6, "Top Performing", "Top 5 by views"));
  const topWrap = document.createElement("ol");
  topWrap.style.listStyle = "none";
  topWrap.style.padding = "0";
  topWrap.style.margin = "0";
  topWrap.style.counterReset = "rank";
  for (let i = 0; i < top5.length; i++) {
    const c = top5[i];
    const li = document.createElement("li");
    li.style.padding = "8px 0";
    li.style.borderBottom = "1px solid var(--color-border)";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.gap = "8px";
    const engKind = c.engagement_pct >= 5 ? "success" : c.engagement_pct >= 3 ? "warning" : "danger";
    li.innerHTML = `<div style="flex:1;min-width:0"><div style="font-weight:500;font-size:var(--text-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i + 1}. ${c.topik}</div><div style="font-size:var(--text-xs);color:var(--color-text-muted)">${c.pic} · ${c.platform}</div></div><div style="text-align:right"><div class="num" style="font-weight:600">${formatNumber(c.views)}</div><span class="chip chip--${engKind}" style="font-size:10px">${c.engagement_pct}%</span></div>`;
    topWrap.appendChild(li);
  }
  sec5.appendChild(topWrap);
  container.appendChild(sec5);

  // 07 — KPI Media Personal (full)
  const sec6 = document.createElement("section");
  sec6.className = "card bento-full";
  sec6.appendChild(sectionLabel(7, "KPI Media Personal", "Reni · Rifki · Reta · BAB 7"));
  sec6.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: true, filter: true, filterLabel: "Semua PIC" },
      { key: "kpi", label: "KPI" },
      { key: "target", label: "Target" },
      { key: "actual", label: "Actual", chip: r => r.actual ? "success" : "warning" },
      { key: "evidence", label: "Evidence", chip: r => r.evidence ? "success" : "danger" },
    ],
    rows: medRows,
    viewModes: ["list", "board"],
    groupBy: { key: "pic", columns: [
      { id: "Reni",  label: "Reni",  match: v => v === "Reni" },
      { id: "Rifki", label: "Rifki", match: v => v === "Rifki" },
      { id: "Reta",  label: "Reta",  match: v => v === "Reta" },
    ]},
    evidenceRequired: true,
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Update tersimpan (mock)", "success"); },
    searchable: true,
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec6);
}
