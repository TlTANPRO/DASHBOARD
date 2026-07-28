// theme.js — Light/dark/system. Sync init to prevent FOUC.
// Called inline from main.js boot, also bound to topbar toggle.

const STORAGE_KEY = "syahfalah-theme";

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || "system";
}

export function getEffectiveTheme() {
  const t = getTheme();
  if (t === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return t;
}

export function applyTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  const effective = theme === "system" ? getEffectiveTheme() : theme;
  document.documentElement.dataset.theme = effective;
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", effective === "dark" ? "#1a1a2e" : "#4f46e5");
}

export function toggleTheme() {
  const current = getEffectiveTheme();
  applyTheme(current === "dark" ? "light" : "dark");
}

// Apply on module load to prevent FOUC.
applyTheme(getTheme());

// Listen for system theme changes (when theme=system).
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (getTheme() === "system") applyTheme("system");
});
