// views/jobdesk.js — Jobdesk with List/Board/Calendar views, inline edit, bulk ops
import { API } from "../lib/api.js";
import { dataTable, wirePagination } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtDate, escapeHTML } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";
import { boardView } from "../components/board.js";
import { calendarView } from "../components/calendar.js";
import { openDetail, buildSchema } from "../components/detail.js";

let state = {
  data: [],
  filtered: [],
  view: "list", // list | board | calendar
  filterPIC: "",
  filterDate: "",
  search: "",
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  selected: new Set(),
};

export async function renderJobdesk() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  try {
    state.data = await API.listJobdesk();
  } catch (e) {
    state.data = [];
    danger(`Gagal: ${e.message}`);
  }
  applyFilter();
  draw();
}

function applyFilter() {
  state.filtered = state.data.filter((r) => {
    if (state.filterPIC && r.PIC !== state.filterPIC) return false;
    if (state.filterDate && r.Tanggal !== state.filterDate) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = `${r["Jobdesk ID"]} ${r.Aktivitas} ${r.Output} ${r.Target} ${r.PIC}`.toLowerCase();
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

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Jobdesk Harian</h1>
        <p class="t-muted t-sm">${state.filtered.length} dari ${state.data.length} entri${state.selected.size > 0 ? ` · <span class="bulk-count">${state.selected.size} dipilih</span>` : ""}</p>
      </div>
      ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah Jobdesk</button>' : ""}
    </div>

    <div class="view-tabs">
      <button class="view-tab${state.view === "list" ? " active" : ""}" data-view="list">📋 List</button>
      <button class="view-tab${state.view === "board" ? " active" : ""}" data-view="board">📊 Board</button>
      <button class="view-tab${state.view === "calendar" ? " active" : ""}" data-view="calendar">📅 Calendar</button>
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "date", label: "Tanggal", type: "search", value: state.filterDate, placeholder: "YYYY-MM-DD" },
        { id: "search", label: "Cari", type: "search", value: state.search, placeholder: "Aktivitas / output..." },
      ],
    })}

    <div id="view-area">
      ${state.view === "list" ? renderList(canEdit) : ""}
      ${state.view === "board" ? boardView({ rows: state.filtered, statusField: "Status", groupBy: "PIC" }) : ""}
      ${state.view === "calendar" ? renderCalendar() : ""}
    </div>

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
      { key: "Tanggal", label: "Tanggal", sortable: true, render: (r) => fmtDate(r.Tanggal) },
      { key: "PIC", label: "PIC", sortable: true },
      { key: "Aktivitas", label: "Jobdesk", sortable: true, truncate: true, render: (r) => `<span class="td-edit" data-field="Aktivitas" data-id="${escapeHTML(r.id)}">${escapeHTML(r.Aktivitas || "—")}</span>` },
      { key: "Target", label: "Target Output", truncate: true },
      { key: "Output", label: "Actual Output", truncate: true, render: (r) => `<span class="td-edit" data-field="Output" data-id="${escapeHTML(r.id)}">${escapeHTML(r.Output || "—")}</span>` },
      { key: "Prioritas", label: "Prioritas", render: (r) => r.Prioritas ? `<span class="pill pill-muted">${escapeHTML(r.Prioritas)}</span>` : "—" },
      { key: "Status", label: "Status", render: (r) => `<span class="td-edit" data-field="Status" data-id="${escapeHTML(r.id)}">${statusPill(r.Status)}</span>` },
      ...(canEdit
        ? [{
            key: "_actions",
            label: "",
            align: "right",
            render: (r) => `<button class="btn btn-sm btn-ghost" data-action="edit" data-id="${escapeHTML(r.id)}">Detail</button>${Session.isOwner() ? `<button class="btn btn-sm btn-ghost" data-action="delete" data-id="${escapeHTML(r.id)}" style="color:var(--danger)">×</button>` : ""}`,
          }]
        : []),
    ],
    rows: state.filtered,
    empty: "Belum ada jobdesk",
  });
}

function renderCalendar() {
  const cal = calendarView({ year: state.calYear, month: state.calMonth, rows: state.filtered });
  return cal.html;
}

function bindEvents(canEdit, picList) {
  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      draw();
    });
  });

  document.querySelectorAll("[data-cal-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.calMonth--;
      if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
      draw();
    });
  });
  document.querySelectorAll("[data-cal-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.calMonth++;
      if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
      draw();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((el) => {
    const handler = () => {
      const f = el.dataset.filter;
      if (f === "pic") state.filterPIC = el.value;
      else if (f === "date") state.filterDate = el.value;
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
        else openDetail({ record: rec, schema: buildSchema(rec), title: rec.Aktivitas || rec["Jobdesk ID"] });
      }
    });
  });

  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Hapus Jobdesk?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
      if (!ok) return;
      try {
        await API.deleteJobdesk(btn.dataset.id);
        state.data = state.data.filter((r) => r.id !== btn.dataset.id);
        applyFilter();
        success("Dihapus");
        draw();
      } catch (e) {
        danger(`Gagal: ${e.message}`);
      }
    });
  });

  // Inline edit
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
          await API.updateJobdesk(id, { [field]: val });
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
    const ok = await confirmDialog({ title: `Hapus ${state.selected.size} jobdesk?`, body: "Bulk delete permanen.", danger: true });
    if (!ok) return;
    for (const id of state.selected) {
      try {
        await API.deleteJobdesk(id);
        state.data = state.data.filter((r) => r.id !== id);
      } catch (e) { danger(`Gagal: ${e.message}`); }
    }
    state.selected.clear();
    applyFilter();
    draw();
  });

  // Board cards → detail
  document.querySelectorAll(".board-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openDetail({ record: rec, schema: buildSchema(rec), title: rec.Aktivitas || rec["Jobdesk ID"] });
    });
  });

  // Calendar items → detail
  document.querySelectorAll(".cal-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openDetail({ record: rec, schema: buildSchema(rec), title: rec.Aktivitas || rec["Jobdesk ID"] });
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
        <div class="field"><label class="field-label">Jobdesk ID</label><input class="input" id="job-id" value="${escapeHTML(r["Jobdesk ID"] || "")}" /></div>
        <div class="field"><label class="field-label">PIC *</label>
          <select class="select" id="job-pic" required>${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label class="field-label">Tanggal</label><input class="input" id="job-tanggal" type="date" value="${escapeHTML(r.Tanggal || today)}" /></div>
        <div class="field"><label class="field-label">Prioritas</label>
          <select class="select" id="job-prioritas">${["", "Low", "Medium", "High", "Urgent"].map((p) => `<option value="${p}"${r.Prioritas === p ? " selected" : ""}>${p || "—"}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label class="field-label">Jobdesk *</label><input class="input" id="job-aktivitas" required value="${escapeHTML(r.Aktivitas || "")}" /></div>
      <div class="field"><label class="field-label">Target Output</label><input class="input" id="job-target" value="${escapeHTML(r.Target || "")}" /></div>
      <div class="field"><label class="field-label">Actual Output</label><input class="input" id="job-output" value="${escapeHTML(r.Output || "")}" /></div>
      <div class="field"><label class="field-label">Status</label>
        <select class="select" id="job-status">${["To Do", "In Progress", "Done", "Blocked"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s}</option>`).join("")}</select>
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
            state.data = await API.listJobdesk(true);
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