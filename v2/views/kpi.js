// views/kpi.js — KPI CRUD
import { API } from "../lib/api.js";
import { dataTable } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtNum, fmtPct, escapeHTML } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";

let state = { data: [], filterPIC: "", filterStatus: "" };

export async function renderKPI() {
  const root = document.getElementById("view-root");
  root.innerHTML = `<div class="h-1 mb-4">KPI</div>${loadingSkeleton(2)}`;

  try {
    state.data = await API.listKPI();
  } catch (e) {
    state.data = [];
    danger(`Gagal load KPI: ${e.message}`);
  }

  draw();
  bindFilterEvents();
}

function draw() {
  const root = document.getElementById("view-root");
  const pics = [...new Set(state.data.map((r) => r.PIC || r.pic).filter(Boolean))].sort();
  const statuses = [...new Set(state.data.map((r) => r.Status || r.status).filter(Boolean))].sort();

  const filtered = state.data.filter((r) => {
    if (state.filterPIC && (r.PIC || r.pic) !== state.filterPIC) return false;
    if (state.filterStatus && (r.Status || r.status) !== state.filterStatus) return false;
    return true;
  });

  const canEdit = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">KPI</h1>
        <p class="t-muted t-sm">${filtered.length} dari ${state.data.length} entri</p>
      </div>
      <div class="row gap-2">
        <button class="btn btn-outline" id="btn-seed">Seed Demo</button>
        ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah KPI</button>' : ""}
      </div>
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "status", label: "Status", type: "select", value: state.filterStatus, options: statuses.map((s) => ({ value: s, label: s })) },
      ],
    })}

    ${dataTable({
      columns: [
        { key: "KPI ID", label: "ID", render: (r) => `<span class="t-mono t-muted t-sm">${escapeHTML(r["KPI ID"] || r.id || "—")}</span>` },
        { key: "PIC", label: "PIC" },
        { key: "Indikator", label: "Indikator", truncate: true },
        { key: "Target", label: "Target", align: "right", render: (r) => fmtNum(r.Target) },
        { key: "Actual", label: "Actual", align: "right", render: (r) => fmtNum(r.Actual) },
        {
          key: "Achievement",
          label: "%",
          align: "right",
          render: (r) => {
            const t = Number(r.Target);
            const a = Number(r.Actual);
            if (!t || isNaN(t)) return "—";
            return fmtPct((a / t) * 100, 0);
          },
        },
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
      empty: "Belum ada data KPI",
    })}
  `;

  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null));
  document.getElementById("btn-seed")?.addEventListener("click", seedDemo);

  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openEditor(rec);
    });
  });
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ok = await confirmDialog({
        title: "Hapus KPI?",
        body: "Tindakan ini tidak dapat dibatalkan.",
        danger: true,
        confirmLabel: "Hapus",
      });
      if (!ok) return;
      try {
        await API.deleteKPI(id);
        state.data = state.data.filter((r) => r.id !== id);
        success("KPI dihapus");
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
    el.addEventListener("input", () => {
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
  const divisiList = window.DASHBOARD_CONFIG?.divisiList || [];

  const form = document.createElement("form");
  form.id = "kpi-form";
  form.innerHTML = `
    <div class="col gap-3">
      <div class="field">
        <label class="field-label" for="kpi-pic">PIC *</label>
        <select class="select" id="kpi-pic" required>
          <option value="">— Pilih PIC —</option>
          ${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label class="field-label" for="kpi-indikator">Indikator *</label>
        <input class="input" id="kpi-indikator" required value="${escapeHTML(r.Indikator || "")}" placeholder="Contoh: Closing 5 unit/bulan" />
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field-label" for="kpi-target">Target</label>
          <input class="input" id="kpi-target" type="number" value="${escapeHTML(r.Target || "")}" />
        </div>
        <div class="field">
          <label class="field-label" for="kpi-actual">Actual</label>
          <input class="input" id="kpi-actual" type="number" value="${escapeHTML(r.Actual || "")}" />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field-label" for="kpi-divisi">Divisi</label>
          <select class="select" id="kpi-divisi">
            <option value="">—</option>
            ${divisiList.map((d) => `<option value="${escapeHTML(d)}"${r.Divisi === d ? " selected" : ""}>${escapeHTML(d)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="field-label" for="kpi-status">Status</label>
          <select class="select" id="kpi-status">
            ${["", "Progress", "Achieved", "Miss", "Pending"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s || "—"}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field">
        <label class="field-label" for="kpi-catatan">Catatan</label>
        <textarea class="textarea" id="kpi-catatan" placeholder="Catatan tambahan…">${escapeHTML(r.Catatan || "")}</textarea>
      </div>
    </div>
  `;

  openModal({
    title: isEdit ? "Edit KPI" : "Tambah KPI",
    body: form,
    actions: [
      { label: "Batal", variant: "btn-ghost" },
      {
        label: isEdit ? "Simpan" : "Tambah",
        variant: "btn-primary",
        onClick: async () => {
          const f = form;
          if (!f.checkValidity()) {
            f.reportValidity();
            return false;
          }
          const data = {
            PIC: f.querySelector("#kpi-pic").value,
            Indikator: f.querySelector("#kpi-indikator").value,
            Target: f.querySelector("#kpi-target").value,
            Actual: f.querySelector("#kpi-actual").value,
            Divisi: f.querySelector("#kpi-divisi").value,
            Status: f.querySelector("#kpi-status").value,
            Catatan: f.querySelector("#kpi-catatan").value,
          };
          try {
            if (isEdit) {
              await API.updateKPI(record.id, data);
              success("KPI diperbarui");
            } else {
              await API.createKPI(data);
              success("KPI ditambahkan");
            }
            state.data = await API.listKPI();
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

async function seedDemo() {
  const ok = await confirmDialog({
    title: "Seed demo data?",
    body: "Akan menambahkan 6 KPI sample untuk testing. Mode demo only.",
    confirmLabel: "Tambah",
  });
  if (!ok) return;
  const samples = [
    { PIC: "Riza", Indikator: "Closing 5 unit FLPP Q3", Target: 5, Actual: 3, Status: "Progress", Divisi: "Marketing" },
    { PIC: "Reni", Indikator: "Lead baru 50/bulan", Target: 50, Actual: 62, Status: "Achieved", Divisi: "Marketing" },
    { PIC: "Mada", Indikator: "Coaching 100% PIC", Target: 12, Actual: 12, Status: "Achieved", Divisi: "Owner" },
    { PIC: "Yudi (Sdek)", Indikator: "Konstruksi Type 36 on-time", Target: 8, Actual: 6, Status: "Progress", Divisi: "Proyek" },
    { PIC: "Novita", Indikator: "Pemberkasan 0 error", Target: 30, Actual: 28, Status: "Progress", Divisi: "Admin" },
    { PIC: "Sinta", Indikator: "SHM selesai 100%", Target: 25, Actual: 15, Status: "Miss", Divisi: "Legal" },
  ];
  try {
    for (const s of samples) {
      await API.createKPI(s);
    }
    state.data = await API.listKPI();
    success("6 KPI demo ditambahkan");
    draw();
  } catch (e) {
    danger(`Gagal: ${e.message}`);
  }
}
