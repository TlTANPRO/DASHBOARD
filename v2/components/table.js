// components/table.js — sortable, filterable data table
import { escapeHTML, truncate } from "../lib/format.js";

export function dataTable({ columns, rows, empty = "Tidak ada data", rowKey = "id", onRowClick = null }) {
  if (!rows || rows.length === 0) {
    return `
      <div class="table-wrap">
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <div class="empty-title">${escapeHTML(empty)}</div>
        </div>
      </div>
    `;
  }

  const head = columns
    .map((c) => {
      const cls = c.align === "right" ? ' style="text-align:right"' : c.align === "center" ? ' style="text-align:center"' : "";
      return `<th scope="col"${cls}>${escapeHTML(c.label)}</th>`;
    })
    .join("");

  const body = rows
    .map((row) => {
      const cells = columns
        .map((c) => {
          let val = typeof c.render === "function" ? c.render(row) : row[c.key];
          if (val == null) val = "—";
          if (typeof val === "string" && !val.startsWith("<") && c.truncate) {
            val = `<span title="${escapeHTML(val)}" class="truncate">${escapeHTML(val)}</span>`;
          } else if (typeof val === "string" && !val.startsWith("<")) {
            val = escapeHTML(val);
          }
          const cls = c.align === "right" ? ' class="num" style="text-align:right"' : c.align === "center" ? ' style="text-align:center"' : "";
          return `<td${cls}>${val}</td>`;
        })
        .join("");
      const clickAttr = onRowClick ? ` data-row-id="${escapeHTML(row[rowKey])}" style="cursor:pointer"` : "";
      return `<tr${clickAttr}>${cells}</tr>`;
    })
    .join("");

  return `<div class="table-wrap"><table class="table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}
