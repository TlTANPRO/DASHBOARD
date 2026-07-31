// Syahfalah OS · Views
// Each view: async function(params) renders into #view.

const Views = {};

const el = (tag, attrs = {}, children = []) => {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) e.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
};

const StatusBadge = (status) => {
  const map = {
    todo: { label: 'To do', cls: 's-todo' },
    in_progress: { label: 'In progress', cls: 's-prog' },
    blocked: { label: 'Blocked', cls: 's-block' },
    done: { label: 'Done', cls: 's-done' },
    cancelled: { label: 'Cancelled', cls: 's-cancel' },
  };
  const s = map[status] || map.todo;
  return el('span', { class: `badge-status ${s.cls}` }, s.label);
};

const DivisiBadge = (divisi) => {
  return el('span', { class: `badge-divisi d-${divisi.toLowerCase()}` }, divisi);
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) { return iso; }
};

const fmtRelative = (iso) => {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}d lalu`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}j lalu`;
  const day = Math.floor(hr / 24);
  return `${day}h lalu`;
};

// === HOME ===
Views.home = async () => {
  const state = await State.get();
  const root = document.getElementById('view');

  // Stats
  const total = state.jobdesk.length;
  const done = state.jobdesk.filter(j => j.status === 'done').length;
  const inProg = state.jobdesk.filter(j => j.status === 'in_progress').length;
  const blocked = state.jobdesk.filter(j => j.status === 'blocked').length;
  const overdue = state.jobdesk.filter(j => j.deadline && new Date(j.deadline) < new Date() && j.status !== 'done').length;

  const hero = el('section', { class: 'view-hero' }, [
    el('h1', { class: 'view-title' }, 'Home · Status 12 PIC'),
    el('p', { class: 'view-lede' }, 'Ringkasan real-time. Klik PIC untuk lihat jobdesk.'),
    el('div', { class: 'stat-grid' }, [
      el('div', { class: 'stat-card' }, [el('div', { class: 'stat-val' }, String(total)), el('div', { class: 'stat-lbl' }, 'Total task')]),
      el('div', { class: 'stat-card stat-done' }, [el('div', { class: 'stat-val' }, String(done)), el('div', { class: 'stat-lbl' }, 'Done')]),
      el('div', { class: 'stat-card stat-prog' }, [el('div', { class: 'stat-val' }, String(inProg)), el('div', { class: 'stat-lbl' }, 'In progress')]),
      el('div', { class: 'stat-card stat-block' }, [el('div', { class: 'stat-val' }, String(blocked)), el('div', { class: 'stat-lbl' }, 'Blocked')]),
      el('div', { class: 'stat-card stat-over' }, [el('div', { class: 'stat-val' }, String(overdue)), el('div', { class: 'stat-lbl' }, 'Overdue')]),
    ]),
  ]);

  // PIC grid
  const picCards = state.pic.map((p) => {
    const tasks = state.jobdesk.filter(j => j.pic_id === p.id);
    const done = tasks.filter(t => t.status === 'done').length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const cls = pct >= 80 ? 'pic-done' : pct >= 40 ? 'pic-prog' : 'pic-low';
    return el('a', {
      class: `pic-card ${cls}`,
      href: `/pic/${p.id}`,
      onclick: (e) => { e.preventDefault(); Router.navigate(`/pic/${p.id}`); },
    }, [
      el('div', { class: 'pic-card-head' }, [
        el('span', { class: 'pic-id' }, p.id),
        DivisiBadge(p.divisi),
      ]),
      el('div', { class: 'pic-name' }, p.nama),
      el('div', { class: 'pic-role' }, p.peran),
      el('div', { class: 'pic-meta' }, `${tasks.length} task · ${done} done · ${pct}%`),
    ]);
  });

  const grid = el('div', { class: 'pic-grid' }, picCards);

  root.appendChild(hero);
  root.appendChild(el('h2', { class: 'view-h2' }, 'PIC roster'));
  root.appendChild(grid);
};

