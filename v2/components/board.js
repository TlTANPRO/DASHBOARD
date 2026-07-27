// components/board.js — Kanban-style board view (Focalboard-inspired)

import { escapeHTML } from "../lib/format.js";

export function boardView({ columns, rows, statusField = "Status", statusOrder = null, groupBy = null, onCardClick = null, rowKey = "id" }) {
  // group rows by statusField
  const groups = {};
  const statuses = statusOrder || [...new Set(rows.map((r) => r[statusField]).filter(Boolean))].sort();
  statuses.forEach((s) => (groups[s] = []));
  rows.forEach((r) => {
    const key = r[statusField] || "Tanpa Status";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  const cols = Object.entries(groups)
    .map(([status, items]) => {
      const cards = items
        .map((r) => {
          const subtitle = groupBy ? r[groupBy] : r.PIC;
          const id = escapeHTML(r.id);
          return `
          <div class="board-card" data-id="${id}"${onCardClick ? ' tabindex="0" role="button"' : ""}>
            <div class="board-card-title">${escapeHTML(r.Judul || r.Indikator || r.Aktivitas || r["KPI ID"] || r["Program ID"] || r["Jobdesk ID"] || "—")}</div>
            <div class="board-card-sub">
              <span class="t-muted">${escapeHTML(subtitle || "—")}</span>
              ${r.Tipe ? `<span class="pill pill-muted" style="margin-left:auto">${escapeHTML(r.Tipe)}</span>` : ""}
            </div>
            ${r.Target ? `<div class="board-card-meta"><span class="t-mono">Target ${escapeHTML(String(r.Target))}</span>${r.Actual ? `<span class="t-mono">Actual ${escapeHTML(String(r.Actual))}</span>` : ""}</div>` : ""}
            ${r.Deadline ? `<div class="board-card-meta"><span class="t-muted">Deadline</span><span class="t-mono">${escapeHTML(r.Deadline)}</span></div>` : ""}
          </div>
        `;
        })
        .join("");
      return `
        <div class="board-col">
          <div class="board-col-head">
            <span class="board-col-title">${escapeHTML(status)}</span>
            <span class="board-col-count">${items.length}</span>
          </div>
          <div class="board-col-body">${cards || '<div class="t-muted t-sm t-center" style="padding:var(--space-4)">Kosong</div>'}</div>
        </div>
      `;
    })
    .join("");

  return `<div class="board">${cols}</div>`;
}

// Wire click handlers for board cards rendered with onCardClick
export function wireBoardClicks(rootEl, onCardClick) {
  if (!onCardClick) return;
  const cards = rootEl.querySelectorAll(".board-card[data-id]");
  if (cards.length === 0) return;
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("input, button, [data-action], a")) return;
      try {
        onCardClick(card.dataset.id, card);
      } catch (err) {
        console.error("wireBoardClicks error:", err);
      }
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCardClick(card.dataset.id, card);
      }
    });
  });
}