// lib/export.js — CSV export.

export function downloadCsv(filename, rows, { headers } = {}) {
  if (!rows || rows.length === 0) {
    console.warn("[export] empty rows, nothing to export");
    return;
  }
  const cols = headers || Object.keys(rows[0]);
  const csv = [
    cols.join(","),
    ...rows.map(r => cols.map(c => csvEscape(r[c])).join(",")),
  ].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
