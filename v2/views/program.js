// views/program.js — Program Kerja CRUD
import { API } from "../lib/api.js";
import { dataTable } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtDate, escapeHTML } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";

let state = { data: [], filterPIC: "", filterStatus: "" };

export async function renderProgram() {
  const root = document.getElementById("view-root");
  root.innerHTML = `<div class="h-1 mb-4">Program Kerja</div>${loadingSkeleton(2)}`;

  try {
    state.data = await API.listProgram();
  } catch (e) {
    state.data = [];
    danger(`Gagal load: ${e.message}`);
  }

  draw();
  bindFilterEvents();
}

function draw() {
  const root = document.getElementById("view-root");
  const pics = [...new Set(state.data.map((r) => r.PIC || r.pic).filter(Boolean))].sort();
  const statuses = [...new Set(state.data.map((r) => r.Status || r.status).filter(Boolean))].sort();
  const canEdit = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  const filtered = state.data.filter((r) => {
    if (state.filterPIC && (r.PIC || r.pic) !== state.filterPIC) return false;
    if (state.filterStatus && (r.Status || r.status) !== state.filterStatus) return false;
    return true;
  });

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Program Kerja</h1>
        <p class="t-muted t-sm">${filtered.length} dari ${state.data.length} program</p>
      </div>
      ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah Program</button>' : ""}
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "status", label: "Status", type: "select", value: state.filterStatus, options: statuses.map((s) => ({ value: s, label: s })) },
      ],
    })}

    ${dataTable({
      columns: [
        { key: "Id", label: "ID", render: (r) => `<span class="t-mono t-muted t-sm">${escapeHTML(r.Id || r.id || "—")}</span>` },
        { key: "PIC", label: "PIC" },
        { key: "Judul", label: "Judul", truncate: true },
        { key: "Target", label: "Target", truncate: true },
        { key: "Deadline", label: "Deadline", render: (r) => fmtDate(r.Deadline) },
        { key: "Status", label: "Status", render: (r) => statusPill(r.Status || r.status) },
        ...(canEdit
          ? [
              {
                key: "_actions",
                label: "",
                align: "right",
                render: (r) =>
                  `<button class="btn btn-sm btn-ghost" data-action="edit" data-id="${escapeHTML(r.id)}">Edit</button>
                   <button class="btn btn-sm btn-ghost" data-action="delete" data-id="${escapeHTML(r.id)}" style="color:var(--danger)">Hapus</button>`,
              },
            ]
          : []),
      ],
      rows: filtered,
      empty: "Belum ada program kerja",
    })}
  `;

  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null));
  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openEditor(rec);
    });
  });
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Hapus Program?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
      if (!ok) return;
      try {
        await API.deleteProgram(btn.dataset.id);
        state.data = state.data.filter((r) => r.id !== btn.dataset.id);
        success("Dihapus");
        draw();
      } catch (e) {
        danger(`Gagal: ${e.message}`);
      }
    });
  });
}

function bindFilterEvents() {
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("change", () => {
      const f = el.dataset.filter;
      state[f === "pic" ? "filterPIC" : "filterStatus"] = el.value;
      draw();
    });
  });
}

function openEditor(record) {
  const isEdit = !!record;
  const r = record || {};
  const picList = window.DASHBOARD_CONFIG?.picList || [];
  const today = new Date().toISOString().split("T")[0];

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="col gap-3">
      <div class="field-row">
        <div class="field"><label class="field-label" for="prog-pic">PIC *</label>
          <select class="select" id="prog-pic" required>${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}</select>
        </div>
        <div class="field"><label class="field-label" for="prog-deadline">Deadline</label>
          <input class="input" id="prog-deadline" type="date" value="${escapeHTML(r.Deadline || today)}" />
        </div>
      </div>
      <div class="field"><label class="field-label" for="prog-judul">Judul *</label>
        <input class="input" id="prog-judul" required value="${escapeHTML(r.Judul || "")}" />
      </div>
      <div class="field"><label class="field-label" for="prog-target">Target Output</label>
        <input class="input" id="prog-target" value="${escapeHTML(r.Target || "")}" placeholder="Contoh: 10 unit closing" />
      </div>
      <div class="field"><label class="field-label" for="prog-status">Status</label>
        <select class="select" id="prog-status">
          ${["", "Backlog", "Progress", "Done", "Block", "Pending"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s || "—"}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label class="field-label" for="prog-catatan">Catatan</label>
        <textarea class="textarea" id="prog-catatan">${escapeHTML(r.Catatan || "")}</textarea>
      </div>
    </div>
  `;

  openModal({
    title: isEdit ? "Edit Program" : "Tambah Program",
    body: form,
    actions: [
      { label: "Batal", variant: "btn-ghost" },
      {
        label: isEdit ? "Simpan" : "Tambah",
        variant: "btn-primary",
        onClick: async () => {
          const data = {
            PIC: form.querySelector("#prog-pic").value,
            Judul: form.querySelector("#prog-judul").value,
            Target: form.querySelector("#prog-target").value,
            Deadline: form.querySelector("#prog-deadline").value,
            Status: form.querySelector("#prog-status").value,
            Catatan: form.querySelector("#prog-catatan").value,
          };
          try {
            if (isEdit) await API.updateProgram(record.id, data);
            else await API.createProgram(data);
            state.data = await API.listProgram();
            success(isEdit ? "Diperbarui" : "Ditambahkan");
            draw();
          } catch (e) {
            danger(`Gagal: ${e.message}`);
            return false;
          }
        },
      },
    ],
  });
}
