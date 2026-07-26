// views/kpi.js — KPI CRUD with view switcher (List/Board), inline edit, bulk ops, aggregation
import { API } from "../lib/api.js";
import { dataTable, wirePagination } from "../components/table.js";
import { filterBar } from "../components/filter.js";
import { emptyState, loadingSkeleton } from "../components/empty.js";
import { statusPill } from "../components/pill.js";
import { fmtNum, fmtPct, escapeHTML, fmtIDR } from "../lib/format.js";
import { openModal, confirmDialog } from "../lib/modal.js";
import { success, danger } from "../lib/notify.js";
import { Session } from "../lib/auth.js";
import { boardView } from "../components/board.js";
import { openDetail, buildSchema } from "../components/detail.js";

function kpiBuildSchema(r) {
  const t = Number(r.Target) || 0;
  const a = Number(r.Actual) || 0;
  const ach = t > 0 ? (a / t) * 100 : 0;
  const gap = t - a;
  const fields = [
    { label: "KPI ID", value: r["KPI ID"] },
    { label: "Indikator", value: r.Indikator },
    { label: "PIC", value: r.PIC },
    { label: "Divisi", value: r.Divisi },
    { label: "Tipe", value: r.Tipe },
    { label: "Periode", value: r.Periode },
    { label: "Status", value: r.Status, html: `<span class="pill">${escapeHTML(r.Status || "—")}</span>` },
    { label: "Target", value: t, html: `<span class="t-mono">${fmtNum(t)}</span>` },
    { label: "Actual", value: a, html: `<span class="t-mono">${fmtNum(a)}</span>` },
    { label: "Achievement", value: ach, html: `<strong class="${ach >= 100 ? "ok" : ach >= 75 ? "" : "warn"}">${fmtPct(ach, 1)}</strong>` },
    { label: "Gap", value: gap, html: `<span class="t-mono">${gap > 0 ? "−" : "+"}${fmtNum(Math.abs(gap))}</span>` },
    { label: "Catatan", value: r.Catatan },
    { label: "Last Update", value: r.Edit_Time, html: r.Edit_Time ? fmtDate(r.Edit_Time) : "—" },
  ];
  return fields.filter(f => f.value != null && f.value !== "");
}

let state = {
  data: [],
  filtered: [],
  view: "list", // list | board
  groupBy: "Status", // Status | PIC | Tipe | Divisi
  filterPIC: "",
  filterStatus: "",
  search: "",
  sortKey: null,
  sortDir: "asc",
  selected: new Set(),
};