// === PIC DETAIL ===
Views.pic = async ({ id }) => {
  const state = await State.get();
  const pic = state.pic.find(p => p.id === id);
  if (!pic) {
    document.getElementById('view').innerHTML = '<p class="empty">PIC tidak ditemukan.</p>';
    return;
  }
  const root = document.getElementById('view');
  const tasks = state.jobdesk.filter(j => j.pic_id === id);
  const done = tasks.filter(t => t.status === 'done').length;
  const parent = pic.parent_id ? state.pic.find(p => p.id === pic.parent_id) : null;

  root.appendChild(el('div', { class: 'bread' }, [
    el('a', { href: '/home', onclick: (e) => { e.preventDefault(); Router.navigate('/home'); } }, 'Home'),
    el('span', {}, ' / '),
    el('span', {}, pic.nama),
  ]));

  root.appendChild(el('section', { class: 'view-hero' }, [
    el('div', { class: 'view-title-row' }, [
      el('h1', { class: 'view-title' }, pic.nama),
      DivisiBadge(pic.divisi),
      pic.is_owner ? el('span', { class: 'badge-owner' }, 'Owner') : null,
      pic.secondary_parent ? el('span', { class: 'badge-dual' }, 'Dual-role') : null,
    ]),
    el('p', { class: 'view-lede' }, pic.peran),
    el('p', { class: 'view-meta' }, [
      el('span', {}, `ID: ${pic.id}`),
      el('span', {}, ` · Channel: ${pic.channel}`),
      el('span', {}, ` · Joined: ${fmtDate(pic.joined_at)}`),
      parent ? el('span', {}, ` · Lapor ke: ${parent.nama}`) : null,
    ].filter(Boolean)),
    el('div', { class: 'stat-grid' }, [
      el('div', { class: 'stat-card' }, [el('div', { class: 'stat-val' }, String(tasks.length)), el('div', { class: 'stat-lbl' }, 'Total task')]),
      el('div', { class: 'stat-card stat-done' }, [el('div', { class: 'stat-val' }, String(done)), el('div', { class: 'stat-lbl' }, 'Done')]),
      el('div', { class: 'stat-card stat-prog' }, [el('div', { class: 'stat-val' }, String(tasks.length - done)), el('div', { class: 'stat-lbl' }, 'Outstanding')]),
    ]),
  ]));

  // Task list
  const list = tasks.length ? el('ul', { class: 'task-list' }, tasks.map(t =>
    el('li', { class: 'task-row' }, [
      el('div', { class: 'task-main' }, [
        el('div', { class: 'task-id' }, t.id),
        el('div', { class: 'task-title' }, t.title),
      ]),
      el('div', { class: 'task-meta' }, [
        StatusBadge(t.status),
        el('span', { class: 'task-ref' }, t.program_kerja_ref || '—'),
        el('span', { class: 'task-deadline' }, t.deadline ? `Due: ${fmtDate(t.deadline)}` : '—'),
      ]),
      el('div', { class: 'task-actions' }, [
        el('select', {
          class: 'task-status-select',
          name: `status-${t.id}`,
          id: `status-${t.id}`,
          'aria-label': `Status task ${t.id}`,
          autocomplete: 'off',
          onchange: async (e) => {
            await API.patchJobdesk(t.id, { status: e.target.value }, 'owner');
            State.invalidate();
            Router.dispatch();
          },
        }, ['todo', 'in_progress', 'blocked', 'done', 'cancelled'].map(s =>
          el('option', { value: s, selected: t.status === s ? 'selected' : null }, s)
        )),
      ]),
    ])
  )) : el('p', { class: 'empty' }, 'Belum ada task.');

  root.appendChild(el('h2', { class: 'view-h2' }, `Jobdesk (${tasks.length})`));
  root.appendChild(list);
};

