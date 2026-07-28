// pwa.js — Service worker registration, install prompt, USER-INITIATED update (M10 fix).
// No auto-reload. User clicks button → reload.

const INSTALL_DISMISS_KEY = "pwa-install-dismissed-at";
const UPDATE_DISMISS_KEY = "pwa-update-dismissed-at";
const DISMISS_DAYS = 7;
const UPDATE_DISMISS_HOURS = 1;

let installPromptEvent = null;
let updateWaitingWorker = null;
let refreshing = false;
let bootTime = Date.now();

export function init() {
  // Local dev: skip SW if ?nosw=1
  if (location.search.includes("nosw=1")) {
    console.log("[pwa] SW disabled (nosw=1)");
    bindInstallPromptUI();
    bindUpdatePromptUI();
    return;
  }
  // Try to unregister any leftover SW from previous deployments to prevent stale cache
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      for (const r of regs) {
        if (r.scope !== new URL("./", location.href).href) {
          r.unregister().catch(() => {});
        }
      }
    }).catch(() => {});
    registerSW();
  }

  // Suppress install prompt for first 10s (avoid annoying first-time visits)
  setTimeout(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      installPromptEvent = e;
      const visits = parseInt(localStorage.getItem("pwa-visits") || "0", 10) + 1;
      localStorage.setItem("pwa-visits", String(visits));
      const dismissedAt = localStorage.getItem(INSTALL_DISMISS_KEY);
      const dismissedExpired = !dismissedAt || (Date.now() - Number(dismissedAt)) > DISMISS_DAYS * 86400_000;
      if (visits >= 2 && dismissedExpired) {
        showInstallPrompt();
      }
    });
  }, 10_000);

  bindInstallPromptUI();
  bindUpdatePromptUI();
}

async function registerSW() {
  try {
    const reg = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        // M11 fix: only show update prompt AFTER 30s of being installed
        // (avoids spurious popup when old V2 SW unregisters during page load)
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          const dismissedAt = localStorage.getItem(UPDATE_DISMISS_KEY);
          const dismissedRecent = dismissedAt && (Date.now() - Number(dismissedAt)) < UPDATE_DISMISS_HOURS * 3600_000;
          if (dismissedRecent) {
            console.log("[pwa] update suppressed (dismissed recently)");
            return;
          }
          const elapsed = Date.now() - bootTime;
          if (elapsed > 30_000) {
            updateWaitingWorker = newWorker;
            showUpdatePrompt();
          } else {
            setTimeout(() => {
              updateWaitingWorker = newWorker;
              showUpdatePrompt();
            }, 30_000 - elapsed);
          }
        }
      });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      // do nothing — wait for user click
    });
  } catch (e) {
    console.warn("[pwa] SW registration failed", e);
  }
}

function showInstallPrompt() {
  const el = document.getElementById("pwa-install");
  if (el) el.hidden = false;
}

function showUpdatePrompt() {
  const el = document.getElementById("pwa-update");
  if (el) el.hidden = false;
}

function bindInstallPromptUI() {
  document.getElementById("pwa-install-dismiss")?.addEventListener("click", () => {
    localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
    document.getElementById("pwa-install").hidden = true;
  });
  document.getElementById("pwa-install-confirm")?.addEventListener("click", async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice.outcome === "accepted") {
      console.log("[pwa] installed");
    }
    installPromptEvent = null;
    document.getElementById("pwa-install").hidden = true;
  });
}

function bindUpdatePromptUI() {
  document.getElementById("pwa-update-dismiss")?.addEventListener("click", () => {
    localStorage.setItem(UPDATE_DISMISS_KEY, String(Date.now()));
    document.getElementById("pwa-update").hidden = true;
  });
  document.getElementById("pwa-update-confirm")?.addEventListener("click", () => {
    localStorage.setItem(UPDATE_DISMISS_KEY, String(Date.now()));
    if (updateWaitingWorker) {
      updateWaitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    refreshing = true;
    window.location.reload();
  });
}