export async function renderKPI() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  try {
    state.data = await API.listKPI();
  } catch (e) {
    state.data = [];
    danger(`Gagal load KPI: ${e.message}`);
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
      const hay = `${r["KPI ID"]} ${r.Indikator} ${r.Catatan} ${r.PIC} ${r.Divisi}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (state.sortKey) {
    state.filtered.sort((a, b) => {
      const av = a[state.sortKey];
      const bv = b[state.sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), "id", { numeric: true });
      return state.sortDir === "asc" ? cmp : -cmp;
    });
  }
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
        <h1 class="h-1">KPI</h1>
        <p class="t-muted t-sm">${state.filtered.length} dari ${state.data.length} entri${state.selected.size > 0 ? ` · <span class="bulk-count">${state.selected.size} dipilih</span>` : ""}</p>
      </div>
      <div class="row gap-2">
        ${canEdit ? '<button class="btn btn-primary" id="btn-add">+ Tambah KPI</button>' : ""}
        <button class="btn btn-outline" id="btn-export" title="Export CSV (Cmd+E)">⬇ Export</button>
        <button class="btn btn-outline" id="btn-save-view" title="Simpan filter ini sebagai view">⭐ Save</button>
      </div>
    </div>

    <div class="view-tabs">
      <button class="view-tab${state.view === "list" ? " active" : ""}" data-view="list">📋 List</button>
      <button class="view-tab${state.view === "board" ? " active" : ""}" data-view="board">📊 Board</button>
    </div>

    ${filterBar({
      filters: [
        { id: "pic", label: "PIC", type: "select", value: state.filterPIC, options: picList.map((p) => ({ value: p, label: p })) },
        { id: "status", label: "Status", type: "select", value: state.filterStatus, options: statuses.map((s) => ({ value: s, label: s })) },
        { id: "search", label: "Cari", type: "search", value: state.search, placeholder: "ID / indikator / catatan..." },
      ],
    })}

    <div id="view-area">
      ${state.view === "list"
        ? renderList(canEdit)
        : boardView({ rows: state.filtered, statusField: "Status", statusOrder: statuses, groupBy: "PIC" })}
    </div>

    ${state.filtered.length > 0 ? `
      <div class="row-between mt-4" style="padding:var(--space-3) var(--space-4);background:var(--bg-1);border:1px solid var(--border-subtle);border-radius:var(--radius);font-size:var(--text-sm)">
        <span class="t-muted">Aggregasi</span>
        <div class="row gap-4">
          <span><span class="t-muted">Σ Target:</span> <strong class="t-mono">${fmtNum(aggregations.sumTarget)}</strong></span>
          <span><span class="t-muted">Σ Actual:</span> <strong class="t-mono">${fmtNum(aggregations.sumActual)}</strong></span>
          <span><span class="t-muted">Avg Achievement:</span> <strong class="t-mono">${aggregations.avgAch}%</strong></span>
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
  const picList = window.DASHBOARD_CONFIG?.picList || [];
  return dataTable({
    columns: [
      ...(canEdit ? [{ key: "_check", label: "", render: (r) => `<input type="checkbox" class="row-check" data-id="${escapeHTML(r.id)}" ${state.selected.has(r.id) ? "checked" : ""}/>` }] : []),
      { key: "KPI ID", label: "ID", sortable: true, render: (r) => `<span class="t-mono t-muted t-sm">${escapeHTML(r["KPI ID"] || "—")}</span>` },
      { key: "PIC", label: "PIC", sortable: true },
      { key: "Indikator", label: "Indikator", sortable: true, truncate: true, render: (r) => `<span class="td-edit" data-field="Indikator" data-id="${escapeHTML(r.id)}">${escapeHTML(r.Indikator || "—")}</span>` },
      { key: "Tipe", label: "Tipe", render: (r) => r.Tipe ? `<span class="pill pill-muted">${escapeHTML(r.Tipe)}</span>` : "—" },
      { key: "Target", label: "Target", sortable: true, align: "right", render: (r) => `<span class="td-edit num" data-field="Target" data-id="${escapeHTML(r.id)}">${fmtNum(r.Target)}</span>` },
      { key: "Actual", label: "Actual", sortable: true, align: "right", render: (r) => `<span class="td-edit num" data-field="Actual" data-id="${escapeHTML(r.id)}">${fmtNum(r.Actual)}</span>` },
      {
        key: "_ach",
        label: "%",
        align: "right",
        render: (r) => {
          const t = Number(r.Target);
          const a = Number(r.Actual);
          if (!t || isNaN(t) || !a) return "—";
          return fmtPct((a / t) * 100, 0);
        },
      },
      { key: "Status", label: "Status", sortable: true, render: (r) => `<span class="td-edit" data-field="Status" data-id="${escapeHTML(r.id)}">${statusPill(r.Status)}</span>` },
      ...(canEdit
        ? [
            {
              key: "_actions",
              label: "",
              align: "right",
              render: (r) =>
                `<button class="btn btn-sm btn-ghost" data-action="edit" data-id="${escapeHTML(r.id)}">Edit</button>
                 ${Session.isOwner() ? `<button class="btn btn-sm btn-ghost" data-action="delete" data-id="${escapeHTML(r.id)}" style="color:var(--danger)">×</button>` : ""}`,
            },
          ]
        : []),
    ],
    rows: state.filtered,
    onRowClick: (rec) => { const r = state.data.find(x => x.id === rec); if (r) openDetail({ record: r, schema: kpiBuildSchema(r), title: r.Indikator || r["KPI ID"], actions: [] }); },
    empty: "Belum ada data KPI",
  });
}

function computeAggregations(rows) {
  let sumTarget = 0, sumActual = 0, achCount = 0, achSum = 0;
  rows.forEach((r) => {
    const t = Number(r.Target) || 0;
    const a = Number(r.Actual) || 0;
    sumTarget += t;
    sumActual += a;
    if (t > 0 && a > 0) {
      achSum += (a / t) * 100;
      achCount++;
    }
  });
  return {
    sumTarget,
    sumActual,
    avgAch: achCount > 0 ? (achSum / achCount).toFixed(1) : "—",
  };
}

