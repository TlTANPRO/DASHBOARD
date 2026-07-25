// components/card.js — stat card + bento card
import { escapeHTML } from "../lib/format.js";

export function statCard({ label, value, delta = null, hint = null }) {
  const deltaHtml = delta
    ? `<div class="card-delta ${delta.direction || ""}">${delta.direction === "up" ? "↑" : delta.direction === "down" ? "↓" : "•"} ${escapeHTML(delta.text)}</div>`
    : "";
  return `
    <div class="card">
      <div class="card-title">${escapeHTML(label)}</div>
      <div class="card-value">${escapeHTML(value)}</div>
      ${deltaHtml}
      ${hint ? `<div class="t-xs t-muted mt-2">${escapeHTML(hint)}</div>` : ""}
    </div>
  `;
}

export function bentoCard({ title, body, footer = null, className = "" }) {
  return `
    <div class="card ${className}">
      ${title ? `<div class="h-3 mb-3">${escapeHTML(title)}</div>` : ""}
      <div>${body}</div>
      ${footer ? `<div class="mt-3 t-xs t-muted">${footer}</div>` : ""}
    </div>
  `;
}
