// components/search.js — global search modal (Cmd+K)

import { API } from "../lib/api.js";
import { escapeHTML, truncate } from "../lib/format.js";

let modal = null;
let state = { q: "", results: [], idx: 0 };
let input = null;
let list = null;

export async function openSearch() {
  if (modal) return;
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Search");
  overlay.innerHTML = `
    <div class="search-modal">
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" id="search-q" placeholder="Cari KPI, Program, Jobdesk, SOW..." aria-label="Search query" />
        <kbd class="search-kbd">esc</kbd>
      </div>
      <div class="search-results" id="search-results"></div>
      <div class="search-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  modal = overlay;
  input = overlay.querySelector("#search-q");
  list = overlay.querySelector("#search-results");

  // Pre-fetch all data in parallel
  const [kpi, program, jobdesk, sow] = await Promise.all([
    API.listKPI().catch(() => []),
    API.listProgram().catch(() => []),
    API.listJobdesk().catch(() => []),
    API.listSOW().catch(() => []),
  ]);
  state.allData = [
    ...kpi.map((r) => ({ ...r, _kind: "KPI", _title: r.Indikator || r["KPI ID"] || "—", _sub: r.PIC, _to: "kpi", _id: r.id })),
    ...program.map((r) => ({ ...r, _kind: "Program", _title: r.Judul || r["Program ID"] || "—", _sub: r.PIC, _to: "program", _id: r.id })),
    ...jobdesk.map((r) => ({ ...r, _kind: "Jobdesk", _title: r.Aktivitas || r["Jobdesk ID"] || "—", _sub: r.PIC, _to: "jobdesk", _id: r.id })),
    ...sow.map((r) => ({ ...r, _kind: "SOW", _title: r["SOW ID"] || r.Deskripsi || "—", _sub: r.PIC, _to: "sow", _id: r.id })),
  ];

  input.addEventListener("input", () => {
    state.q = input.value.toLowerCase();
    state.idx = 0;
    render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.idx = Math.min(state.idx + 1, state.results.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.idx = Math.max(state.idx - 1, 0);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      openSelected();
    } else if (e.key === "Escape") {
      closeSearch();
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  render();
  setTimeout(() => input.focus(), 50);
}

function render() {
  if (!state.allData) {
    list.innerHTML = '<div class="search-empty">Loading...</div>';
    return;
  }
  if (!state.q) {
    // Recent / popular
    state.results = state.allData.slice(0, 10);
    list.innerHTML = `
      <div class="search-section-label">Recent</div>
      ${renderResults()}
    `;
    return;
  }
  const q = state.q;
  const matches = state.allData
    .map((r) => {
      const text = `${r._title} ${r._sub} ${r._kind} ${r.Catatan || ""} ${r.Risiko || ""} ${r.Deskripsi || ""}`.toLowerCase();
      if (text.includes(q)) {
        const idx = text.indexOf(q);
        return { r, score: 100 - idx };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((x) => x.r);

  state.results = matches;
  if (matches.length === 0) {
    list.innerHTML = '<div class="search-empty">Tidak ada hasil untuk "' + escapeHTML(state.q) + '"</div>';
    return;
  }
  list.innerHTML = `
    <div class="search-section-label">${matches.length} hasil</div>
    ${renderResults()}
  `;
}

function renderResults() {
  return state.results
    .map(
      (r, i) => `
    <div class="search-item${i === state.idx ? " active" : ""}" data-idx="${i}">
      <span class="search-kind kind-${r._to}">${escapeHTML(r._kind)}</span>
      <div class="search-text">
        <div class="search-title">${escapeHTML(truncate(r._title, 80))}</div>
        <div class="search-sub">${escapeHTML(r._sub || "")} · ${escapeHTML(truncate(r.Catatan || r.Deskripsi || r["Tipe"] || r.Status || "", 80))}</div>
      </div>
    </div>
  `
    )
    .join("");
}

function openSelected() {
  const r = state.results[state.idx];
  if (!r) return;
  closeSearch();
  location.hash = "#/" + r._to;
}

export function closeSearch() {
  if (modal) {
    modal.remove();
    modal = null;
  }
}