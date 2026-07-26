// views/sow.js — Scope of Work (using normalized Notion data)
import { API } from "../lib/api.js";
import { bentoCard } from "../components/card.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { escapeHTML } from "../lib/format.js";

export async function renderSOW() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  let sow = [];
  try {
    sow = await API.listSOW();
  } catch (e) {
    console.warn("SOW load failed:", e.message);
  }

  if (!sow || sow.length === 0) {
    root.innerHTML = emptyState({ title: "Belum ada SOW", body: "Tambah SOW di Notion DB 2", icon: "file" });
    return;
  }

  const cards = sow
    .slice(0, 24)
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
          ${bobot != null ? `<span class="pill pill-accent">${escapeHTML(bobot)}%</span>` : ""}
          ${freq ? `<span class="pill pill-muted">${escapeHTML(freq)}</span>` : ""}
          ${kategori ? `<span class="pill pill-info">${escapeHTML(kategori)}</span>` : ""}
        </div>
        ${desc ? `<div class="t-sm t-muted">${escapeHTML(desc.slice(0, 120))}</div>` : ""}
      `,
        className: "interactive",
      });
    })
    .join("");

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Scope of Work</h1>
        <p class="t-muted t-sm">${sow.length} SOW aktif</p>
      </div>
    </div>
    <div class="bento">${cards}</div>
  `;
}
