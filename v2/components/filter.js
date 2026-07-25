// components/filter.js — filter bar
import { escapeHTML } from "../lib/format.js";

export function filterBar({ filters = [] }) {
  return `
    <div class="filter-bar">
      ${filters
        .map((f) => {
          if (f.type === "select") {
            const opts = (f.options || [])
              .map((o) => `<option value="${escapeHTML(o.value)}"${o.value === f.value ? " selected" : ""}>${escapeHTML(o.label)}</option>`)
              .join("");
            return `<div class="field" style="min-width:160px"><label class="field-label t-xs" for="filter-${f.id}">${escapeHTML(f.label)}</label><select class="select" id="filter-${f.id}" data-filter="${f.id}"><option value="">Semua</option>${opts}</select></div>`;
          }
          if (f.type === "search") {
            return `<div class="field" style="min-width:200px;flex:1"><label class="field-label t-xs" for="filter-${f.id}">${escapeHTML(f.label)}</label><input class="input" id="filter-${f.id}" data-filter="${f.id}" placeholder="${escapeHTML(f.placeholder || "Cari…")}" value="${escapeHTML(f.value || "")}"></div>`;
          }
          return "";
        })
        .join("")}
    </div>
  `;
}
