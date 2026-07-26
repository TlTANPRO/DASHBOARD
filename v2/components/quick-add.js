// components/quick-add.js — Quick capture form di topbar
import { success, danger } from "../lib/notify.js";
import { API } from "../lib/api.js";
import { Session } from "../lib/auth.js";
import { PIC_BY_NAME } from "../lib/pic-config.js";

const DB_OPTIONS = [
  { key: "kpi", label: "KPI", fields: ["Title", "PIC", "Target", "Status", "Tipe", "Periode", "Divisi"] },
  { key: "jobdesk", label: "Jobdesk", fields: ["Title", "PIC", "Tanggal", "Status", "Prioritas", "Kategori"] },
  { key: "improvisasi", label: "Improvisasi", fields: ["Title", "PIC", "Tanggal", "Type", "Impact", "Deskripsi"] },
];

export function openQuickAdd() {
  if (!Session.isLoggedIn()) {
    danger("Login dulu untuk menambah entry");
    return;
  }
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  const dbOpts = DB_OPTIONS.map((d, i) => `<option value="${d.key}" ${i === 0 ? "selected" : ""}>${d.label}</option>`).join("");
  const picList = window.DASHBOARD_CONFIG?.picList || [];
  const picOpts = picList.map((p) => `<option value="${p}">${p}</option>`).join("");

  modal.innerHTML = `
    <div class="modal" style="max-width:480px">
      <h2 class="modal-title">⚡ Quick Capture</h2>
      <div class="modal-body">
        <form id="qa-form" class="form-stack">
          <div class="grid-2">
            <div class="field">
              <label class="field-label">Database *</label>
              <select class="select" id="qa-db">${dbOpts}</select>
            </div>
            <div class="field">
              <label class="field-label">PIC *</label>
              <select class="select" id="qa-pic">${picOpts}</select>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Title *</label>
            <input class="input" id="qa-title" required placeholder="Cth: Submit kontrak KPR" />
          </div>
          <div class="grid-2">
            <div class="field">
              <label class="field-label">Tanggal</label>
              <input class="input" id="qa-tanggal" type="date" value="${new Date().toISOString().split("T")[0]}" />
            </div>
            <div class="field">
              <label class="field-label">Status</label>
              <select class="select" id="qa-status">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="On Track">On Track</option>
                <option value="Achieved">Achieved</option>
                <option value="Pending">Pending</option>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Notes</label>
            <textarea class="textarea" id="qa-notes" rows="2" placeholder="Detail tambahan (opsional)"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="qa-cancel">Batal</button>
        <button class="btn btn-primary" id="qa-save">+ Tambah</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector("#qa-cancel").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  modal.querySelector("#qa-save").addEventListener("click", async () => {
    const form = modal.querySelector("#qa-form");
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const db = modal.querySelector("#qa-db").value;
    const title = modal.querySelector("#qa-title").value;
    const pic = modal.querySelector("#qa-pic").value;
    const tanggal = modal.querySelector("#qa-tanggal").value;
    const status = modal.querySelector("#qa-status").value;
    const notes = modal.querySelector("#qa-notes").value;

    const id = `${db.toUpperCase().slice(0, 3)}-${Date.now()}`;
    const data = { Title: title, PIC: pic, Tanggal: tanggal, Status: status };

    // Map by DB
    if (db === "kpi") {
      Object.assign(data, { "KPI ID": id, "Indikator": title, "Catatan": notes });
    } else if (db === "jobdesk") {
      Object.assign(data, { "Jobdesk ID": id, "Aktivitas": title, "Target Output": "1", "Kategori": notes || "Umum" });
    } else if (db === "improvisasi") {
      Object.assign(data, { "Impact": 3, "Deskripsi": notes || title });
    }

    try {
      if (db === "kpi") await API.createKPI(data);
      else if (db === "jobdesk") await API.createJobdesk(data);
      else if (db === "improvisasi") await API.createImprovisasi(data);
      success(`Entry ${db} ditambahkan`);
      close();
    } catch (e) {
      danger(`Gagal: ${e.message}`);
    }
  });
}
