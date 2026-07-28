// shell/topbar.js — User display, logout, search trigger.

import { logout, getCurrentUser } from "../auth.js";
import { initials } from "../lib/format.js";
import { subscribe } from "../store.js";

let searchTriggerBound = false;

export function init() {
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    logout();
    showLoginModal();
  });

  subscribe("auth:changed", (user) => {
    if (user) {
      document.getElementById("user-avatar").textContent = initials(user.nama);
      document.getElementById("user-name").textContent = user.nama;
      document.getElementById("logout-btn").hidden = false;
    } else {
      document.getElementById("user-avatar").textContent = "?";
      document.getElementById("user-name").textContent = "Belum login";
      document.getElementById("logout-btn").hidden = true;
    }
  });

  document.getElementById("theme-toggle")?.addEventListener("click", async () => {
    const { toggleTheme } = await import("../theme.js");
    toggleTheme();
  });

  bindSearchTrigger();
}

// Topbar search: show on Ctrl+K / Cmd+K, click opens palette
function bindSearchTrigger() {
  if (searchTriggerBound) return;
  searchTriggerBound = true;

  const searchEl = document.getElementById("topbar-search");
  const searchInput = document.getElementById("global-search");

  // Reveal on keyboard shortcut
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      // Don't override palette toggle, just reveal topbar
      if (searchEl) searchEl.hidden = false;
    }
  });

  // Click on input → open palette
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      searchInput.blur();
      // Dispatch Cmd+K to palette
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    });
  }
}

export function showLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal instanceof HTMLDialogElement) modal.showModal();
  else if (modal) modal.setAttribute("open", "");
}

export function hideLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal instanceof HTMLDialogElement) modal.close();
  else if (modal) modal.removeAttribute("open");
}
