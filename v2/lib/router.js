// lib/router.js — hash-based router with params

const routes = new Map();
let currentRoute = null;
let cleanupFn = null;

export function defineRoute(name, handler) {
  routes.set(name, handler);
}

export function startRouter(defaultRoute = "home") {
  const navigate = () => {
    const hash = location.hash.replace(/^#\/?/, "") || defaultRoute;
    const parts = hash.split("/").filter(Boolean);
    const name = parts[0];
    const params = parts.slice(1);
    const handler = routes.get(name) || routes.get(defaultRoute);

    if (cleanupFn) {
      try { cleanupFn(); } catch {}
      cleanupFn = null;
    }

    document.querySelectorAll(".nav-item[data-route]").forEach((el) => {
      if (el.dataset.route === name) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });

    if (handler) {
      try {
        const result = handler(params, name);
        if (typeof result === "function") cleanupFn = result;
        currentRoute = name;
      } catch (e) {
        console.error(`Route ${name} error:`, e);
        renderError(e);
      }
    } else {
      renderNotFound(name);
    }

    document.getElementById("main")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("hashchange", navigate);
  navigate();
}

export function getCurrentRoute() { return currentRoute; }

export function go(path, ...params) {
  // path bisa "/employee" atau "/employee/mada"
  const full = [path.replace(/^\//, ""), ...params].filter(Boolean).join("/");
  location.hash = "#/" + full;
}

function renderError(e) {
  const root = document.getElementById("view-root");
  if (root) {
    root.innerHTML = `
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="empty-title">Terjadi Kesalahan</div>
        <div class="t-sm t-mono">${escapeHTML(e.message)}</div>
      </div>`;
  }
}

function renderNotFound(name) {
  const root = document.getElementById("view-root");
  if (root) {
    root.innerHTML = `
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div class="empty-title">Halaman Tidak Ditemukan</div>
        <div class="t-sm t-mono">${escapeHTML(name)}</div>
        <a href="#/home" class="btn btn-primary mt-3">Kembali ke Home</a>
      </div>`;
  }
}

function escapeHTML(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}