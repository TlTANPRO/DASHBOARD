// views/partials.js — Reusable partials: kpi-card, table, kanban, empty,
// search, view-switcher, inline-edit, bulk-bar, aggregation-footer.
// Beat-Notion UX primitives.

import { formatNumber, formatPercent, formatDate, initials } from "../lib/format.js";
import { downloadCsv } from "../lib/export.js";
import { getCurrentUser } from "../auth.js";
import { fetchData } from "../ssot.js";
import { h, build } from "../lib/dom.js";

// ============================================================
// Score card
// ============================================================
export function kpiCard({ label, value, target, unit = "num", chip, accent = false, delta }) {
  const card = document.createElement("div");
  card.className = `scorecard ${accent ? "scorecard--accent" : ""}`;
  card.appendChild(h("span", { class: "scorecard__label" }, label));
  card.appendChild(h("span", { class: "scorecard__value num" }, value));
  if (delta) card.appendChild(h("span", { class: `scorecard__delta scorecard__delta--${delta.kind || "flat"}` }, delta.text));
  if (chip) card.appendChild(h("span", { class: `chip chip--${chip.kind || "info"}` }, chip.text));
  if (target) card.appendChild(h("span", { class: "scorecard__delta scorecard__delta--flat" }, `target: ${target}`));
  return card;
}

// ============================================================
// Section label (01-N numbered, TITAN V23 DNA)
// ============================================================
export function sectionLabel(index, title, sub) {
  const wrap = document.createElement("div");
  wrap.className = "section-label";
  wrap.appendChild(h("span", { class: "section-label__index" }, String(index).padStart(2, "0")));
  wrap.appendChild(h("span", { class: "section-label__title" }, title));
  if (sub) wrap.appendChild(h("span", { class: "section-label__sub" }, sub));
  return wrap;
}

