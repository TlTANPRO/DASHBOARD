// app.js — Bootstrap: auth, router, polling, keyboard
import { initTheme } from "./lib/theme.js";
import { Session, getPicList, getOwnerPics } from "./lib/auth.js";
import { defineRoute, startRouter, go } from "./lib/router.js";
import { initKeyboard } from "./components/keyboard.js";
import { initProgress } from "./components/progress.js";
import { openSearch } from "./components/search.js";
import { success } from "./lib/notify.js";
import { invalidate } from "./lib/cache.js";

const VERSION = "3.0.0";
const PIC_LIST = window.DASHBOARD_CONFIG?.picList || [];

// ===== Theme init =====
initTheme();

// ===== Progress init =====
initProgress();

// ===== Keyboard init =====
initKeyboard();

// ===== Views (lazy import) =====
const views = {
  home: () => import("./views/home.js").then((m) => m.renderHome()),
  kpi: () => import("./views/kpi.js").then((m) => m.renderKPI()),
  program: () => import("./views/program.js").then((m) => m.renderProgram()),
  jobdesk: () => import("./views/jobdesk.js").then((m) => m.renderJobdesk()),
  sow: () => import("./views/sow.js").then((m) => m.renderSOW()),
  leaderboard: () => import("./views/leaderboard.js").then((m) => m.renderLeaderboard()),
  fee: () => import("./views/fee.js").then((m) => m.renderFee()),
  pricing: () => import("./views/pricing.js").then((m) => m.renderPricing()),
  glosarium: () => import("./views/glosarium.js").then((m) => m.renderGlosarium()),
  settings: () => import("./views/settings.js").then((m) => m.renderSettings()),
};

for (const [name, handler] of Object.entries(views)) {
  defineRoute(name, handler);
}

// ===== SESSION PILL =====
function updateSessionPill() {
  const pill = document.getElementById("session-pill");
  const loginBtn = document.getElementById("btn-login");
  const picName = document.getElementById("session-pic");
  if (Session.isLoggedIn()) {
    if (pill) pill.hidden = false;
    if (picName) picName.textContent = Session.pic + (Session.isOwner() ? " (Owner)" : "");
    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.classList.remove("btn-primary");
      loginBtn.classList.add("btn-outline");
    }
  } else {
    if (pill) pill.hidden = true;
    if (loginBtn) {
      loginBtn.textContent = "Login";
      loginBtn.classList.add("btn-primary");
      loginBtn.classList.remove("btn-outline");
    }
  }
}

// ===== TOPBAR ACTIONS =====
document.addEventListener("DOMContentLoaded", () => {
  // Hide pill until auth check
  const pill = document.getElementById("session-pill");
  if (pill) pill.hidden = !Session.isLoggedIn();

  // Theme toggle: handler dipasang oleh lib/theme.js initTheme() — jangan duplikasi

  // Refresh
  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    invalidate();
    location.reload();
  });

  // Search trigger (Cmd+K alternative)
  document.getElementById("search-trigger")?.addEventListener("click", () => openSearch());
  document.getElementById("search-trigger")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSearch(); }
  });

  // Login / Logout
  document.getElementById("btn-login")?.addEventListener("click", async () => {
    if (Session.isLoggedIn()) {
      Session.clear();
      updateSessionPill();
      location.reload();
      return;
    }
    await showLoginModal();
  });

  // Hamburger (mobile)
  document.getElementById("btn-menu")?.addEventListener("click", () => {
    document.querySelector(".sidenav")?.classList.toggle("open");
  });
});

async function showLoginModal() {
  const { openModal } = await import("./lib/modal.js");
  const picOptions = PIC_LIST.map((p) => `<option value="${p}">${p}</option>`).join("");
  const body = document.createElement("div");
  body.innerHTML = `
    <div class="col gap-3">
      <div class="field">
        <label class="field-label" for="login-pic">PIC</label>
        <select class="select" id="login-pic">${picOptions}</select>
      </div>
      <div class="field">
        <label class="field-label" for="login-pin">PIN (4 digit)</label>
        <input class="input" id="login-pin" type="password" inputmode="numeric" maxlength="4" placeholder="••••" />
      </div>
      <div class="t-xs t-muted">PIN dari file pins-assignment.txt</div>
    </div>
  `;
  openModal({
    title: "Login",
    body,
    actions: [
      { label: "Batal", variant: "btn-ghost" },
      {
        label: "Masuk",
        variant: "btn-primary",
        onClick: async () => {
          const pic = body.querySelector("#login-pic").value;
          const pin = body.querySelector("#login-pin").value;
          try {
            await Session.login(pic, pin);
            updateSessionPill();
            success(`Login sebagai ${pic}`);
          } catch (e) {
            alert(`Login gagal: ${e.message}`);
            return false;
          }
        },
      },
    ],
  });
}

// ===== Initial render =====
Session.load();
updateSessionPill();
startRouter("home");

// ===== Background sync (every 5 min, silent) =====
setInterval(() => {
  invalidate();
}, 5 * 60 * 1000);

// ===== Show version in console =====
console.log(`Dashboard Syahfalah v${VERSION}`);