function bindEvents(canEdit, picList) {
  // View tabs
  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      draw();
    });
  });

  // Filters
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

  // Sort by header click
  document.querySelectorAll("th[data-sort-key]").forEach((th) => {
    th.addEventListener("click", () => {
      const k = th.dataset.sortKey;
      if (state.sortKey === k) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = k;
        state.sortDir = "asc";
      }
      applyFilter();
      draw();
    });
  });

  // Bulk select
  document.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) state.selected.add(id);
      else state.selected.delete(id);
      draw();
    });
  });

  // Add
  document.getElementById("btn-add")?.addEventListener("click", () => openEditor(null));

  // Export CSV
  document.getElementById("btn-export")?.addEventListener("click", async () => {
    const { exportCSV } = await import("../lib/exporter.js");
    const cols = [
      { key: "KPI ID", label: "KPI ID" },
      { key: "Indikator", label: "Indikator" },
      { key: "PIC", label: "PIC" },
      { key: "Tipe", label: "Tipe" },
      { key: "Periode", label: "Periode" },
      { key: "Divisi", label: "Divisi" },
      { key: "Target", label: "Target" },
      { key: "Realisasi", label: "Realisasi" },
      { key: "Status", label: "Status" },
      { key: "Edit_Time", label: "Last Update" },
    ];
    window.__dvb2CurrentData = state.filtered;
    window.__dvb2CurrentCols = cols;
    exportCSV(state.filtered, cols, `KPI-${new Date().toISOString().split("T")[0]}.csv`);
    success(`Exported ${state.filtered.length} entries`);
  });

  // Save View
  document.getElementById("btn-save-view")?.addEventListener("click", async () => {
    const name = prompt("Nama view ini:", `KPI ${new Date().toLocaleDateString("id-ID")}`);
    if (!name) return;
    const { saveView } = await import("../lib/saved-views.js");
    saveView("kpi", name, {
      filterPIC: state.filterPIC,
      filterTipe: state.filterTipe,
      filterStatus: state.filterStatus,
      search: state.search,
    });
    success(`View "${name}" tersimpan`);
  });

  // Edit (button)
  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const rec = state.data.find((r) => r.id === btn.dataset.id);
      if (rec) {
        if (canEdit && Session.isOwner()) openEditor(rec);
        else openDetail({ record: rec, schema: buildSchema(rec), title: rec.Indikator || rec["KPI ID"], actions: [
        { key: "rollup", label: "🔗 Related Items", variant: "btn-outline", onClick: async (r) => {
          const { kpiRollup } = await import("../lib/rollup.js");
          const data = await kpiRollup(r.Indikator || r["KPI ID"]);
          const { openModal } = await import("../lib/modal.js");
          openModal({
            title: "Cross-DB Rollup: " + (r.Indikator || r["KPI ID"]),
            body: (() => {
              const div = document.createElement("div");
              div.innerHTML = `<p>${data.summary}</p>
                <h4>Jobdesk (${data.jobdesk.length})</h4>
                <ul>${data.jobdesk.map(j => `<li>${j.Aktivitas} — <em>${j.Status}</em></li>`).join("") || "<li>—</li>"}</ul>
                <h4>Program (${data.program.length})</h4>
                <ul>${data.program.map(p => `<li>${p.Judul} — <em>${p.Progress}%</em></li>`).join("") || "<li>—</li>"}</ul>
                <h4>SOW (${data.sow.length})</h4>
                <ul>${data.sow.map(s => `<li>${s.Deskripsi} — <em>${s.Status}</em></li>`).join("") || "<li>—</li>"}</ul>`;
              return div;
            })(),
            actions: [{ label: "Tutup", variant: "btn-ghost" }],
          });
        }},
      ] });
      }
    });
  });

  // Delete
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ok = await confirmDialog({ title: "Hapus KPI?", body: "Tindakan tidak dapat dibatalkan.", danger: true });
      if (!ok) return;
      try {
        await API.deleteKPI(id);
        state.data = state.data.filter((r) => r.id !== id);
        success("KPI dihapus");
        applyFilter();
        draw();
      } catch (e) {
        danger(`Gagal: ${e.message}`);
      }
    });
  });

  // Inline edit (click cell)
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
      input.select();
      const save = async () => {
        const val = input.value;
        td.classList.remove("td-edit-saving");
        try {
          await API.updateKPI(id, { [field]: val });
          rec[field] = val;
          success("Disimpan");
          applyFilter();
          draw();
        } catch (e) {
          danger(`Gagal: ${e.message}`);
          draw();
        }
      };
      const cancel = () => draw();
      input.addEventListener("blur", save);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        else if (e.key === "Escape") {
          input.removeEventListener("blur", save);
          cancel();
        }
      });
    });
  });

  // Bulk clear/delete
  document.getElementById("bulk-clear")?.addEventListener("click", () => {
    state.selected.clear();
    draw();
  });
  document.getElementById("bulk-delete")?.addEventListener("click", async () => {
    const ok = await confirmDialog({ title: `Hapus ${state.selected.size} KPI?`, body: "Bulk delete permanen.", danger: true });
    if (!ok) return;
    for (const id of state.selected) {
      try {
        await API.deleteKPI(id);
        state.data = state.data.filter((r) => r.id !== id);
      } catch (e) {
        danger(`Gagal hapus ${id}: ${e.message}`);
      }
    }
    state.selected.clear();
    applyFilter();
    draw();
    success("Bulk delete selesai");
  });

  // Board cards click → detail
  document.querySelectorAll(".board-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const rec = state.data.find((r) => r.id === id);
      if (rec) openDetail({ record: rec, schema: kpiBuildSchema(rec), title: rec.Indikator || rec["KPI ID"] });
    });
  });
}

