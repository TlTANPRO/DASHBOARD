// components/empty.js — empty state
import { escapeHTML } from "../lib/format.js";

export function emptyState({ title = "Tidak ada data", body = "", icon = "inbox" }) {
  const icons = {
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  };
  return `
    <div class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[icon] || icons.inbox}</svg>
      <div class="empty-title">${escapeHTML(title)}</div>
      ${body ? `<div class="t-sm">${escapeHTML(body)}</div>` : ""}
    </div>
  `;
}

export function loadingSkeleton(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="card">
      <div class="skeleton" style="height:14px;width:60%;margin-bottom:12px"></div>
      <div class="skeleton" style="height:32px;width:40%;margin-bottom:8px"></div>
      <div class="skeleton" style="height:12px;width:80%"></div>
    </div>
  `).join("");
}
