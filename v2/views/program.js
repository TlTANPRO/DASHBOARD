// views/program.js — Program Kerja with List/Board/Gantt views, inline edit, bulk ops
import { API } from "../lib/api.js";
import { dataTable, wirePagination } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtDate, fmtIDR, fmtPct, escapeHTML } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";
import { boardView } from "../components/board.js";
import { ganttView } from "../components/gantt.js";
import { openDetail, buildSchema } from "../components/detail.js";

let state = {
  data: [],
  filtered: [],
  view: "list", // list | board | gantt
  filterPIC: "",
  filterStatus: "",
  search: "",
  selected: new Set(),
};

export async function renderProgram() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  try {
    state.data = await API.listProgram();
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
    if (state.filterStatus && r.Status !== state.filterStatus) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = `${r["Program ID"]} ${r.Judul} ${r.Risiko} ${r.PIC}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function draw() {
  const root = document.getElementById("view-root");
  const statuses = [...new Set(state.data.map((r) => r.Status).filter(Boolean))].sort();
  const canEdit = Session.isLoggedIn();
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  const aggregations = computeAggregations(state.filtered);

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Program Kerja</h1>
        <p class="t-muted t-sm">${state.filtered.length} dari ${state.data.length} program${state.selected.size > 0 ? ` · <span class="bulk-count">${state.selected.size} dipilih</span>` : ""}</p>
      </div>
      ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah Program</button>' : ""}
    </div>

    <div class="view-tabs">
      <button class="view-tab${state.view === "list" ? " active" : ""}" data-view="list">📋 List</button>
      <button class="view-tab${state.view === "board" ? " active" : ""}" data-view="board">📊 Board</button>
      <button class="view-tab${state.view === "gantt" ? " active" : ""}" data-view="gantt">📐 Gantt</button>
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "status", label: "Status", type: "select", value: state.filterStatus, options: statuses.map((s) => ({ value: s, label: s })) },
        { id: "search", label: "Cari", type: "search", value: state.search, placeholder: "Nama / risiko..." },
      ],
    })}

    <div id="view-area">
      ${state.view === "list" ? renderList(canEdit) : ""}
      ${state.view === "board" ? boardView({ rows: state.filtered, statusField: "Status", statusOrder: statuses, groupBy: "PIC" }) : ""}
      ${state.view === "gantt" ? ganttView({ rows: state.filtered, startField: "Tanggal Mulai", endField: "Deadline", titleField: "Judul", picField: "PIC", progressField: "Progress" }) : ""}
    </div>

    ${state.filtered.length > 0 ? `
      <div class="row-between mt-4" style="padding:var(--space-3) var(--space-4);background:var(--bg-1);border:1px solid var(--border-subtle);border-radius:var(--radius);font-size:var(--text-sm)">
        <span class="t-muted">Aggregasi</span>
        <div class="row gap-4">
          <span><span class="t-muted">Σ Budget:</span> <strong class="t-mono">${fmtIDR(aggregations.sumBudget)}</strong></span>
          <span><span class="t-muted">Σ Actual:</span> <strong class="t-mono">${fmtIDR(aggregations.sumActual)}</strong></span>
          <span><span class="t-muted">Avg Progress:</span> <strong class="t-mono">${aggregations.avgProgress}%</strong></span>
        </div>
      </div>
    ` : ""}

    ${state.selected.size > 0 && canEdit ? `
      <div class="bulk-bar mt-4">
        <span class="bulk-count">${state.selected.size} dipilih</span>
        <button class="btn btn-sm btn-outline" id="bulk-clear">Clear</button>
        ${Session.isOwner() ? '<button class="btn btn-sm btn-outline" id="bulk-delete" style="color:var(--danger)">Hapus</button>' : ""}
      </div>
    ` : ""}
  `;

  bindEvents(canEdit, picList);
  if (state.view === "list") wirePagination(root);
}

