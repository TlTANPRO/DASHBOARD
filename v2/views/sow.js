// views/sow.js — Scope of Work per PIC
import { loadSSOT } from "../lib/api.js";
import { bentoCard } from "../components/card.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { escapeHTML } from "../lib/format.js";

export async function renderSOW() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  const [jd, struktur] = await Promise.all([loadSSOT("jd-lengkap-12-pic"), loadSSOT("struktur-organisasi")]);

  if (!jd) {
    root.innerHTML = emptyState({ title: "Data SOW tidak tersedia", body: "File JD lengkap belum di-load", icon: "file" });
    return;
  }

  const positions = Array.isArray(jd) ? jd : Object.values(jd).filter((v) => typeof v === "object");
  const cards = positions
    .slice(0, 12)
    .map((p) => {
      const title = p.Posisi || p.Title || p.nama || "—";
      const pic = p.PIC || p.Nama || p.name || "—";
      const tugas = (p.Tugas_harian || p.Tugas || p.tasks || []).slice(0, 3);
      const tools = (p.Tools || p.tools || []).slice(0, 3);
      return bentoCard({
        title: `${escapeHTML(title)} — ${escapeHTML(pic)}`,
        body: `
        ${tugas.length > 0 ? `<div class="t-xs t-muted mb-2">Tugas:</div><ul style="padding-left:1.2rem;margin:0 0 var(--space-2)">${tugas.map((t) => `<li class="t-sm">${escapeHTML(typeof t === "string" ? t : t.nama || JSON.stringify(t))}</li>`).join("")}</ul>` : ""}
        ${tools.length > 0 ? `<div class="t-xs t-muted mb-2">Tools:</div><div class="row wrap gap-1">${tools.map((t) => `<span class="pill pill-muted">${escapeHTML(typeof t === "string" ? t : t.nama || "")}</span>`).join("")}</div>` : ""}
      `,
        className: "interactive",
      });
    })
    .join("");

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Scope of Work</h1>
        <p class="t-muted t-sm">${positions.length} posisi</p>
      </div>
    </div>
    <div class="bento">${cards}</div>
  `;
}
