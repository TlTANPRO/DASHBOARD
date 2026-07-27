// views/sow.js — Scope of Work (with filter + view tabs)
import { API } from "../lib/api.js";
import { bentoCard } from "../components/card.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { escapeHTML } from "../lib/format.js";
import { filterBar } from "../components/filter.js";
import { dataTable } from "../components/table.js";

const PIC_OPTIONS = [
  "Pak Ardian", "Bu Nisya", "Mada", "Riza", "Yudi", "Rizal",
  "Amir", "Novita", "Sinta", "Reni", "Rifki", "Reta",
];

const FREQ_OPTIONS = ["Harian", "Mingguan", "Bulanan", "Kuartalan", "Tahunan"];

const state = { data: [], filtered: [], pic: "all", freq: "all", q: "", view: "card" };

export async function renderSOW() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  try {
    state.data = await API.listSOW();
  } catch (e) {
    console.warn("SOW load failed:", e.message);
    state.data = [];
  }
  applyFilters();
  draw();
}

function applyFilters() {
  const q = state.q.toLowerCase();
  state.filtered = state.data.filter((r) => {
    if (state.pic !== "all" && r.PIC !== state.pic) return false;
    if (state.freq !== "all" && r.Frekuensi !== state.freq) return false;
    if (q) {
      const hay = `${r["SOW ID"] || ""} ${r.PIC || ""} ${r.Deskripsi || ""} ${r.Kategori?.join(" ") || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function draw() {
  const root = document.getElementById("view-root");
  const picOpts = [{ value: "all", label: "Semua PIC" }, ...PIC_OPTIONS.map((p) => ({ value: p, label: p }))];
  const freqOpts = [{ value: "all", label: "Semua Frekuensi" }, ...FREQ_OPTIONS.map((f) => ({ value: f, label: f }))];

  const body = state.view === "card" ? renderCards() : renderTable();

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Scope of Work</h1>
        <p class="t-muted t-sm">${state.filtered.length} dari ${state.data.length} SOW</p>
      </div>
      <div class="row gap-2">
        <button class="btn btn-outline" id="btn-export">⬇ Export</button>
      </div>
    </div>
    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", options: picOpts, value: state.pic },
        { id: "freq", label: "Frekuensi", type: "select", options: freqOpts, value: state.freq },
        { id: "q", label: "Cari", type: "search", value: state.q },
      ],
    })}
    <div class="view-tabs mt-3">
      <button class="tab ${state.view === "card" ? "active" : ""}" data-view="card">🗂 Card</button>
      <button class="tab ${state.view === "table" ? "active" : ""}" data-view="table">📋 Table</button>
    </div>
    <div id="sow-body" class="mt-4">${body}</div>
  `;

  bindEvents(root);
}

function renderCards() {
  if (state.filtered.length === 0) {
    return emptyState({ title: "Tidak ada SOW", body: "Coba ubah filter di atas", icon: "search" });
  }
  return `<div class="bento">${state.filtered
    .map((r) => {
      const title = r["SOW ID"] || "—";
      const pic = r.PIC || "—";
      const bobot = r["Bobot (%)"];
      const freq = r.Frekuensi || "";
      const kategori = (r.Kategori || []).join(", ");
      const desc = r.Deskripsi || "";
      return bentoCard({
        title: `${escapeHTML(title)} · ${escapeHTML(pic)}`,
        body: `
        <div class="row gap-2 mb-2">
          ${bobot != null ? `<span class="pill pill-accent">${escapeHTML(String(bobot))}%</span>` : ""}
          ${freq ? `<span class="pill pill-muted">${escapeHTML(freq)}</span>` : ""}
          ${kategori ? `<span class="pill pill-info">${escapeHTML(kategori)}</span>` : ""}
        </div>
        ${desc ? `<div class="t-sm t-muted">${escapeHTML(desc.slice(0, 120))}${desc.length > 120 ? "…" : ""}</div>` : ""}
      `,
        className: "interactive",
      });
    })
    .join("")}</div>`;
}

function renderTable() {
  if (state.filtered.length === 0) {
    return emptyState({ title: "Tidak ada SOW", body: "Coba ubah filter di atas", icon: "search" });
  }
  return dataTable({
    columns: [
      { key: "SOW ID", label: "SOW ID" },
      { key: "PIC", label: "PIC" },
      { key: "Kategori", label: "Kategori", render: (r) => (r.Kategori || []).join(", ") },
      { key: "Frekuensi", label: "Frekuensi" },
      { key: "Bobot (%)", label: "Bobot (%)", align: "right" },
      { key: "Deskripsi", label: "Deskripsi", render: (r) => escapeHTML((r.Deskripsi || "").slice(0, 80)) },
    ],
    rows: state.filtered,
    empty: "Tidak ada SOW",
  });
}

function bindEvents(root) {
  root.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      draw();
    });
  });

  root.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("input", (e) => {
      const id = el.dataset.filter;
      state[id] = e.target.value;
      applyFilters();
      const body = root.querySelector("#sow-body");
      if (body) body.innerHTML = state.view === "card" ? renderCards() : renderTable();
    });
  });

  root.querySelector("#btn-export")?.addEventListener("click", async () => {
    const { exportCSV } = await import("../lib/exporter.js");
    exportCSV({
      filename: `sow-${new Date().toISOString().slice(0, 10)}.csv`,
      columns: [
        { key: "SOW ID", label: "SOW ID" },
        { key: "PIC", label: "PIC" },
        { key: "Kategori", label: "Kategori" },
        { key: "Frekuensi", label: "Frekuensi" },
        { key: "Bobot (%)", label: "Bobot (%)" },
        { key: "Deskripsi", label: "Deskripsi" },
      ],
      rows: state.filtered,
    });
  });
}
