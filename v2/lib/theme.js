// lib/theme.js — theme switcher (dark/light/auto)

const STORAGE_KEY = "dvb2-theme";

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || "dark";
  applyTheme(saved);

  // Guard: pasang handler sekali saja
  const btn = document.getElementById("btn-theme");
  if (btn && !btn.dataset.themeBound) {
    btn.dataset.themeBound = "1";
    btn.addEventListener("click", () => {
      const current = getTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      btn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    });
  }
}

export function applyTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  // Update theme color meta
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", name === "light" ? "#ffffff" : "#0d1117");
  }
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}
