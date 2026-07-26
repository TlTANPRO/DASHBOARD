// components/gantt.js — horizontal bars per program/job

import { escapeHTML, fmtDate } from "../lib/format.js";

export function ganttView({ rows, startField, endField, titleField, picField = "PIC", progressField = null }) {
  if (!rows || rows.length === 0) {
    return '<div class="empty">Tidak ada data untuk timeline</div>';
  }

  // Compute range
  let minDate = null;
  let maxDate = null;
  rows.forEach((r) => {
    const s = r[startField];
    const e = r[endField];
    if (!s || !e) return;
    if (!minDate || s < minDate) minDate = s;
    if (!maxDate || e > maxDate) maxDate = e;
  });
  if (!minDate || !maxDate) {
    return '<div class="empty">Tanggal mulai & deadline belum diisi</div>';
  }

  const startMs = new Date(minDate).getTime();
  const endMs = new Date(maxDate).getTime();
  const totalMs = endMs - startMs || 1;
  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  const pxPerDay = Math.max(2, Math.min(20, 800 / totalDays));

  const header = `
    <div class="gantt-header" style="grid-template-columns:200px 1fr;gap:var(--space-3);padding-bottom:var(--space-2);border-bottom:1px solid var(--border-subtle)">
      <div class="t-sm t-muted" style="font-weight:600">Program</div>
      <div class="t-sm t-muted" style="font-weight:600;display:grid;grid-template-columns:repeat(${Math.min(totalDays, 14)},1fr);overflow:hidden">
        ${Array.from({ length: Math.min(totalDays, 14) }).map((_, i) => {
          const d = new Date(startMs + (totalMs / Math.min(totalDays, 14)) * i);
          return `<div class="gantt-day">${d.getDate()}</div>`;
        }).join("")}
      </div>
    </div>
  `;

  const lanes = rows.map((r) => {
    const s = r[startField];
    const e = r[endField];
    if (!s || !e) return "";
    const sMs = new Date(s).getTime();
    const eMs = new Date(e).getTime();
    const left = ((sMs - startMs) / totalMs) * 100;
    const width = ((eMs - sMs) / totalMs) * 100;
    const progress = progressField && r[progressField] != null ? Number(r[progressField]) : null;
    const progressWidth = progress != null ? (width * progress) / 100 : null;
    return `
      <div class="gantt-row" style="display:grid;grid-template-columns:200px 1fr;gap:var(--space-3);padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
        <div>
          <div class="t-sm" style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(r[titleField] || "—")}</div>
          <div class="t-xs t-muted">${escapeHTML(r[picField] || "—")}</div>
        </div>
        <div class="gantt-track" style="position:relative;background:rgba(255,255,255,0.04);border-radius:4px;height:24px;min-width:100px">
          <div class="gantt-bar" style="position:absolute;left:${left}%;width:${width}%;top:0;bottom:0;background:var(--accent);border-radius:4px;opacity:0.8"></div>
          ${progressWidth != null ? `<div class="gantt-progress" style="position:absolute;left:${left}%;width:${progressWidth}%;top:0;bottom:0;background:var(--success);border-radius:4px;opacity:0.9"></div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  return `<div class="gantt-wrap">${header}<div class="gantt-body">${lanes}</div></div>`;
}