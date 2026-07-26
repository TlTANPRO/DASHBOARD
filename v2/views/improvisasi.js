// views/improvisasi.js — Improvisasi CRUD untuk PIC
import { API } from "../lib/api.js";
import { Session } from "../lib/auth.js";
import { PIC_BY_NAME } from "../lib/pic-config.js";
import { escapeHTML, fmtDate } from "../lib/format.js";
import { success, danger, confirmDialog } from "../lib/notify.js";
import { dataTable, emptyState } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { loadingSkeleton } from "../components/card.js";

let state = {
  data: [],
  filtered: [],
  filterPIC: "",
  filterType: "",
  search: "",
};

export async function renderImprovisasi() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);
  try {
    state.data = await API.listImprovisasi() || [];
  } catch (e) {
    state.data = [];
    danger(`Gagal load: ${e.message}`);
  }
  applyFilter();
  draw();
}

function applyFilter() {
  state.filtered = state.data.filter((r) => {
    if (state.filterPIC && r.PIC !== state.filterPIC) return false;
    if (state.filterType && r.Type !== state.filterType) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = `${r.Title} ${r.PIC} ${r.Deskripsi} ${r.Type}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  state.filtered.sort((a, b) => (b.Tanggal || "").localeCompare(a.Tanggal || ""));
}

function draw() {
  const root = document.getElementById("view-root");
  const canEdit = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];
  const typeList = ["Efisiensi", "Inovasi", "Mentoring", "Problem Solving", "Self Development", "Cross-functional", "Customer Obsession"];

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">💡 Improvisasi</h1>
        <p class="text-muted t-sm">${state.data.length} entries • Inisiatif di luar SOW/KPI yang menunjukkan growth</p>
      </div>
      ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Submit Improvisasi</button>' : ""}
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "type", label: "Type", type: "select", value: state.filterType, options: typeList.map((t) => ({ value: t, label: t })) },
        { id: "search", label: "Cari", type: "search", value: state.search, placeholder: "Judul, deskripsi..." },
      ],
    })}

    <div id="view-area">
      ${state.filtered.length === 0
        ? emptyState({ icon: "💡", title: "Belum ada Improvisasi", body: "Submit improvisasi pertama untuk PIC ini", cta: canEdit ? { label: "+ Submit Improvisasi", onclick: "document.getElementById('btn-add').click()" } : null })
        : dataTable({
            rows: state.filtered,
            columns: [
              { key: "Tanggal", label: "Tanggal", sortable: true, render: (r) => fmtDate(r.Tanggal) },
              { key: "Type", label: "Type", sortable: true, render: (r) => `<span class="sow-pill" style="background:var(--accent-soft);color:var(--accent)">${escapeHTML(r.Type)}</span>` },
              { key: "Title", label: "Judul", sortable: true, truncate: true },
              { key: "PIC", label: "PIC", sortable: true },
              { key: "Impact", label: "Impact", sortable: true, render: (r) => `<strong>${r.Impact || 0}/5</strong>` },
              { key: "Status", label: "Status", sortable: true, render: (r) => {
                const colors = { Approved: "success", Pending: "warning", Rejected: "danger" };
                return `<span class="sow-pill" style="background:var(--bg-3);color:var(--text-secondary)">${escapeHTML(r.Status || "Pending")}</span>`;
              }},
              ...(canEdit ? [{ key: "actions", label: "", render: (r) => `<button class="btn btn-ghost t-xs" data-action="edit" data-id="${escapeHTML(r.id)}">Edit</button>` }] : []),
            ],
            pageSize: 25,
            selectable: canEdit,
          })
      }
    </div>
  `;

  bindEvents(canEdit, picList);
}

function bindEvents(canEdit, picList) {
  // Filter events
  document.querySelectorAll("[data-filter]").forEach((el) => {
    const handler = () => {
      const f = el.dataset.filter;
      if (f === "pic") state.filterPIC = el.value;
      else if (f === "type") state.filterType = el.value;
      else if (f === "search") state.search = el.value;
      applyFilter();
      draw();
    };
    el.addEventListener("change", handler);
    el.addEventListener("input", handler);
  });

  // Add button
  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null, picList));

  // Edit buttons
  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const rec = state.data.find((r) => r.id === btn.dataset.id);
      if (rec) openEditor(rec, picList);
    });
  });
}

