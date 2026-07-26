// components/detail.js — slide-in side panel for row detail

import { escapeHTML, fmtIDR, fmtDate, fmtNum } from "../lib/format.js";

let panel = null;

export function openDetail({ record, schema = [], title = "Detail", actions = [] }) {
  if (panel) closeDetail();
  const overlay = document.createElement("div");
  overlay.className = "detail-overlay";
  const fields = schema
    .filter((s) => s.value != null && s.value !== "")
    .map((s) => `<div class="detail-row"><div class="detail-label">${escapeHTML(s.label)}</div><div class="detail-value">${s.html || escapeHTML(String(s.value))}</div></div>`)
    .join("");

  overlay.innerHTML = `
    <div class="detail-panel" role="dialog" aria-label="${escapeHTML(title)}">
      <div class="detail-head">
        <h2 class="detail-title">${escapeHTML(title)}</h2>
        <button class="btn btn-ghost btn-sm" data-detail-close aria-label="Close">×</button>
      </div>
      <div class="detail-body">${fields}</div>
      ${actions.length ? `<div class="detail-actions">${actions.map((a) => `<button class="btn ${a.variant || "btn-outline"}" data-action="${escapeHTML(a.key)}">${escapeHTML(a.label)}</button>`).join("")}</div>` : ""}
    </div>
  `;
  document.body.appendChild(overlay);
  panel = overlay;

  // animate in
  requestAnimationFrame(() => {
    overlay.classList.add("open");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.dataset.detailClose !== undefined) {
      closeDetail();
    }
  });

  // Action callbacks
  actions.forEach((a) => {
    const btn = overlay.querySelector(`[data-action="${a.key}"]`);
    if (btn) btn.addEventListener("click", () => a.onClick?.(record));
  });
}

export function closeDetail() {
  if (panel) {
    panel.classList.remove("open");
    setTimeout(() => panel?.remove(), 200);
    panel = null;
  }
}

export function buildSchema(record) {
  return Object.entries(record)
    .filter(([k]) => !k.startsWith("_") && k !== "id" && k !== "createdAt")
    .map(([k, v]) => ({
      label: k,
      value: v,
      html: Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : escapeHTML(String(v)),
    }));
}