// ============================================================
// Data table with: search, filter, sort, view-switch, bulk, inline edit, CSV
// ============================================================
export function dataTable({
  columns,
  rows = [],
  evidenceRequired = false,
  exportable = false,
  exportName = "export",
  searchable = true,
  sortable = true,
  viewModes = null,        // null = list-only, ["list","board"] for switcher
  groupBy = null,          // for board view: { key, columns: [{id,label,match}] }
  editable = false,        // show inline edit affordance
  onEdit = null,           // (row, colKey, newValue) => Promise<void>
  bulkActions = null,      // [{label, kind, onClick: (selected) => void}]
  aggregation = null,      // { label, fn: (rows) => string }
  idKey = "_id",           // unique key for row selection
  emptyText = "Tidak ada data",
}) {
  const root = document.createElement("div");
  root.className = "table-shell";

  // ---- internal state ----
  let state = {
    q: "",
    sortKey: null,
    sortDir: "asc",
    view: "list",
    selected: new Set(),
    filters: {},
  };

  // Normalize rows with stable _id
  const baseRows = rows.map((r, i) => ({ ...r, [idKey]: r[idKey] ?? `row-${i}` }));

  // ---- header toolbar ----
  const toolbar = document.createElement("div");
  toolbar.className = "table-toolbar";

  // search
  let searchInput = null;
  if (searchable) {
    searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "input table-toolbar__search";
    searchInput.placeholder = "Cari di tabel…";
    searchInput.addEventListener("input", (e) => { state.q = e.target.value; render(); });
    toolbar.appendChild(searchInput);
  }

  // per-column filters (select from distinct values)
  columns.filter(c => c.filter).forEach(c => {
    const sel = document.createElement("select");
    sel.className = "select table-toolbar__filter";
    sel.innerHTML = `<option value="">${escapeHtml(c.filterLabel || c.label)}</option>`;
    const distinct = [...new Set(baseRows.map(r => String(r[c.key] ?? "")))].sort();
    distinct.forEach(v => {
      const o = document.createElement("option");
      o.value = v; o.textContent = v || "—";
      sel.appendChild(o);
    });
    sel.addEventListener("change", (e) => {
      if (e.target.value) state.filters[c.key] = e.target.value; else delete state.filters[c.key];
      render();
    });
    toolbar.appendChild(sel);
  });

  // view switcher
  if (viewModes && viewModes.length > 1) {
    const switcher = document.createElement("div");
    switcher.className = "view-switcher";
    viewModes.forEach(v => {
      const b = document.createElement("button");
      b.className = "view-switcher__btn" + (v === state.view ? " is-active" : "");
      b.textContent = v === "list" ? "List" : v === "board" ? "Board" : v === "gantt" ? "Gantt" : v === "calendar" ? "Calendar" : v;
      b.dataset.view = v;
      b.addEventListener("click", () => { state.view = v; render(); });
      switcher.appendChild(b);
    });
    toolbar.appendChild(switcher);
  }

  // count display
  const count = document.createElement("span");
  count.className = "table-toolbar__count";
  toolbar.appendChild(count);

  // export + new
  if (exportable) {
    const btn = document.createElement("button");
    btn.className = "chip chip--accent table-toolbar__btn";
    btn.textContent = "Export CSV";
    btn.onclick = () => downloadCsv(exportName, filteredRows());
    toolbar.appendChild(btn);
  }
  if (editable && getCurrentUser()?.is_owner) {
    const addBtn = document.createElement("button");
    addBtn.className = "chip chip--accent table-toolbar__btn";
    addBtn.textContent = "+ Tambah";
    addBtn.onclick = () => {
      const newRow = prompt("Konten baris baru (format: " + columns.map(c => c.label).join(" | ") + ")");
      if (newRow && onEdit) {
        const parts = newRow.split("|").map(s => s.trim());
        const row = { [idKey]: `row-${Date.now()}` };
        columns.forEach((c, i) => { row[c.key] = parts[i] || ""; });
        onEdit(row, "__new__", null).then(() => render());
      }
    };
    toolbar.appendChild(addBtn);
  }

  root.appendChild(toolbar);

  // ---- bulk bar (shown when ≥1 selected) ----
  const bulkBar = document.createElement("div");
  bulkBar.className = "bulk-bar";
  bulkBar.hidden = true;

  // ---- body ----
  const body = document.createElement("div");
  body.className = "table-body";
  root.appendChild(bulkBar);
  root.appendChild(body);

  // ---- aggregation footer ----
  const aggEl = document.createElement("div");
  aggEl.className = "agg-footer";
  root.appendChild(aggEl);

  // ---- core filter+sort logic ----
  function filteredRows() {
    const q = state.q.trim().toLowerCase();
    let out = baseRows.filter(r => {
      if (q && !columns.some(c => {
        const searchable = c.searchable !== false;
        const v = r[c.key] ?? "";
        return String(v).toLowerCase().includes(q) && searchable;
      })) return false;
      for (const [k, v] of Object.entries(state.filters)) {
        if (String(r[k] ?? "") !== v) return false;
      }
      return true;
    });
    if (state.sortKey) {
      const k = state.sortKey;
      out = [...out].sort((a, b) => {
        const av = a[k], bv = b[k];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") return state.sortDir === "asc" ? av - bv : bv - av;
        return state.sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }

  function renderList() {
    body.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");
    table.className = "table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    // select-all checkbox column
    if (bulkActions) {
      const th = document.createElement("th");
      th.style.width = "32px";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.addEventListener("change", () => {
        const rows = filteredRows();
        if (cb.checked) rows.forEach(r => state.selected.add(r[idKey]));
        else rows.forEach(r => state.selected.delete(r[idKey]));
        renderBulkBar();
        updateRowCheckboxes();
      });
      th.appendChild(cb);
      headRow.appendChild(th);
    }

    columns.forEach(c => {
      const th = document.createElement("th");
      if (c.numeric) th.className = "num";
      if (sortable && c.sortable !== false) {
        th.style.cursor = "pointer";
        th.title = "Klik untuk sort";
        th.addEventListener("click", () => {
          if (state.sortKey === c.key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
          else { state.sortKey = c.key; state.sortDir = "asc"; }
          render();
        });
        th.innerHTML = `${escapeHtml(c.label)} ${state.sortKey === c.key ? (state.sortDir === "asc" ? "↑" : "↓") : ""}`;
      } else {
        th.textContent = c.label;
      }
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const rows = filteredRows();
    if (rows.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="${columns.length + (bulkActions ? 1 : 0)}"><div class="empty"><div class="empty__title">${escapeHtml(emptyText)}</div></div></td>`;
      tbody.appendChild(tr);
    } else {
      for (const row of rows) {
        const tr = document.createElement("tr");
        if (bulkActions) {
          const td = document.createElement("td");
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.checked = state.selected.has(row[idKey]);
          cb.addEventListener("change", () => {
            if (cb.checked) state.selected.add(row[idKey]);
            else state.selected.delete(row[idKey]);
            renderBulkBar();
          });
          td.appendChild(cb);
          tr.appendChild(td);
        }
        for (const c of columns) {
          const td = document.createElement("td");
          if (c.numeric) td.className = "num";
          const v = typeof c.value === "function" ? c.value(row) : row[c.key];
          if (c.mono) td.classList.add("u-mono");
          if (c.truncate) {
            td.classList.add("u-truncate");
            td.title = String(v ?? "—");
          }

          // evidence warning
          if (c.key === "evidence_required" && evidenceRequired && !row.evidence) {
            const span = document.createElement("span");
            span.className = "evidence-missing";
            span.textContent = "Evidence belum diupload";
            td.appendChild(span);
            tr.appendChild(td);
            continue;
          }

          // status chip
          if (c.chip) {
            const chip = document.createElement("span");
            chip.className = `chip chip--${c.chip(row) || "info"}`;
            chip.textContent = v ?? "—";
            td.appendChild(chip);
          } else if (c.badge) {
            const b = document.createElement("span");
            b.className = `chip chip--${c.badge(row)}`;
            b.textContent = v ?? "—";
            td.appendChild(b);
          } else if (c.avatar) {
            const a = document.createElement("span");
            a.className = "row-avatar";
            a.textContent = initials(row[c.avatar] || v);
            a.title = v ?? "";
            td.appendChild(a);
            td.appendChild(document.createTextNode(" " + (v ?? "—")));
          } else {
            td.textContent = v ?? "—";
          }
          // inline edit
          if (editable && c.editable !== false && onEdit) {
            td.style.cursor = "pointer";
            td.title = "Klik untuk edit";
            td.addEventListener("click", (e) => {
              if (e.target.tagName === "INPUT") return;
              const cur = v ?? "";
              const input = document.createElement("input");
              input.type = c.editType || "text";
              input.className = "input input--inline";
              input.value = cur;
              input.style.width = "100%";
              td.textContent = "";
              td.appendChild(input);
              input.focus();
              input.select();
              const save = async () => {
                const newVal = input.value;
                td.textContent = newVal;
                await onEdit(row, c.key, newVal);
              };
              input.addEventListener("blur", save);
              input.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter") input.blur();
                if (ev.key === "Escape") { td.textContent = cur; }
              });
            });
          }
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);
  }

  function updateRowCheckboxes() {
    body.querySelectorAll("tbody tr").forEach(tr => {
      const cb = tr.querySelector("input[type=checkbox]");
      if (cb) cb.checked = state.selected.has(tr.dataset.rid);
    });
  }

  function renderBoard() {
    body.innerHTML = "";
    if (!groupBy) { body.appendChild(empty({ title: "Board butuh groupBy" })); return; }
    const rows = filteredRows();
    const groups = {};
    for (const c of groupBy.columns) groups[c.id] = [];
    for (const r of rows) {
      const v = r[groupBy.key];
      const match = groupBy.columns.find(c => c.match(v));
      const id = match ? match.id : "other";
      if (!groups[id]) groups[id] = [];
      groups[id].push(r);
    }
    const board = document.createElement("div");
    board.className = "kanban";
    for (const col of groupBy.columns) {
      const colEl = document.createElement("div");
      colEl.className = "kanban__col";
      colEl.dataset.col = col.id;
      const head = document.createElement("div");
      head.className = "kanban__col-title";
      const items = groups[col.id] || [];
      head.textContent = `${col.label} (${items.length})`;
      colEl.appendChild(head);
      for (const it of items) {
        const card = document.createElement("div");
        card.className = "kanban__item";
        const title = columns.find(c => c.boardTitle)?.value?.(it) || it[columns[0].key] || "—";
        const meta = columns.filter(c => c.boardMeta).map(c => c.boardMeta + ": " + (c.value ? c.value(it) : it[c.key])).join(" · ");
        card.innerHTML = `<div>${escapeHtml(title)}</div>${meta ? `<div class="kanban__item-meta">${escapeHtml(meta)}</div>` : ""}`;
        colEl.appendChild(card);
      }
      if (items.length === 0) {
        const e = document.createElement("div");
        e.className = "empty";
        e.style.padding = "12px";
        e.innerHTML = `<span class="empty__title" style="font-size:12px">Kosong</span>`;
        colEl.appendChild(e);
      }
      board.appendChild(colEl);
    }
    body.appendChild(board);
  }

  function renderGantt() {
    body.innerHTML = "";
    const rows = filteredRows();
    const startCol = columns.find(c => c.ganttStart);
    const endCol = columns.find(c => c.ganttEnd);
    const labelCol = columns.find(c => c.ganttLabel) || columns[0];
    if (!startCol || !endCol) { body.appendChild(empty({ title: "Gantt butuh ganttStart + ganttEnd" })); return; }
    const wrap = document.createElement("div");
    wrap.className = "gantt";
    for (const r of rows) {
      const s = parseFloat(r[startCol.key]);
      const e = parseFloat(r[endCol.key]);
      if (isNaN(s) || isNaN(e)) continue;
      const row = document.createElement("div");
      row.className = "gantt__row";
      row.innerHTML = `
        <div class="gantt__row-label">${escapeHtml(r[labelCol.key] ?? "—")}</div>
        <div class="gantt__row-track">
          <div class="gantt__bar" style="left:${s}%;width:${Math.max(2, e - s)}%">${escapeHtml(r[labelCol.key + "_sub"] || "")}</div>
        </div>`;
      wrap.appendChild(row);
    }
    body.appendChild(wrap);
  }

  function renderCalendar() {
    body.innerHTML = "";
    const rows = filteredRows();
    const dateCol = columns.find(c => c.calendarDate);
    if (!dateCol) { body.appendChild(empty({ title: "Calendar butuh calendarDate" })); return; }
    const items = rows.map(r => ({ date: r[dateCol.key], row: r })).filter(x => x.date);
    if (items.length === 0) { body.appendChild(empty({ title: "Tidak ada tanggal" })); return; }
    const months = {};
    items.forEach(it => {
      const d = new Date(it.date);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[k]) months[k] = [];
      months[k].push(it);
    });
    const wrap = document.createElement("div");
    wrap.style.display = "grid";
    wrap.style.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
    wrap.style.gap = "var(--space-4)";
    for (const [k, list] of Object.entries(months).sort()) {
      const card = document.createElement("div");
      card.className = "card";
      const [y, m] = k.split("-");
      const monthName = new Date(y, parseInt(m) - 1, 1).toLocaleString("id-ID", { month: "long", year: "numeric" });
      card.innerHTML = `<div class="card__head"><div class="card__title">${monthName}</div><span class="chip">${list.length}</span></div>`;
      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";
      ul.style.margin = "0";
      for (const it of list.sort((a, b) => new Date(a.date) - new Date(b.date))) {
        const d = new Date(it.date);
        const title = columns[0].value ? columns[0].value(it.row) : it.row[columns[0].key];
        const li = document.createElement("li");
        li.style.padding = "6px 0";
        li.style.borderTop = "1px solid var(--color-border)";
        li.style.fontSize = "var(--text-sm)";
        li.innerHTML = `<strong>${d.getDate()}</strong> · ${escapeHtml(title ?? "—")}`;
        ul.appendChild(li);
      }
      card.appendChild(ul);
      wrap.appendChild(card);
    }
    body.appendChild(wrap);
  }

  function renderBulkBar() {
    if (!bulkActions || state.selected.size === 0) { bulkBar.hidden = true; return; }
    bulkBar.hidden = false;
    bulkBar.innerHTML = `<span class="bulk-bar__count">${state.selected.size} dipilih</span>`;
    bulkActions.forEach(a => {
      const b = document.createElement("button");
      b.className = `chip chip--${a.kind || "accent"} bulk-bar__btn`;
      b.textContent = a.label;
      b.onclick = () => {
        const sel = baseRows.filter(r => state.selected.has(r[idKey]));
        a.onClick(sel);
        state.selected.clear();
        render();
      };
      bulkBar.appendChild(b);
    });
    const cancel = document.createElement("button");
    cancel.className = "chip bulk-bar__btn";
    cancel.textContent = "Batal";
    cancel.onclick = () => { state.selected.clear(); render(); };
    bulkBar.appendChild(cancel);
  }

  function renderAgg() {
    if (!aggregation) { aggEl.innerHTML = ""; return; }
    const rows = filteredRows();
    aggEl.innerHTML = `<span class="agg-footer__label">${escapeHtml(aggregation.label)}:</span> <span class="agg-footer__value num">${escapeHtml(aggregation.fn(rows))}</span>`;
  }

  function renderCount() {
    const rows = filteredRows();
    count.textContent = `${rows.length} / ${baseRows.length} baris`;
  }

  function render() {
    renderBulkBar();
    if (state.view === "list") renderList();
    else if (state.view === "board") renderBoard();
    else if (state.view === "gantt") renderGantt();
    else if (state.view === "calendar") renderCalendar();
    else renderList();
    renderAgg();
    renderCount();
    // sync view-switcher active class
    root.querySelectorAll(".view-switcher__btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.view === state.view);
    });
  }

  render();
  return root;
}

// ============================================================
// Kanban (legacy, simple, kept for backward compat)
// ============================================================
export function kanbanBoard({ columns, cards }) {
  const wrap = document.createElement("div");
  wrap.className = "kanban";
  for (const col of columns) {
    const div = document.createElement("div");
    div.className = "kanban__col";
    const head = document.createElement("div");
    head.className = "kanban__col-title";
    head.textContent = col.label;
    div.appendChild(head);
    const items = cards[col.id] || [];
    for (const item of items) {
      const card = document.createElement("div");
      card.className = "kanban__item";
      card.innerHTML = `
        <div>${escapeHtml(item.title)}</div>
        ${item.meta ? `<div class="kanban__item-meta">${escapeHtml(item.meta)}</div>` : ""}
      `;
      div.appendChild(card);
    }
    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.style.padding = "12px";
      empty.innerHTML = `<span class="empty__title" style="font-size:12px">Kosong</span>`;
      div.appendChild(empty);
    }
    wrap.appendChild(div);
  }
  return wrap;
}

// ============================================================
// Gantt (legacy)
// ============================================================
export function gantt({ rows }) {
  const wrap = document.createElement("div");
  wrap.className = "gantt";
  for (const r of rows) {
    const row = document.createElement("div");
    row.className = "gantt__row";
    row.innerHTML = `
      <div class="gantt__row-label">${escapeHtml(r.name)}</div>
      <div class="gantt__row-track">
        <div class="gantt__bar" style="left:${r.start}%;width:${Math.max(2, r.end - r.start)}%;background:${r.color || "var(--color-accent)"}">${escapeHtml(r.label || "")}</div>
      </div>
    `;
    wrap.appendChild(row);
  }
  return wrap;
}

// ============================================================
// Empty / banner
// ============================================================
export function empty({ title = "Tidak ada data", sub = "" } = {}) {
  const div = document.createElement("div");
  div.className = "empty";
  div.innerHTML = `
    <div class="empty__title">${escapeHtml(title)}</div>
    ${sub ? `<div>${escapeHtml(sub)}</div>` : ""}
  `;
  return div;
}

export function evidenceBanner(missingCount) {
  if (!missingCount) return null;
  const div = document.createElement("div");
  div.className = "banner banner--cached";
  div.appendChild(h("span", { class: "banner__text" }, `${missingCount} KPI belum diupload evidence — buka Notion untuk upload`));
  return div;
}

// ============================================================
// Escape HTML
// ============================================================
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
// Global Cmd+K search palette
// ============================================================
let paletteMounted = false;
export function mountGlobalSearch() {
  if (paletteMounted) return;
  paletteMounted = true;

  const overlay = document.createElement("div");
  overlay.className = "search-palette";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="search-palette__panel" role="dialog" aria-label="Pencarian global">
      <input type="search" class="search-palette__input" name="cmdk-input" id="cmdk-input" placeholder="Cari PIC, KPI, jobdesk…" autocomplete="off" />
      <div class="search-palette__results" id="cmdk-results"></div>
      <div class="search-palette__hint">↑↓ pilih · ↵ buka · esc tutup</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#cmdk-input");
  const results = overlay.querySelector("#cmdk-results");
  let cursor = 0;
  let items = [];

  // Cmd+K / Ctrl+K
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.hidden = false;
      input.value = "";
      input.focus();
      search("");
    }
    if (e.key === "Escape" && !overlay.hidden) { overlay.hidden = true; }
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.hidden = true; });
  input.addEventListener("input", (e) => search(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { cursor = Math.min(items.length - 1, cursor + 1); updateCursor(); }
    else if (e.key === "ArrowUp") { cursor = Math.max(0, cursor - 1); updateCursor(); }
    else if (e.key === "Enter") {
      const it = items[cursor];
      if (it) { it.onSelect(); overlay.hidden = true; }
    }
  });

  async function search(q) {
    q = q.trim().toLowerCase();
    items = [];
    cursor = 0;

    // Always: nav targets
    const navItems = [
      { label: "Owner", sub: "01 — KPI perusahaan + ranking PIC", onSelect: () => location.hash = "#/owner" },
      { label: "Legal", sub: "02 — SOW + izin kanban", onSelect: () => location.hash = "#/legal" },
      { label: "Marketing", sub: "03 — Lead funnel + pipeline", onSelect: () => location.hash = "#/marketing" },
      { label: "Admin", sub: "04 — Jobdesk + SP3K + overdue", onSelect: () => location.hash = "#/admin" },
      { label: "Proyek", sub: "05 — Gantt + budget variance", onSelect: () => location.hash = "#/proyek" },
      { label: "Media", sub: "06 — Konten + engagement", onSelect: () => location.hash = "#/media" },
    ];

    // search across all loaded data
    try {
      const [perusahaan, divisi, personal, jobdesk, people, sow] = await Promise.all([
        fetchData("kpi-perusahaan.json").catch(() => null),
        fetchData("kpi-divisi.json").catch(() => null),
        fetchData("kpi-personal.json").catch(() => null),
        fetchData("jobdesk.json").catch(() => null),
        fetchData("people.json").catch(() => null),
        fetchData("sow.json").catch(() => null),
      ]);

      // PIC roster
      (people?.people || []).forEach(p => {
        if (!q || p.nama.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)) {
          items.push({
            label: p.nama, sub: `${p.divisi} · ${p.role}`,
            onSelect: () => { location.hash = `#/${p.divisi}`; }
          });
        }
      });

      // KPI personal
      (personal?.rows || []).forEach(k => {
        if (!q || k.kpi.toLowerCase().includes(q) || (k.pic || "").toLowerCase().includes(q)) {
          items.push({
            label: k.kpi, sub: `${k.pic} · target ${k.target || "—"}`,
            onSelect: () => {
              const div = (people?.people || []).find(p => p.nama === k.pic)?.divisi || "owner";
              location.hash = `#/${div}`;
            }
          });
        }
      });

      // KPI divisi
      (divisi?.divisi || []).forEach(d => {
        d.kpis.forEach(k => {
          if (!q || k.indikator.toLowerCase().includes(q)) {
            items.push({
              label: k.indikator, sub: `${d.nama} · target ${k.target || "—"}`,
              onSelect: () => location.hash = `#/${d.slug}`
            });
          }
        });
      });

      // Jobdesk
      (jobdesk?.jobdesk || []).forEach(j => {
        (j.harian || []).forEach(h => {
          if (!q || h.kegiatan.toLowerCase().includes(q)) {
            items.push({
              label: h.kegiatan, sub: `${j.pic} · ${h.jam}`,
              onSelect: () => location.hash = "#/admin"
            });
          }
        });
      });

      // SOW
      (sow?.sow || []).forEach(s => {
        (s.items || []).forEach(it => {
          if (!q || it.toLowerCase().includes(q)) {
            items.push({
              label: it, sub: `SOW ${s.pic}`,
              onSelect: () => {
                const div = (people?.people || []).find(p => p.nama === s.pic)?.divisi || "owner";
                location.hash = `#/${div}`;
              }
            });
          }
        });
      });
    } catch (e) {
      console.warn("[cmdk] data fetch failed", e);
    }

    // Add nav items only if no q or matches a divisi label
    if (!q || navItems.some(n => n.label.toLowerCase().includes(q))) {
      items = [...navItems.filter(n => !q || n.label.toLowerCase().includes(q)), ...items];
    }

    // Limit
    items = items.slice(0, 30);

    // Render
    results.innerHTML = "";
    items.forEach((it, i) => {
      const row = document.createElement("div");
      row.className = "search-palette__item" + (i === 0 ? " is-active" : "");
      row.innerHTML = `<div class="search-palette__item-label">${escapeHtml(it.label)}</div><div class="search-palette__item-sub">${escapeHtml(it.sub)}</div>`;
      row.addEventListener("click", () => { it.onSelect(); overlay.hidden = true; });
      results.appendChild(row);
    });
    cursor = 0;
    updateCursor();
  }

  function updateCursor() {
    results.querySelectorAll(".search-palette__item").forEach((el, i) => {
      el.classList.toggle("is-active", i === cursor);
    });
  }
}

// ============================================================
// Toast helper (replaces alert())
// ============================================================
export function toast(message, kind = "info", ms = 3000) {
  const cont = document.getElementById("toast-container") || (() => {
    const c = document.createElement("div");
    c.id = "toast-container";
    c.className = "toast-container";
    document.body.appendChild(c);
    return c;
  })();
  const t = document.createElement("div");
  t.className = `toast toast--${kind}`;
  t.textContent = message;
  cont.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 200ms";
    setTimeout(() => t.remove(), 250);
  }, ms);
}