function openEditor(rec, picList) {
  const isEdit = !!rec;
  const today = new Date().toISOString().split("T")[0];
  const r = rec || { Tanggal: today, Status: "Pending", Impact: 3 };
  const typeList = ["Efisiensi", "Inovasi", "Mentoring", "Problem Solving", "Self Development", "Cross-functional", "Customer Obsession"];

  const html = `
    <form id="imp-form" class="form-stack">
      <div class="field">
        <label class="field-label">Judul *</label>
        <input class="input" id="imp-title" required value="${escapeHTML(r.Title || "")}" placeholder="Cth: Auto-reminder closing fee" />
      </div>
      <div class="grid-2">
        <div class="field">
          <label class="field-label">PIC *</label>
          <select class="select" id="imp-pic" required>
            ${picList.map((p) => `<option value="${escapeHTML(p)}" ${r.PIC === p ? "selected" : ""}>${escapeHTML(p)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="field-label">Tanggal *</label>
          <input class="input" id="imp-tanggal" type="date" required value="${escapeHTML(r.Tanggal || today)}" />
        </div>
      </div>
      <div class="grid-2">
        <div class="field">
          <label class="field-label">Type *</label>
          <select class="select" id="imp-type" required>
            ${typeList.map((t) => `<option value="${escapeHTML(t)}" ${r.Type === t ? "selected" : ""}>${escapeHTML(t)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="field-label">Impact (1-5) *</label>
          <input class="input" id="imp-impact" type="number" min="1" max="5" required value="${r.Impact || 3}" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">Deskripsi *</label>
        <textarea class="textarea" id="imp-deskripsi" rows="3" required placeholder="Apa yang dilakukan, impact, hasil yang dicapai">${escapeHTML(r.Deskripsi || "")}</textarea>
      </div>
      <div class="field">
        <label class="field-label">Evidence URL (opsional)</label>
        <input class="input" id="imp-evidence" type="url" value="${escapeHTML(r.Evidence || "")}" placeholder="https://..." />
      </div>
      ${Session.isOwner() ? `
      <div class="field">
        <label class="field-label">Status (Owner only)</label>
        <select class="select" id="imp-status">
          ${["Pending", "Approved", "Rejected"].map((s) => `<option value="${s}" ${r.Status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>` : ""}
    </form>
  `;

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <div class="modal" style="max-width:560px">
      <h2 class="modal-title">${isEdit ? "Edit Improvisasi" : "Submit Improvisasi Baru"}</h2>
      <div class="modal-body">${html}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="imp-cancel">Batal</button>
        <button class="btn btn-primary" id="imp-save">${isEdit ? "Simpan" : "Submit"}</button>
        ${isEdit && Session.isOwner() ? `<button class="btn btn-outline" id="imp-delete" style="color:var(--danger)">Hapus</button>` : ""}
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector("#imp-cancel").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  modal.querySelector("#imp-save").addEventListener("click", async () => {
    const form = modal.querySelector("#imp-form");
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = {
      Title: modal.querySelector("#imp-title").value,
      PIC: modal.querySelector("#imp-pic").value,
      Tanggal: modal.querySelector("#imp-tanggal").value,
      Type: modal.querySelector("#imp-type").value,
      Impact: Number(modal.querySelector("#imp-impact").value),
      Deskripsi: modal.querySelector("#imp-deskripsi").value,
      Evidence: modal.querySelector("#imp-evidence").value,
    };
    if (Session.isOwner()) data.Status = modal.querySelector("#imp-status")?.value || "Pending";
    try {
      if (isEdit) {
        await API.updateImprovisasi(rec.id, data);
        success("Improvisasi diupdate");
      } else {
        await API.createImprovisasi(data);
        success("Improvisasi disubmit");
      }
      close();
      await renderImprovisasi();
    } catch (e) {
      danger(`Gagal: ${e.message}`);
    }
  });

  modal.querySelector("#imp-delete")?.addEventListener("click", async () => {
    const ok = await confirmDialog({ title: "Hapus Improvisasi?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
    if (!ok) return;
    try {
      await API.deleteImprovisasi(rec.id);
      success("Improvisasi dihapus");
      close();
      await renderImprovisasi();
    } catch (e) {
      danger(`Gagal: ${e.message}`);
    }
  });
}
