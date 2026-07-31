// Syahfalah OS · SPA state + persistence
// V1 demo mode: localStorage + JSON seed fetch.
// No backend Worker yet. CRUD lives in browser; demo single-device only.

const Store = (() => {
  const KEY = 'syahfalah.os.v1';
  const EMPTY = { jobdesk: null, audit: [] };

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('[store] parse fail', e); }
    return { ...EMPTY };
  };

  const save = (state) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) { console.warn('[store] save fail', e); }
  };

  const reset = () => { localStorage.removeItem(KEY); };

  return { load, save, reset };
})();

const API = (() => {
  const seedCache = { pic: null, jobdesk: null };

  const fetchSeed = async (key, url) => {
    if (seedCache[key]) return seedCache[key];
    const r = await fetch(url);
    if (!r.ok) throw new Error(`seed ${key} ${r.status}`);
    seedCache[key] = await r.json();
    return seedCache[key];
  };

  const getPic = () => fetchSeed('pic', './data/pic.json');

  const getJobdesk = async () => {
    const stored = Store.load().jobdesk;
    if (stored) return stored;
    // First boot: load seed
    const seed = await fetchSeed('jobdesk', './data/jobdesk.json');
    const state = Store.load();
    state.jobdesk = seed.jobdesk;
    Store.save(state);
    return seed.jobdesk;
  };

  const saveJobdesk = async (jobdesk) => {
    const state = Store.load();
    state.jobdesk = jobdesk;
    Store.save(state);
    return jobdesk;
  };

  const patchJobdesk = async (id, patch, actor = 'owner') => {
    const jobdesk = await getJobdesk();
    const idx = jobdesk.findIndex(j => j.id === id);
    if (idx === -1) throw new Error(`jobdesk ${id} not found`);
    const before = { ...jobdesk[idx] };
    const after = { ...before, ...patch, updated_at: new Date().toISOString() };
    jobdesk[idx] = after;
    await saveJobdesk(jobdesk);
    await audit({ entity: 'jobdesk', entity_id: id, action: 'update', before, after, actor_id: actor });
    return after;
  };

  const createJobdesk = async (data, actor = 'owner') => {
    const jobdesk = await getJobdesk();
    const id = 'J' + String(jobdesk.length + 1).padStart(4, '0');
    const now = new Date().toISOString();
    const entry = {
      id,
      title: data.title || 'Untitled',
      pic_id: data.pic_id || 'P1',
      parent_id: data.parent_id || null,
      divisi: data.divisi || 'D1',
      program_kerja_ref: data.program_kerja_ref || null,
      status: data.status || 'todo',
      deadline: data.deadline || null,
      evidence_url: data.evidence_url || null,
      created_at: now,
      updated_at: now,
    };
    jobdesk.unshift(entry);
    await saveJobdesk(jobdesk);
    await audit({ entity: 'jobdesk', entity_id: id, action: 'create', before: null, after: entry, actor_id: actor });
    return entry;
  };

  const audit = async (entry) => {
    const state = Store.load();
    const id = 'A' + String(state.audit.length + 1).padStart(6, '0');
    state.audit.unshift({ id, ...entry, ts: new Date().toISOString() });
    state.audit = state.audit.slice(0, 500); // keep last 500
    Store.save(state);
    return entry;
  };

  const getAudit = async () => Store.load().audit;

  return { getPic, getJobdesk, patchJobdesk, createJobdesk, getAudit };
})();

const State = (() => {
  let cache = null;
  const get = async () => {
    if (!cache) {
      cache = {
        pic: await API.getPic(),
        jobdesk: await API.getJobdesk(),
        audit: await API.getAudit(),
      };
    }
    return cache;
  };
  const invalidate = () => { cache = null; };
  return { get, invalidate };
})();

const Router = (() => {
  const routes = [];

  const add = (pattern, handler) => {
    const keys = [];
    const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    routes.push({ regex, keys, handler });
  };

  const dispatch = async () => {
    const raw = window.location.pathname;
    // First-load rewrite: 404.html redirects ?r=/pic/P2 → parse and pushState.
    const qs = new URLSearchParams(window.location.search);
    const rewrite = qs.get('r');
    if (rewrite !== null) {
      // Drop query, push real path, then dispatch
      const target = rewrite.startsWith('/') ? rewrite : '/' + rewrite;
      const cleanUrl = basename + target;
      window.history.replaceState({}, '', cleanUrl);
      return dispatch();
    }
    // Match /DASHBOARD/path or /DASHBOARD
    const m = raw.match(/^\/[^\/]+(\/.*)?$/);
    const tail = (m && m[1]) ? m[1] : (raw === '/' || raw === '/DASHBOARD' || raw === '/DASHBOARD/') ? '/' : raw;
    const path = (tail === '/' || tail === '') ? '/home' : tail;
    for (const r of routes) {
      const mm = path.match(r.regex);
      if (mm) {
        const params = {};
        r.keys.forEach((k, i) => { params[k] = mm[i + 1]; });
        document.getElementById('view').innerHTML = '';
        await r.handler(params);
        return;
      }
    }
    document.getElementById('view').innerHTML = '<p class="empty">Halaman tidak ditemukan.</p>';
  };

  const basename = (() => {
    const p = window.location.pathname;
    const m = p.match(/^(\/[^\/]+)/);
    return m ? m[1] : '';
  })();

  const navigate = (path) => {
    const target = path.startsWith('/') ? path : '/' + path;
    history.pushState({}, '', basename + target);
    dispatch();
  };

  window.addEventListener('popstate', dispatch);

  return { add, dispatch, navigate };
})();
