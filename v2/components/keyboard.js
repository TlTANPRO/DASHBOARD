// components/keyboard.js — global keyboard shortcut handler

import { openSearch } from "./search.js";
import { go } from "../lib/router.js";

const shortcuts = new Map();
let modal = null;

export function registerShortcut(combo, handler, label) {
  shortcuts.set(combo, { handler, label });
}

function isMac() {
  return navigator.platform.toLowerCase().includes("mac");
}

function parseCombo(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push("mod");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}

export function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    // Ignore when typing in input/textarea
    if (/input|textarea|select/i.test(e.target.tagName)) {
      if (e.key === "Escape") e.target.blur();
      return;
    }
    const combo = parseCombo(e);
    const s = shortcuts.get(combo);
    if (s) {
      e.preventDefault();
      s.handler(e);
    }
  });

  // Built-in shortcuts
  registerShortcut("mod+k", () => openSearch(), "Search");
  registerShortcut("/", () => openSearch(), "Search");
  registerShortcut("mod+n", () => {
    const hash = location.hash.replace(/^#\//, "");
    const cur = hash.split("/")[0];
    if (cur === "kpi" || cur === "program" || cur === "jobdesk") {
      document.getElementById("btn-add")?.click();
    }
  }, "New");
  registerShortcut("mod+r", () => location.reload(), "Refresh");
  registerShortcut("mod+1", () => (location.hash = "#/home"), "Home");
  registerShortcut("mod+2", () => (location.hash = "#/kpi"), "KPI");
  registerShortcut("mod+3", () => (location.hash = "#/program"), "Program");
  registerShortcut("mod+4", () => (location.hash = "#/jobdesk"), "Jobdesk");
  registerShortcut("mod+/", () => openShortcutsModal(), "Show shortcuts");
}

function openShortcutsModal() {
  if (modal) {
    modal.remove();
    modal = null;
    return;
  }
  const mac = isMac();
  const list = Array.from(shortcuts.entries());
  modal = document.createElement("div");
  modal.className = "search-overlay";
  modal.innerHTML = `
    <div class="search-modal">
      <div class="search-input-wrap">
        <h3 style="margin:0">Keyboard Shortcuts</h3>
      </div>
      <div class="search-results" style="padding:var(--space-4)">
        ${list
          .map(
            ([k, s]) => `
          <div class="row-between" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
            <span>${escapeHTML(s.label)}</span>
            <span>${k.split("+").map((part) => `<kbd class="search-kbd">${mac && part === "mod" ? "⌘" : part === "mod" ? "Ctrl" : escapeHTML(part)}</kbd>`).join("+")}</span>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="search-footer">
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
      modal = null;
    }
  });
}

function escapeHTML(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}