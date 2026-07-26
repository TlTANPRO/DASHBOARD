// components/table.js — sortable, filterable, paginated data table
import { escapeHTML } from "../lib/format.js";

export { emptyState, loadingSkeleton } from "./empty.js";
export function dataTable({ columns, rows, empty = "Tidak ada data", rowKey = "id", onRowClick = null, pageSize = 20 }) {
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

  const totalPages = Math.ceil(rows.length / pageSize);
  const dataAttr = "tbl-" + Math.random().toString(36).slice(2, 9);

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
          if (val == null || val === "") val = "—";
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
      return `<tr${clickAttr} data-row="${escapeHTML(row[rowKey] || "")}">${cells}</tr>`;
    })
    .join("");

  const pagination = totalPages > 1 ? `
    <div class="row-between" style="padding:var(--space-3) var(--space-4);border-top:1px solid var(--border-subtle);font-size:var(--text-sm)">
      <span class="t-muted">Halaman <span class="t-mono" data-page-current="${dataAttr}">1</span> dari ${totalPages} · ${rows.length} total</span>
      <div class="row gap-2">
        <button class="btn btn-sm btn-outline" data-page-prev="${dataAttr}" disabled>← Prev</button>
        <button class="btn btn-sm btn-outline" data-page-next="${dataAttr}">Next →</button>
      </div>
    </div>
  ` : "";

  return `<div class="table-wrap"><table class="table" data-table="${dataAttr}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${pagination}</div>`;
}

// Wire pagination after render
export function wirePagination(rootEl) {
  rootEl.querySelectorAll("[data-table]").forEach((tbl) => {
    const dataAttr = tbl.dataset.table;
    const prevBtn = rootEl.querySelector(`[data-page-prev="${dataAttr}"]`);
    const nextBtn = rootEl.querySelector(`[data-page-next="${dataAttr}"]`);
    const counter = rootEl.querySelector(`[data-page-current="${dataAttr}"]`);
    if (!prevBtn || !nextBtn) return;

    const tbody = tbl.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const pageSize = 20;
    const totalPages = Math.ceil(rows.length / pageSize);
    let current = 1;

    function render() {
      rows.forEach((row, i) => {
        const page = Math.floor(i / pageSize) + 1;
        row.style.display = page === current ? "" : "none";
      });
      if (counter) counter.textContent = current;
      prevBtn.disabled = current === 1;
      nextBtn.disabled = current === totalPages;
    }

    prevBtn.addEventListener("click", () => {
      if (current > 1) {
        current--;
        render();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (current < totalPages) {
        current++;
        render();
      }
    });

    render();
  });
}

// Wire row click handlers for tables rendered with onRowClick
export function wireRowClicks(rootEl, onRowClick) {
  if (!onRowClick) return;
  const rows = rootEl.querySelectorAll("tr[data-row][data-row-id]");
  if (rows.length === 0) return;
  console.log("wireRowClicks: attaching to", rows.length, "rows");
  rows.forEach((tr) => {
    tr.addEventListener("click", (e) => {
      // Ignore clicks on checkboxes, buttons, inputs
      if (e.target.closest("input, button, [data-action], .td-edit, a")) return;
      console.log("wireRowClicks click fired for", tr.dataset.rowId);
      try {
        onRowClick(tr.dataset.rowId, tr);
      } catch (err) {
        console.error("wireRowClicks error:", err);
      }
    });
  });
}