function renderList(canEdit) {
  return dataTable({
    columns: [
      ...(canEdit ? [{ key: "_check", label: "", render: (r) => `<input type="checkbox" class="row-check" data-id="${escapeHTML(r.id)}" ${state.selected.has(r.id) ? "checked" : ""}/>` }] : []),
      { key: "Program ID", label: "ID", render: (r) => `<span class="t-mono t-muted t-sm">${escapeHTML(r["Program ID"] || "—")}</span>` },
      { key: "PIC", label: "PIC", sortable: true },
      { key: "Judul", label: "Nama Program", truncate: true, render: (r) => `<span class="td-edit" data-field="Judul" data-id="${escapeHTML(r.id)}">${escapeHTML(r.Judul || "—")}</span>` },
      { key: "Quarter", label: "Quarter", render: (r) => r.Quarter ? `<span class="pill pill-muted">${escapeHTML(r.Quarter)}</span>` : "—" },
      { key: "Progress", label: "Progress", align: "right", render: (r) => `<span class="td-edit num" data-field="Progress" data-id="${escapeHTML(r.id)}">${r.Progress != null ? fmtPct(r.Progress, 0) : "—"}</span>` },
      { key: "Budget", label: "Budget", align: "right", render: (r) => fmtIDR(r.Budget) },
      { key: "Deadline", label: "Deadline", render: (r) => fmtDate(r.Deadline) },
      { key: "Status", label: "Status", render: (r) => `<span class="td-edit" data-field="Status" data-id="${escapeHTML(r.id)}">${statusPill(r.Status)}</span>` },
      ...(canEdit ? [{
        key: "_actions",
        label: "",
        align: "right",
        render: (r) => `<button class="btn btn-sm btn-ghost" data-action="edit" data-id="${escapeHTML(r.id)}">Detail</button>${Session.isOwner() ? `<button class="btn btn-sm btn-ghost" data-action="delete" data-id="${escapeHTML(r.id)}" style="color:var(--danger)">×</button>` : ""}`,
      }] : []),
    ],
    rows: state.filtered,
    empty: "Belum ada program kerja",
  });
}

function computeAggregations(rows) {
  let sumBudget = 0, sumActual = 0, progSum = 0, progCount = 0;
  rows.forEach((r) => {
    sumBudget += Number(r.Budget) || 0;
    sumActual += Number(r["Actual Spend"]) || 0;
    if (r.Progress != null) { progSum += Number(r.Progress); progCount++; }
  });
  return {
    sumBudget, sumActual,
    avgProgress: progCount > 0 ? (progSum / progCount).toFixed(1) : "—",
  };
}

