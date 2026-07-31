// main.js — Boot: theme → ssot → auth → shell → router → pwa.
// Order matters. No window globals (M5 fix).

import "./theme.js"; // sync init for no FOUC
import { init as initAuth, login, getCurrentUser, getLoginList, canAccess, getLockoutDisplay } from "./auth.js";
import { fetchAll } from "./ssot.js";
import { start as startRouter, register, handleRoute } from "./router.js";
import { init as initSidebar, setActive } from "./shell/sidebar.js";
import { init as initTopbar, showLoginModal, hideLoginModal } from "./shell/topbar.js";
import { init as initPWA } from "./pwa.js";
import { startPolling } from "./poller.js";
import { mountGlobalSearch } from "./views/partials.js";
import { createLogger } from "./lib/logger.js";
import { mountKeyboard } from "./lib/keyboard.js";
import { reveal } from "./lib/reveal.js";

const log = createLogger("boot");

async function boot() {
  // 1) Fetch all data in parallel (bundled JSON fallback)
  let data;
  try {
    data = await fetchAll();
  } catch (e) {
    log.error("data fetch failed", e);
  }

  // 2) Init auth (loads people + pin hashes)
  await initAuth();

  // 3) Init shell
  initSidebar();
  initTopbar();

  // 4) Bind login UI
  setupLogin();

  // 5) Show login modal if not authenticated
  if (!getCurrentUser()) {
    showLoginModal();
  }

  // 6) Register routes
  register("/owner",     ({ container }) => import("./views/owner.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/legal",     ({ container }) => import("./views/legal.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/marketing", ({ container }) => import("./views/marketing.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/admin",     ({ container }) => import("./views/admin.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/proyek",    ({ container }) => import("./views/proyek.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/media",     ({ container }) => import("./views/media.js").then(m => m.render({ container: document.getElementById("divisi-content") })));
  register("/*",         () => import("./views/owner.js").then(m => m.render({ container: document.getElementById("divisi-content") })));

  // 7) Start router (handles initial hash + future hashchange)
  startRouter();

  // 8) Bind tabbar (mobile)
  document.querySelectorAll(".tabbar__btn").forEach(b => {
    b.addEventListener("click", () => {
      location.hash = "#/" + b.dataset.divisi;
    });
  });

  // 9) PWA
  initPWA();

  // 10) Polling (only in live mode)
  startPolling();

  // 11) Global Cmd+K search palette
  mountGlobalSearch();

  // 12) Keyboard shortcuts (g+o/m/l/a/p/c, Cmd+K, ?)
  mountKeyboard();

  // 11) Update sidebar/tabbar active state on route change
  window.addEventListener("hashchange", () => {
    const path = location.hash.replace(/^#/, "") || "/owner";
    const divisi = path.split("/")[1] || "owner";
    setActive(divisi);
    // RBAC: non-owner users get redirected if accessing other divisi
    if (!canAccess(divisi)) {
      const ownDivisi = getCurrentUser()?.divisi || "owner";
      if (divisi !== ownDivisi) {
        location.hash = "#/" + ownDivisi;
      }
    }
  });
}

function setupLogin() {
  const modal = document.getElementById("login-modal");
  const form = document.getElementById("login-form");
  const picSel = document.getElementById("login-pic");
  const pinInput = document.getElementById("login-pin");
  const errEl = document.getElementById("login-error");
  const submit = form?.querySelector('button[type="submit"]');

  // Populate PIC list
  const loginList = getLoginList();
  loginList.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.value;
    opt.textContent = `${p.label} · ${p.divisi}${p.is_owner ? " (Owner)" : ""}`;
    picSel.appendChild(opt);
  });

  // PIN input: numeric only
  pinInput?.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.hidden = true;
    const pic = picSel.value;
    const pin = pinInput.value;

    if (getLockoutDisplay()) {
      const d = getLockoutDisplay();
      errEl.textContent = `Akun terkunci. Coba lagi dalam ${d.display}`;
      errEl.hidden = false;
      return;
    }

    submit.disabled = true;
    submit.textContent = "Memverifikasi...";

    const result = await login(pic, pin);
    submit.disabled = false;
    submit.textContent = "Masuk";

    if (result.ok) {
      hideLoginModal();
      pinInput.value = "";
      handleRoute(); // re-render current view with auth context
    } else {
      const messages = {
        "wrong-pin": "PIN salah",
        "invalid-pin-format": "PIN harus 4 digit angka",
        "unknown-pic": "PIC tidak dikenal",
        "locked-out": "Akun terkunci sementara",
      };
      errEl.textContent = messages[result.reason] || result.reason;
      errEl.hidden = false;
      pinInput.focus();
      pinInput.select();
    }
  });

  // Auto-show if logged out
  if (!getCurrentUser()) showLoginModal();
}

boot().catch(e => {
  log.error("fatal", e);
  const err = document.createElement("div");
  err.className = "boot-fatal";
  err.textContent = `Boot error: ${e.message}\n\n${e.stack || ""}`;
  document.body.replaceChildren(err);
});
