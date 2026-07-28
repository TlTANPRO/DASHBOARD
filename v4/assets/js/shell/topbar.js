// shell/topbar.js — User display, logout.

import { logout, getCurrentUser } from "../auth.js";
import { initials } from "../lib/format.js";
import { subscribe } from "../store.js";

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