// === JOBDESK (all) ===
Views.jobdesk = async () => {
  const state = await State.get();
  const root = document.getElementById('view');

  // Filter UI
  let filterPic = '';
  let filterStatus = '';
  let filterDivisi = '';

  const renderList = () => {
    const list = document.getElementById('jobdesk-list');
    list.innerHTML = '';
    let tasks = state.jobdesk;
    if (filterPic) tasks = tasks.filter(t => t.pic_id === filterPic);
    if (filterStatus) tasks = tasks.filter(t => t.status === filterStatus);
    if (filterDivisi) tasks = tasks.filter(t => t.divisi === filterDivisi);

    const ul = el('ul', { class: 'task-list' }, tasks.map(t => {
      const pic = state.pic.find(p => p.id === t.pic_id);
      return el('li', { class: 'task-row' }, [
        el('div', { class: 'task-main' }, [
          el('div', { class: 'task-id' }, t.id),
          el('div', { class: 'task-title' }, t.title),
          el('div', { class: 'task-pic' }, pic ? `${pic.id} ${pic.nama}` : t.pic_id),
        ]),
        el('div', { class: 'task-meta' }, [
          StatusBadge(t.status),
          DivisiBadge(t.divisi),
          el('span', { class: 'task-ref' }, t.program_kerja_ref || '—'),
          el('span', { class: 'task-deadline' }, t.deadline ? `Due: ${fmtDate(t.deadline)}` : '—'),
        ]),
      ]);
    }));
    list.appendChild(ul.length ? ul : el('p', { class: 'empty' }, 'Tidak ada task sesuai filter.'));
  };

  root.appendChild(el('section', { class: 'view-hero' }, [
    el('h1', { class: 'view-title' }, 'Jobdesk · ' + state.jobdesk.length + ' task'),
    el('p', { class: 'view-lede' }, 'Semua task 12 PIC. Filter by PIC, status, atau divisi.'),
  ]));

  const filterBar = el('div', { class: 'filter-bar' }, [
    el('select', {
      name: 'filter-pic',
      id: 'filter-pic',
      'aria-label': 'Filter PIC',
      autocomplete: 'off',
      onchange: (e) => { filterPic = e.target.value; renderList(); },
    }, [el('option', { value: '' }, 'Semua PIC')].concat(state.pic.map(p =>
      el('option', { value: p.id }, `${p.id} ${p.nama}`)
    ))),
    el('select', {
      name: 'filter-status',
      id: 'filter-status',
      'aria-label': 'Filter status',
      autocomplete: 'off',
      onchange: (e) => { filterStatus = e.target.value; renderList(); },
    }, ['', 'todo', 'in_progress', 'blocked', 'done', 'cancelled'].map(s =>
      el('option', { value: s }, s || 'Semua status')
    )),
    el('select', {
      name: 'filter-divisi',
      id: 'filter-divisi',
      'aria-label': 'Filter divisi',
      autocomplete: 'off',
      onchange: (e) => { filterDivisi = e.target.value; renderList(); },
    }, ['', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map(d =>
      el('option', { value: d }, d || 'Semua divisi')
    )),
  ]);
  root.appendChild(filterBar);

  const listContainer = el('div', { id: 'jobdesk-list' });
  root.appendChild(listContainer);
  renderList();
};

// === AUDIT ===
Views.audit = async () => {
  const state = await State.get();
  const root = document.getElementById('view');
  root.appendChild(el('section', { class: 'view-hero' }, [
    el('h1', { class: 'view-title' }, 'Audit log'),
    el('p', { class: 'view-lede' }, `${state.audit.length} entries · newest first.`),
  ]));

  const list = el('ul', { class: 'audit-list' }, state.audit.map(a =>
    el('li', { class: 'audit-row' }, [
      el('div', { class: 'audit-ts' }, fmtRelative(a.ts)),
      el('div', { class: 'audit-action' }, `${a.action} ${a.entity}/${a.entity_id}`),
      el('div', { class: 'audit-actor' }, `by ${a.actor_id}`),
    ])
  ));
  root.appendChild(list.length ? list : el('p', { class: 'empty' }, 'Belum ada aktivitas.'));
};
