// app.js — Bootstrap: auth, router, polling
import { initTheme } from "./lib/theme.js";
import { Session, getPicList, getOwnerPics } from "./lib/auth.js";
import { defineRoute, startRouter, go } from "./lib/router.js";
import { openModal } from "./lib/modal.js";
import { success, info, danger } from "./lib/notify.js";
import { API } from "./lib/api.js";
import { initials, escapeHTML } from "./lib/format.js";

import { renderHome } from "./views/home.js";
import { renderKPI } from "./views/kpi.js";
import { renderProgram } from "./views/program.js";
import { renderJobdesk } from "./views/jobdesk.js";
import { renderSOW } from "./views/sow.js";
import { renderLeaderboard } from "./views/leaderboard.js";
import { renderFee } from "./views/fee.js";
import { renderPricing } from "./views/pricing.js";
import { renderGlosarium } from "./views/glosarium.js";
import { renderSettings } from "./views/settings.js";

// ===== BOOT =====
initTheme();
Session.load();
updateSessionPill();
wireTopbar();
registerRoutes();
startRouter("home");
startPolling();

document.addEventListener("session:updated", () => {
  updateSessionPill();
  // re-render current view to apply auth state
  const hash = location.hash.replace(/^#\//, "") || "home";
  location.hash = "#/" + hash;
});

// ===== SESSION PILL =====
function updateSessionPill() {
  const pill = document.getElementById("session-pill");
  const loginBtn = document.getElementById("btn-login");
  const picName = document.getElementById("session-pic");
  if (Session.isLoggedIn()) {
    pill.hidden = false;
    picName.textContent = Session.pic;
    loginBtn.textContent = "Logout";
    loginBtn.classList.remove("btn-primary");
    loginBtn.classList.add("btn-outline");
  } else {
    pill.hidden = true;
    loginBtn.textContent = "Login";
    loginBtn.classList.add("btn-primary");
    loginBtn.classList.remove("btn-outline");
  }
}

// ===== TOPBAR =====
function wireTopbar() {
  document.getElementById("btn-login")?.addEventListener("click", () => {
    if (Session.isLoggedIn()) {
      Session.clear();
      updateSessionPill();
      info("Logout berhasil");
      document.dispatchEvent(new Event("session:updated"));
    } else {
      openAuthModal();
    }
  });

  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    const hash = location.hash.replace(/^#\//, "") || "home";
    location.hash = "#/" + hash;
    success("Data di-refresh");
  });
}

// ===== AUTH MODAL =====
function openAuthModal() {
  const picList = getPicList();
  const ownerPics = getOwnerPics();

  const form = document.createElement("div");
  form.innerHTML = `
    <p class="t-sm t-muted mb-3">Pilih PIC dan masukkan PIN 6 digit.</p>
    <div class="auth-pic-grid" role="radiogroup" aria-label="PIC selection">
      ${picList
        .map(
          (p) => `
        <button class="auth-pic-card" data-pic="${escapeHTML(p)}" role="radio" aria-checked="false" tabindex="-1">
          <div class="auth-pic-avatar">${initials(p)}</div>
          <div class="auth-pic-name">${escapeHTML(p)}</div>
          ${ownerPics.includes(p) ? '<span class="pill pill-accent" style="margin-top:4px">Owner</span>' : ""}
        </button>
      `
        )
        .join("")}
    </div>
    <div id="pin-section" hidden>
      <div class="field mt-3">
        <label class="field-label" for="pin-input">PIN 6 digit untuk <span id="pin-pic-name"></span></label>
        <div class="auth-pin-input">
          ${Array.from({ length: 6 }, (_, i) => `<input class="pin-digit" type="password" inputmode="numeric" maxlength="1" data-idx="${i}" />`).join("")}
        </div>
        <p class="field-hint">Default PIN: 111111 (Pak Ardian), 222222 (Bu Nisya), 333333 (Mada), dst. Lihat Settings untuk daftar lengkap.</p>
      </div>
    </div>
  `;

  let selectedPic = null;

  openModal({
    title: "Login Dashboard",
    body: form,
    className: "auth-modal",
    actions: [
      { label: "Batal", variant: "btn-ghost" },
      {
        label: "Login",
        variant: "btn-primary",
        onClick: async () => {
          if (!selectedPic) {
            danger("Pilih PIC dulu");
            return false;
          }
          const pin = Array.from(form.querySelectorAll(".pin-digit"))
            .map((i) => i.value)
            .join("");
          if (pin.length !== 6) {
            danger("PIN harus 6 digit");
            return false;
          }
          try {
            await Session.login(selectedPic, pin);
            success(`Login sebagai ${Session.pic}`);
            document.dispatchEvent(new Event("session:updated"));
          } catch (e) {
            danger(e.message);
            return false;
          }
        },
      },
    ],
  });

  // PIC selection
  form.querySelectorAll(".auth-pic-card").forEach((card) => {
    card.addEventListener("click", () => {
      form.querySelectorAll(".auth-pic-card").forEach((c) => {
        c.setAttribute("aria-checked", "false");
        c.setAttribute("tabindex", "-1");
      });
      card.setAttribute("aria-checked", "true");
      card.setAttribute("tabindex", "0");
      card.focus();
      selectedPic = card.dataset.pic;
      form.querySelector("#pin-section").hidden = false;
      form.querySelector("#pin-pic-name").textContent = selectedPic;
      // reset pin
      form.querySelectorAll(".pin-digit").forEach((d) => (d.value = ""));
      form.querySelector(".pin-digit").focus();
    });
  });

  // PIN input auto-advance
  form.querySelectorAll(".pin-digit").forEach((input, idx, all) => {
    input.addEventListener("input", (e) => {
      const v = e.target.value.replace(/\D/g, "");
      e.target.value = v;
      if (v && idx < all.length - 1) all[idx + 1].focus();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && idx > 0) {
        all[idx - 1].focus();
      }
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
      text.split("").forEach((ch, i) => {
        if (all[i]) all[i].value = ch;
      });
      if (text.length === 6) all[5].focus();
    });
  });
}

// ===== ROUTES =====
function registerRoutes() {
  defineRoute("home", () => renderHome());
  defineRoute("kpi", () => renderKPI());
  defineRoute("program", () => renderProgram());
  defineRoute("jobdesk", () => renderJobdesk());
  defineRoute("sow", () => renderSOW());
  defineRoute("leaderboard", () => renderLeaderboard());
  defineRoute("fee", () => renderFee());
  defineRoute("pricing", () => renderPricing());
  defineRoute("glosarium", () => renderGlosarium());
  defineRoute("settings", () => renderSettings());
}

// ===== POLLING =====
let pollTimer = null;
function startPolling() {
  const interval = window.DASHBOARD_CONFIG?.pollIntervalMs || 60000;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(pollTimer);
      pollTimer = null;
    } else {
      if (!pollTimer) {
        pollTimer = setInterval(() => {
          // Re-render current view
          const hash = location.hash.replace(/^#\//, "") || "home";
          const [name] = hash.split("/");
          // Dispatch a custom event so views can choose to refresh
          window.dispatchEvent(new CustomEvent("dashboard:tick", { detail: { route: name } }));
        }, interval);
      }
    }
  });
}
