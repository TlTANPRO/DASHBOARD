// views/settings.js — Settings (theme, mode, data)
import { API } from "../lib/api.js";
import { applyTheme, getTheme } from "../lib/theme.js";
import { Session } from "../lib/auth.js";
import { success, info, danger } from "../lib/notify.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { escapeHTML } from "../lib/format.js";

export function renderSettings() {
  const root = document.getElementById("view-root");
  const currentTheme = getTheme();
  const currentMode = API.mode;
  const loggedIn = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  root.innerHTML = `
    <h1 class="h-1 mb-4">Settings</h1>

    <div class="bento">
      <div class="card">
        <h2 class="h-3 mb-3">Theme</h2>
        <p class="t-sm t-muted mb-3">Pilih tampilan. Default mengikuti preferensi OS.</p>
        <div class="row gap-2 wrap">
          <button class="btn ${currentTheme === "dark" ? "btn-primary" : "btn-outline"}" data-theme="dark">Dark</button>
          <button class="btn ${currentTheme === "light" ? "btn-primary" : "btn-outline"}" data-theme="light">Light</button>
        </div>
      </div>

      <div class="card">
        <h2 class="h-3 mb-3">Data Mode</h2>
        <p class="t-sm t-muted mb-3">
          Mode aktif: <span class="pill pill-accent">${escapeHTML(currentMode.toUpperCase())}</span>
        </p>
        <p class="t-sm t-muted">
          ${currentMode === "live" ? "Data live dari Notion via Cloudflare Worker." : "Data dari localStorage (offline)."}
        </p>
        <p class="t-xs t-muted mt-3">
          Untuk ganti mode, edit <code class="t-mono">config.js</code> → <code class="t-mono">mode: "live" | "demo"</code>
        </p>
      </div>

      <div class="card">
        <h2 class="h-3 mb-3">Session</h2>
        <p class="t-sm t-muted mb-3">
          ${loggedIn ? `Login sebagai <strong>${escapeHTML(Session.pic)}</strong>` : "Belum login"}
        </p>
        ${
          loggedIn
            ? `<button class="btn btn-outline" id="btn-logout">Logout</button>`
            : `<p class="t-xs t-muted">Klik "Login" di topbar</p>`
        }
      </div>

      <div class="card">
        <h2 class="h-3 mb-3">PIC Reference</h2>
        <p class="t-sm t-muted mb-3">${picList.length} PIC terdaftar</p>
        <div class="row wrap gap-1">
          ${picList.map((p) => `<span class="pill pill-muted">${escapeHTML(p)}</span>`).join("")}
        </div>
      </div>

      <div class="card" style="grid-column:span 2">
        <h2 class="h-3 mb-3">Data Management</h2>
        <div class="row gap-2 wrap">
          <button class="btn btn-outline" id="btn-export">Export JSON</button>
          <button class="btn btn-outline" id="btn-import">Import JSON</button>
          <button class="btn btn-outline" id="btn-clear" style="color:var(--danger)">Clear All Demo Data</button>
        </div>
        <p class="t-xs t-muted mt-3">⚠️ Hanya data demo (localStorage). Data live di Notion tidak terpengaruh.</p>
      </div>
    </div>
  `;

  // Theme buttons
  document.querySelectorAll("[data-theme]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.theme;
      applyTheme(t);
      localStorage.setItem("dvb2-theme", t);
      success(`Theme: ${t}`);
      renderSettings();
    });
  });

  // Logout
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    Session.clear();
    info("Logout berhasil");
    setTimeout(() => location.reload(), 500);
  });

  // Export
  document.getElementById("btn-export")?.addEventListener("click", () => {
    const data = {
      kpi: JSON.parse(localStorage.getItem("dvb2-kpi") || "[]"),
      program: JSON.parse(localStorage.getItem("dvb2-program") || "[]"),
      jobdesk: JSON.parse(localStorage.getItem("dvb2-jobdesk") || "[]"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dvb2-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success("Export selesai");
  });

  // Import
  document.getElementById("btn-import")?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.kpi) localStorage.setItem("dvb2-kpi", JSON.stringify(data.kpi));
          if (data.program) localStorage.setItem("dvb2-program", JSON.stringify(data.program));
          if (data.jobdesk) localStorage.setItem("dvb2-jobdesk", JSON.stringify(data.jobdesk));
          success("Import selesai — refresh halaman");
        } catch (err) {
          danger(`File invalid: ${err.message}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // Clear
  document.getElementById("btn-clear")?.addEventListener("click", async () => {
    const ok = await confirmDialog({
      title: "Hapus semua data demo?",
      body: "KPI, Program, dan Jobdesk di localStorage akan dihapus. Tidak bisa di-undo.",
      danger: true,
      confirmLabel: "Hapus Semua",
    });
    if (!ok) return;
    localStorage.removeItem("dvb2-kpi");
    localStorage.removeItem("dvb2-program");
    localStorage.removeItem("dvb2-jobdesk");
    success("Data demo dihapus");
    setTimeout(() => location.reload(), 500);
  });
}
