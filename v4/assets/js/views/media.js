// views/media.js — Engagement trend, content calendar, type mix, top performing (Reni, Rifki, Reta).

import { fetchData } from "../ssot.js";
import { kpiCard, sectionLabel, dataTable, evidenceBanner, toast } from "./partials.js";
import { getCurrentUser } from "../auth.js";
import { formatNumber, formatPercent, formatIDR, formatDate } from "../lib/format.js";
import { lineChart, gaugeChart, donutChart } from "../lib/charts.js";
import { h } from "../lib/dom.js";
import { reveal, markForReveal } from "../lib/reveal.js";

export async function render({ container }) {
  container.innerHTML = "";
  const hero = document.querySelector("#divisi-hero");
  hero.innerHTML = "";
  hero.appendChild(h("span", { class: "section-label__index" }, "06"));
  hero.appendChild(h("h1", { style: { marginTop: "8px" } }, "Media"));
  hero.appendChild(h("p", { class: "u-text-muted" }, "Majang Mejeng Media · konten · engagement · lead from content"));

  const [divisi, personal, contentData, vendorsData] = await Promise.all([
    fetchData("kpi-divisi.json"),
    fetchData("kpi-personal.json"),
    fetchData("content.json"),
    fetchData("vendors.json"),
  ]);

  const medKpis = (divisi?.divisi || []).find(d => d.slug === "media")?.kpis || [];
  const posts = contentData?.posts || [];
  const mediaVendors = (vendorsData?.vendors || []).filter(v => v.kategori === "Jasa");

  // Aggregate metrics
  const totalReach = posts.reduce((a, p) => a + p.reach, 0);
  const totalEng = posts.reduce((a, p) => a + p.engagement, 0);
  const totalLeads = posts.reduce((a, p) => a + p.leads_generated, 0);
  const totalCost = posts.reduce((a, p) => a + p.cost_idr, 0);
  const avgEng = totalReach ? (totalEng / totalReach) * 100 : 0;

  // Trend data: group by week
  const trend = [];
  for (let w = 0; w < 12; w++) {
    const weekStart = new Date("2026-07-29");
    weekStart.setDate(weekStart.getDate() - (w * 7));
    const weekPosts = posts.filter(p => {
      const pd = new Date(p.date);
      return pd <= weekStart && pd > new Date(weekStart.getTime() - 7 * 86400000);
    });
    trend.push({ label: `W${12 - w}`, value: weekPosts.reduce((a, p) => a + p.reach, 0) });
  }
  trend.reverse();

  const heroCards = medKpis.length ? medKpis.slice(0, 4) : [
    { indikator: "Total Posts", target: `${posts.length}`, actual: `${posts.length}` },
    { indikator: "Total Reach", target: formatNumber(totalReach), actual: formatNumber(totalReach) },
    { indikator: "Leads from Content", target: `${totalLeads}`, actual: `${totalLeads}` },
    { indikator: "Avg Engagement", target: formatPercent(avgEng), actual: formatPercent(avgEng) },
  ];
  const scorecards = document.createElement("div");
  scorecards.className = "bento-quad";
  heroCards.forEach((k, i) => scorecards.appendChild(kpiCard({
    label: k.indikator || k.label, value: k.actual || k.value, target: k.target, accent: i === 0,
  })));
  container.appendChild(scorecards);

  // Evidence banner
  const medRows = (personal?.rows || []).filter(k => ["Reni", "Rifki", "Reta"].includes(k.pic));
  const missingEvidence = medRows.filter(k => !k.evidence).length;
  const banner = evidenceBanner(missingEvidence);
  if (banner) { banner.style.position = "static"; banner.style.transform = "none"; banner.style.display = "inline-block"; banner.style.margin = "16px 0"; container.appendChild(banner); }

  // 02 — Engagement Trend (two-third) — REAL weekly trend from posts.json
  const sec = document.createElement("section");
  sec.className = "card bento-two-third";
  sec.appendChild(sectionLabel(2, "Reach Trend", "12 minggu · 3 channel"));
  const chartWrap = document.createElement("div");
  chartWrap.className = "u-flex u-justify-end u-mt-3";
  sec.appendChild(chartWrap);
  chartWrap.appendChild(lineChart({ data: trend, height: 220, color: 1 }));
  container.appendChild(sec);

  // 03 — Engagement Gauge (third) — derived real value
  const sec2 = document.createElement("section");
  sec2.className = "card bento-third";
  sec2.appendChild(sectionLabel(3, "Engagement Rate", `Target 3.0%`));
  const gaugeWrap = document.createElement("div");
  gaugeWrap.className = "u-flex u-justify-end u-p-4";
  sec2.appendChild(gaugeWrap);
  gaugeWrap.appendChild(gaugeChart({ value: parseFloat(avgEng.toFixed(1)), max: 10, color: 3, size: 160, label: "Avg %" }));
  container.appendChild(sec2);

  // 04 — Content Calendar (full) — REAL posts from content.json
  const postRows = posts.map(p => ({
    id: p.id,
    tanggal: p.date,
    topik: p.topic,
    jenis: p.type,
    platform: p.channel,
    pic: p.owner,
    status: p.leads_generated >= 5 ? "Viral" : p.reach >= 5000 ? "Posted" : "Posted",
    views: p.reach,
    engagement_pct: p.engagement_rate,
    leads: p.leads_generated,
    cost: p.cost_idr,
    utm: p.utm,
    url: p.url,
  }));

  const sec3 = document.createElement("section");
  sec3.className = "card bento-full";
  sec3.appendChild(sectionLabel(4, "Content Calendar", `${posts.length} posts · 90 hari · 3 channel`));
  sec3.appendChild(dataTable({
    columns: [
      { key: "tanggal", label: "Tanggal", mono: true, value: r => formatDate(r.tanggal) },
      { key: "topik",   label: "Topik" },
      { key: "jenis",   label: "Jenis", filter: true },
      { key: "platform", label: "Platform", filter: true, chip: r => ({
        Instagram: "info", Facebook: "info", TikTok: "warning", Web: "success",
      }[r.platform] || "info") },
      { key: "pic",     label: "PIC", filter: true },
      { key: "views",   label: "Reach", numeric: true, value: r => formatNumber(r.views) },
      { key: "engagement_pct", label: "Eng %", numeric: true, chip: r => r.engagement_pct >= 5 ? "success" : r.engagement_pct >= 3 ? "info" : r.engagement_pct >= 1 ? "warning" : "danger" },
      { key: "leads", label: "Leads", numeric: true, chip: r => r.leads >= 5 ? "success" : r.leads >= 1 ? "info" : "warning" },
      { key: "cost", label: "Cost", numeric: true, value: r => formatIDR(r.cost) },
      { key: "status", label: "Status", chip: r => r.status === "Viral" ? "accent" : "success" },
    ],
    rows: postRows,
    viewModes: ["list", "board", "calendar"],
    groupBy: { key: "platform", columns: [
      { id: "Instagram", label: "Instagram", match: v => v === "Instagram" },
      { id: "Facebook", label: "Facebook", match: v => v === "Facebook" },
      { id: "TikTok", label: "TikTok", match: v => v === "TikTok" },
    ]},
    editable: getCurrentUser()?.is_owner === true,
    onEdit: async () => { toast("Konten diupdate", "info"); },
    bulkActions: [
      { label: "Tandai Viral", kind: "success", onClick: sel => toast(`${sel.length} ditandai viral`, "success") },
    ],
    searchable: true,
    sortable: true,
    exportable: true,
    exportName: "content-calendar",
    calendarDate: "tanggal",
    aggregation: {
      label: "Posts / Total Reach / Leads / Cost",
      fn: rs => `${rs.length} / ${formatNumber(rs.reduce((a, r) => a + r.views, 0))} / ${rs.reduce((a, r) => a + r.leads, 0)} / ${formatIDR(rs.reduce((a, r) => a + r.cost, 0))}`,
    },
  }));
  container.appendChild(sec3);

  // 05 — Channel Performance Comparison (two-third) — derived
  const channelMix = posts.reduce((acc, p) => {
    const ch = p.channel;
    if (!acc[ch]) acc[ch] = { reach: 0, eng: 0, leads: 0, posts: 0 };
    acc[ch].reach += p.reach;
    acc[ch].eng += p.engagement;
    acc[ch].leads += p.leads_generated;
    acc[ch].posts += 1;
    return acc;
  }, {});

  const sec4 = document.createElement("section");
  sec4.className = "card bento-two-third";
  sec4.appendChild(sectionLabel(5, "Channel Performance", `${Object.keys(channelMix).length} channel · 90 hari`));
  const channelRows = Object.entries(channelMix).map(([ch, s]) => ({
    channel: ch,
    posts: s.posts,
    reach: s.reach,
    engagement: s.eng,
    engagement_rate: s.reach ? (s.eng / s.reach * 100) : 0,
    leads: s.leads,
    cost_per_lead: s.leads ? Math.round(posts.filter(p => p.channel === ch).reduce((a, p) => a + p.cost_idr, 0) / s.leads) : 0,
  }));
  sec4.appendChild(dataTable({
    columns: [
      { key: "channel", label: "Channel" },
      { key: "posts", label: "Posts", numeric: true },
      { key: "reach", label: "Reach", numeric: true, value: r => formatNumber(r.reach) },
      { key: "engagement", label: "Engagement", numeric: true, value: r => formatNumber(r.engagement) },
      { key: "engagement_rate", label: "Eng Rate", numeric: true, value: r => `${r.engagement_rate.toFixed(1)}%`, chip: r => r.engagement_rate >= 5 ? "success" : r.engagement_rate >= 3 ? "info" : "warning" },
      { key: "leads", label: "Leads", numeric: true },
      { key: "cost_per_lead", label: "Cost/Lead", numeric: true, value: r => formatIDR(r.cost_per_lead) },
    ],
    rows: channelRows,
    viewModes: ["list"],
    searchable: true,
    sortable: true,
    aggregation: {
      label: "Total reach / engagement / leads",
      fn: rs => `${formatNumber(rs.reduce((a, r) => a + r.reach, 0))} / ${formatNumber(rs.reduce((a, r) => a + r.engagement, 0))} / ${rs.reduce((a, r) => a + r.leads, 0)}`,
    },
  }));
  container.appendChild(sec4);

  // 06 — Top Performing (third) — derived from posts
  const top5 = [...postRows].sort((a, b) => b.views - a.views).slice(0, 5);
  const sec5 = document.createElement("section");
  sec5.className = "card bento-third";
  sec5.appendChild(sectionLabel(6, "Top Performing", "Top 5 by reach"));
  const topList = document.createElement("div");
  topList.className = "u-flex-col u-gap-3 u-mt-3";
  for (let i = 0; i < top5.length; i++) {
    const c = top5[i];
    const row = document.createElement("div");
    row.className = "u-flex-row u-justify-between u-align-center u-gap-3";
    row.classList.add("rank-row");
    const medalClass = i === 0 ? "rank-badge--gold" : i === 1 ? "rank-badge--silver" : i === 2 ? "rank-badge--bronze" : "";
    row.appendChild(h("span", { class: `rank-badge ${medalClass}` }, i < 9 ? `0${i + 1}` : `${i + 1}`));
    const middle = document.createElement("div");
    middle.className = "u-flex-col u-gap-1";
    middle.appendChild(h("strong", { class: "u-text-sm" }, c.topik));
    middle.appendChild(h("span", { class: "rank-row__sub" }, `${c.pic} · ${c.platform} · ${formatDate(c.tanggal)}`));
    row.appendChild(middle);
    const right = document.createElement("div");
    right.className = "u-flex-col u-gap-1 u-text-right";
    right.appendChild(h("strong", { class: "u-mono" }, formatNumber(c.views)));
    right.appendChild(h("span", { class: `chip chip--${c.engagement_pct >= 5 ? "success" : c.engagement_pct >= 3 ? "info" : "warning"}` }, `${c.engagement_pct.toFixed(1)}%`));
    row.appendChild(right);
    topList.appendChild(row);
  }
  sec5.appendChild(topList);
  container.appendChild(sec5);

  // 07 — KPI Media Personal (full)
  const sec6 = document.createElement("section");
  sec6.className = "card bento-full";
  sec6.appendChild(sectionLabel(7, "KPI Media Personal", "Reni · Rifki · Reta · BAB 7"));
  sec6.appendChild(dataTable({
    columns: [
      { key: "pic", label: "PIC", avatar: "pic", filter: true, filterLabel: "Semua PIC" },
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
    onEdit: async () => { toast("Update tersimpan", "success"); },
    searchable: true,
    aggregation: {
      label: "Total / Tercapai / %",
      fn: rows => `${rows.length} / ${rows.filter(r => r.actual).length} / ${formatPercent(rows.filter(r => r.actual).length / (rows.length || 1) * 100)}`
    },
  }));
  container.appendChild(sec6);
  markForReveal(container);
  reveal(container);
}