function openEditor(record) {
  const isEdit = !!record;
  const r = record || {};
  const picList = window.DASHBOARD_CONFIG?.picList || [];

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="col gap-3">
      <div class="field-row">
        <div class="field"><label class="field-label">KPI ID</label><input class="input" id="kpi-id" value="${escapeHTML(r["KPI ID"] || "")}" /></div>
        <div class="field"><label class="field-label">PIC *</label>
          <select class="select" id="kpi-pic" required>${picList.map((p) => `<option value="${escapeHTML(p)}"${r.PIC === p ? " selected" : ""}>${escapeHTML(p)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label class="field-label">Indikator *</label><input class="input" id="kpi-indikator" required value="${escapeHTML(r.Indikator || "")}" /></div>
      <div class="field-row">
        <div class="field"><label class="field-label">Tipe</label>
          <select class="select" id="kpi-tipe">${["", "Kuantitatif", "Kualitatif"].map((t) => `<option value="${t}"${r.Tipe === t ? " selected" : ""}>${t || "—"}</option>`).join("")}</select>
        </div>
        <div class="field"><label class="field-label">Periode</label>
          <select class="select" id="kpi-periode">${["", "Mingguan", "Bulanan", "Kuartalan", "Tahunan"].map((p) => `<option value="${p}"${r.Periode === p ? " selected" : ""}>${p || "—"}</option>`).join("")}</select>
        </div>
        <div class="field"><label class="field-label">Satuan</label>
          <select class="select" id="kpi-satuan">${["", "Unit", "Unit %", "Rp", "Orang", "Hari"].map((s) => `<option value="${s}"${r.Satuan === s ? " selected" : ""}>${s || "—"}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label class="field-label">Target</label><input class="input" id="kpi-target" type="number" value="${escapeHTML(r.Target ?? "")}" /></div>
        <div class="field"><label class="field-label">Actual</label><input class="input" id="kpi-actual" type="number" value="${escapeHTML(r.Actual ?? "")}" /></div>
        <div class="field"><label class="field-label">Status</label>
          <select class="select" id="kpi-status">${["", "On Track", "At Risk", "Off Track", "Achieved"].map((s) => `<option value="${s}"${r.Status === s ? " selected" : ""}>${s || "—"}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field"><label class="field-label">Catatan</label><textarea class="textarea" id="kpi-catatan">${escapeHTML(r.Catatan || "")}</textarea></div>
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
          const data = {
            "KPI ID": form.querySelector("#kpi-id").value,
            PIC: form.querySelector("#kpi-pic").value,
            Indikator: form.querySelector("#kpi-indikator").value,
            Tipe: form.querySelector("#kpi-tipe").value,
            Periode: form.querySelector("#kpi-periode").value,
            Satuan: form.querySelector("#kpi-satuan").value,
            Target: form.querySelector("#kpi-target").value,
            Actual: form.querySelector("#kpi-actual").value,
            Status: form.querySelector("#kpi-status").value,
            Catatan: form.querySelector("#kpi-catatan").value,
          };
          try {
            if (isEdit) await API.updateKPI(record.id, data, record._editTime);
            else await API.createKPI(data);
            state.data = await API.listKPI(true);
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