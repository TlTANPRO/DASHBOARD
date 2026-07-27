// views/glosarium.js — Glossary
import { loadAllSSOT } from "../lib/api.js";
import { loadingSkeleton } from "../components/empty.js";
import { escapeHTML } from "../lib/format.js";

export async function renderGlosarium() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  const all = await loadAllSSOT();

  // Build glossary from various SSOT files
  const entries = [];

  // From struktur-organisasi
  if (all["struktur-organisasi"]) {
    const s = all["struktur-organisasi"];
    Object.entries(s).forEach(([k, v]) => {
      if (typeof v === "string" && k.length < 60) {
        entries.push({ term: k, def: v, source: "struktur-organisasi" });
      }
    });
  }

  // From hr-policy
  if (all["hr-policy"] && typeof all["hr-policy"] === "object") {
    Object.entries(all["hr-policy"]).forEach(([k, v]) => {
      if (typeof v === "string") {
        entries.push({ term: k, def: v, source: "hr-policy" });
      }
    });
  }

  // Dedupe by term
  const seen = new Set();
  const unique = entries.filter((e) => {
    if (seen.has(e.term)) return false;
    seen.add(e.term);
    return true;
  });

  if (unique.length === 0) {
    root.innerHTML = '<div class="empty"><div class="empty-title">Glosarium belum tersedia</div></div>';
    return;
  }

  // Group by first letter
  const byLetter = {};
  unique.forEach((e) => {
    const letter = (e.term[0] || "?").toUpperCase();
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(e);
  });

  const sortedLetters = Object.keys(byLetter).sort();

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Glosarium</h1>
        <p class="t-muted t-sm">${unique.length} istilah · ${sortedLetters.length} abjad</p>
      </div>
    </div>

    <div class="row gap-1 mb-4" style="flex-wrap:wrap">
      ${sortedLetters.map((l) => `<a href="#letter-${l}" class="pill pill-muted">${l}</a>`).join("")}
    </div>

    <div class="col gap-4">
      ${sortedLetters
        .map(
          (letter) => `
        <div id="letter-${letter}">
          <h2 class="h-3 t-mono t-muted" style="border-bottom:1px solid var(--border-subtle);padding-bottom:var(--space-2)">${letter}</h2>
          <dl class="col" style="gap:var(--space-3);margin-top:var(--space-3)">
            ${byLetter[letter]
              .map(
                (e) => `
              <div class="row gap-3" style="align-items:flex-start">
                <dt class="t-sm" style="font-weight:600;min-width:140px;flex-shrink:0">${escapeHTML(e.term.replace(/_/g, " "))}</dt>
                <dd class="t-sm t-muted" style="margin:0;flex:1">${escapeHTML(String(e.def).slice(0, 200))}${String(e.def).length > 200 ? "…" : ""}</dd>
              </div>
            `
              )
              .join("")}
          </dl>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}
