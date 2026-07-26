// views/jobdesk.js — Jobdesk Harian CRUD (using normalized Notion data)
import { API } from "../lib/api.js";
import { dataTable, wirePagination } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtDate, escapeHTML } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";

let state = { data: [], filterPIC: "", filterDate: "" };

export async function renderJobdesk() {
  const root = document.getElementById("view-root");
  root.innerHTML = `<div class="h-1 mb-4">Jobdesk Harian</div>${loadingSkeleton(2)}`;

  try {
    state.data = await API.listJobdesk();
  } catch (e) {
    state.data = [];
    danger(`Gagal: ${e.message}`);
  }
  draw();
  bindFilterEvents();
}

function draw() {
  const root = document.getElementById("view-root");
  const canEdit = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  const filtered = state.data.filter((r) => {
    if (state.filterPIC && r.PIC !== state.filterPIC) return false;
    if (state.filterDate && r.Tanggal !== state.filterDate) return false;
    return true;
  });

  // Sort by date desc
  filtered.sort((a, b) => (b.Tanggal || "").localeCompare(a.Tanggal || ""));

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Jobdesk Harian</h1>
        <p class="t-muted t-sm">${filtered.length} dari ${state.data.length} entri</p>
      </div>
      ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah Jobdesk</button>' : ""}
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "date", label: "Tanggal", type: "search", value: state.filterDate, placeholder: "YYYY-MM-DD" },
      ],
    })}

    ${dataTable({
      columns: [
        { key: "Tanggal", label: "Tanggal", render: (r) => fmtDate(r.Tanggal) },
        { key: "PIC", label: "PIC" },
        { key: "Aktivitas", label: "Jobdesk", truncate: true },
        { key: "Target", label: "Target Output", truncate: true },
        { key: "Output", label: "Actual Output", truncate: true },
        { key: "Prioritas", label: "Prioritas", render: (r) => r.Prioritas ? `<span class="pill pill-muted">${escapeHTML(r.Prioritas)}</span>` : "—" },
        { key: "Status", label: "Status", render: (r) => statusPill(r.Status) },
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
      empty: "Belum ada jobdesk",
    })}
  `;

  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null));
  document.querySelectorAll('[data-action="edit"]').forEach((btn) =>
    btn.addEventListener("click", () => {
      const rec = state.data.find((r) => r.id === btn.dataset.id);
      if (rec) openEditor(rec);
    })
  );
  document.querySelectorAll('[data-action="delete"]').forEach((btn) =>
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Hapus Jobdesk?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
      if (!ok) return;
      try {
        await API.deleteJobdesk(btn.dataset.id);
        state.data = state.data.filter((r) => r.id !== btn.dataset.id);
        success("Dihapus");
        draw();
      } catch (e) {
        danger(`Gagal: ${e.message}`);
      }
    })
  );

  wirePagination(root);
}

function bindFilterEvents() {
  document.querySelectorAll("[data-filter]").forEach((el) => {
    const handler = () => {
      const f = el.dataset.filter;
      state[f === "pic" ? "filterPIC" : "filterDate"] = el.value;
      draw();
    };
    el.addEventListener("change", handler);
    el.addEventListener("input", handler);
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
        <div class="field"><label class="field-label" for="job-id">Jobdesk ID</label>
          <input class="input" id="job-id" value="${escapeHTML(r["Jobdesk ID"] || "")}" placeholder="JOB-20260726-Mada-01" />
        </div>
        <div class="field"><label class="field-label" for="job-pic">PIC *</label>
          <select class="select" id="job-pic" required>${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label class="field-label" for="job-tanggal">Tanggal</label>
          <input class="input" id="job-tanggal" type="date" value="${escapeHTML(r.Tanggal || today)}" />
        </div>
        <div class="field"><label class="field-label" for="job-prioritas">Prioritas</label>
          <select class="select" id="job-prioritas">
            ${["", "Low", "Medium", "High", "Urgent"].map((p) => `<option value="${p}"${r.Prioritas === p ? " selected" : ""}>${p || "—"}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field"><label class="field-label" for="job-aktivitas">Jobdesk *</label>
        <input class="input" id="job-aktivitas" required value="${escapeHTML(r.Aktivitas || "")}" />
      </div>
      <div class="field"><label class="field-label" for="job-target">Target Output</label>
        <input class="input" id="job-target" value="${escapeHTML(r.Target || "")}" />
      </div>
      <div class="field"><label class="field-label" for="job-output">Actual Output</label>
        <input class="input" id="job-output" value="${escapeHTML(r.Output || "")}" />
      </div>
      <div class="field"><label class="field-label" for="job-status">Status</label>
        <select class="select" id="job-status">
          ${["To Do", "In Progress", "Done", "Blocked"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
    </div>
  `;

  openModal({
    title: isEdit ? "Edit Jobdesk" : "Tambah Jobdesk",
    body: form,
    actions: [
      { label: "Batal", variant: "btn-ghost" },
      {
        label: isEdit ? "Simpan" : "Tambah",
        variant: "btn-primary",
        onClick: async () => {
          const data = {
            "Jobdesk ID": form.querySelector("#job-id").value,
            PIC: form.querySelector("#job-pic").value,
            Tanggal: form.querySelector("#job-tanggal").value,
            Aktivitas: form.querySelector("#job-aktivitas").value,
            Target: form.querySelector("#job-target").value,
            Output: form.querySelector("#job-output").value,
            Prioritas: form.querySelector("#job-prioritas").value,
            Status: form.querySelector("#job-status").value,
          };
          try {
            if (isEdit) await API.updateJobdesk(record.id, data);
            else await API.createJobdesk(data);
            state.data = await API.listJobdesk();
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
