// lib/theme.js — theme switcher (dark/light/sepia/auto)

const STORAGE_KEY = "dvb2-theme";
const THEMES = ["dark", "light", "sepia", "dark"]; // cycle: dark → light → sepia → dark

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || "dark";
  applyTheme(saved);

  // Guard: pasang handler sekali saja
  const btn = document.getElementById("btn-theme");
  if (btn && !btn.dataset.themeBound) {
    btn.dataset.themeBound = "1";
    btn.addEventListener("click", () => {
      const current = getTheme();
      const idx = THEMES.indexOf(current);
      const next = THEMES[(idx + 1) % THEMES.length];
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      btn.setAttribute("aria-pressed", next === "light" || next === "sepia" ? "true" : "false");
      btn.setAttribute("title", `Theme: ${next}`);
      // Notify listeners
      window.dispatchEvent(new CustomEvent("dvb2-theme-change", { detail: { theme: next } }));
    });
  }
}

export function applyTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  // Update theme color meta
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const colors = { dark: "#0a0a0a", light: "#ffffff", sepia: "#f4ecd8" };
    meta.setAttribute("content", colors[name] || "#0a0a0a");
  }
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export function getThemes() {
  return ["dark", "light", "sepia"];
}