function bindEvents(canEdit, picList) {
  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      draw();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((el) => {
    const handler = () => {
      const f = el.dataset.filter;
      if (f === "pic") state.filterPIC = el.value;
      else if (f === "status") state.filterStatus = el.value;
      else if (f === "search") state.search = el.value;
      applyFilter();
      draw();
    };
    el.addEventListener("change", handler);
    el.addEventListener("input", handler);
  });

  document.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) state.selected.add(id);
      else state.selected.delete(id);
      draw();
    });
  });

  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null));

  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const rec = state.data.find((r) => r.id === btn.dataset.id);
      if (rec) {
        if (canEdit && Session.isOwner()) openEditor(rec);
        else openDetail({ record: rec, schema: buildSchema(rec), title: rec.Judul || rec["Program ID"] });
      }
    });
  });

  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Hapus Program?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
      if (!ok) return;
      try {
        await API.deleteProgram(btn.dataset.id);
        state.data = state.data.filter((r) => r.id !== btn.dataset.id);
        applyFilter();
        success("Dihapus");
        draw();
      } catch (e) {
        danger(`Gagal: ${e.message}`);
      }
    });
  });

  document.querySelectorAll(".td-edit").forEach((td) => {
    td.addEventListener("click", (e) => {
      if (!canEdit) return;
      const id = td.dataset.id;
      const field = td.dataset.field;
      const rec = state.data.find((r) => r.id === id);
      if (!rec) return;
      const current = rec[field] ?? "";
      const input = document.createElement("input");
      input.className = "td-edit-input";
      input.value = current;
      td.classList.add("td-edit-saving");
      td.innerHTML = "";
      td.appendChild(input);
      input.focus();
      const save = async () => {
        const val = input.value;
        td.classList.remove("td-edit-saving");
        try {
          await API.updateProgram(id, { [field]: val });
          rec[field] = val;
          success("Disimpan");
          applyFilter();
          draw();
        } catch (e) {
          danger(`Gagal: ${e.message}`);
          draw();
        }
      };
      input.addEventListener("blur", save);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        else if (e.key === "Escape") {
          input.removeEventListener("blur", save);
          draw();
        }
      });
    });
  });

  document.getElementById("bulk-clear")?.addEventListener("click", () => { state.selected.clear(); draw(); });
  document.getElementById("bulk-delete")?.addEventListener("click", async () => {
    const ok = await confirmDialog({ title: `Hapus ${state.selected.size} program?`, body: "Bulk delete permanen.", danger: true });
    if (!ok) return;
    for (const id of state.selected) {
      try {
        await API.deleteProgram(id);
        state.data = state.data.filter((r) => r.id !== id);
      } catch (e) { danger(`Gagal: ${e.message}`); }
    }
    state.selected.clear();
    applyFilter();
    draw();
  });

  document.querySelectorAll(".board-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openDetail({ record: rec, schema: buildSchema(rec), title: rec.Judul || rec["Program ID"] });
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
        <div class="field"><label class="field-label">Program ID</label><input class="input" id="prog-id" value="${escapeHTML(r["Program ID"] || "")}" /></div>
        <div class="field"><label class="field-label">PIC *</label>
          <select class="select" id="prog-pic" required>${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label class="field-label">Nama Program *</label><input class="input" id="prog-judul" required value="${escapeHTML(r.Judul || "")}" /></div>
      <div class="field-row">
        <div class="field"><label class="field-label">Quarter</label>
          <select class="select" id="prog-quarter">${["", "Q1", "Q2", "Q3", "Q4"].map((q) => `<option value="${q}"${r.Quarter === q ? " selected" : ""}>${q || "—"}</option>`).join("")}</select>
        </div>
        <div class="field"><label class="field-label">Tahun</label><input class="input" id="prog-tahun" type="number" value="${escapeHTML(r.Tahun || new Date().getFullYear())}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label class="field-label">Tanggal Mulai</label><input class="input" id="prog-mulai" type="date" value="${escapeHTML(r["Tanggal Mulai"] || today)}" /></div>
        <div class="field"><label class="field-label">Deadline</label><input class="input" id="prog-deadline" type="date" value="${escapeHTML(r.Deadline || today)}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label class="field-label">Progress (%)</label><input class="input" id="prog-progress" type="number" min="0" max="100" value="${escapeHTML(r.Progress ?? 0)}" /></div>
        <div class="field"><label class="field-label">Budget (Rp)</label><input class="input" id="prog-budget" type="number" value="${escapeHTML(r.Budget ?? 0)}" /></div>
        <div class="field"><label class="field-label">Status</label>
          <select class="select" id="prog-status">${["", "Planning", "On Track", "At Risk", "Delayed", "Done", "Cancelled"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s || "—"}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label class="field-label">Risiko</label><textarea class="textarea" id="prog-risiko">${escapeHTML(r.Risiko || "")}</textarea></div>
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
            "Program ID": form.querySelector("#prog-id").value,
            PIC: form.querySelector("#prog-pic").value,
            Judul: form.querySelector("#prog-judul").value,
            Quarter: form.querySelector("#prog-quarter").value,
            Tahun: form.querySelector("#prog-tahun").value,
            "Tanggal Mulai": form.querySelector("#prog-mulai").value,
            Deadline: form.querySelector("#prog-deadline").value,
            Progress: form.querySelector("#prog-progress").value,
            Budget: form.querySelector("#prog-budget").value,
            Status: form.querySelector("#prog-status").value,
            Risiko: form.querySelector("#prog-risiko").value,
          };
          try {
            if (isEdit) await API.updateProgram(record.id, data);
            else await API.createProgram(data);
            state.data = await API.listProgram(true);
            applyFilter();
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