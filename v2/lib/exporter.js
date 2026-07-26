// lib/exporter.js — Export to CSV/Excel/JSON
export function toCSV(rows, columns) {
  if (!rows.length) return "";
  const cols = columns || Object.keys(rows[0]).map((k) => ({ key: k, label: k }));
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const header = cols.map((c) => esc(c.label || c.key)).join(",");
  const body = rows.map((r) => cols.map((c) => esc(r[c.key])).join(",")).join("\n");
  return header + "\n" + body;
}

export function toTSV(rows, columns) {
  return toCSV(rows, columns).replace(/,/g, "\t");
}

export function downloadFile(content, filename, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCSV(rows, columns, filename) {
  const csv = "\uFEFF" + toCSV(rows, columns); // BOM for Excel UTF-8
  downloadFile(csv, filename, "text/csv;charset=utf-8");
}

export function exportJSON(rows, filename) {
  const json = JSON.stringify(rows, null, 2);
  downloadFile(json, filename, "application/json;charset=utf-8");
}

export function exportPrintableHTML(title, rows, columns) {
  const cols = columns || Object.keys(rows[0] || {}).map((k) => ({ key: k, label: k }));
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; }
  h1 { font-size: 18px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
  tr:nth-child(even) { background: #fafafa; }
  .meta { color: #666; font-size: 11px; margin-bottom: 12px; }
</style></head><body>
<h1>${title}</h1>
<div class="meta">Exported: ${new Date().toLocaleString("id-ID")} • ${rows.length} rows</div>
<table><thead><tr>${cols.map((c) => `<th>${c.label || c.key}</th>`).join("")}</tr></thead>
<tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${r[c.key] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody>
</table></body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
}
