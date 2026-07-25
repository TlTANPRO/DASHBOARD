// audit.js — V2.1
// Local-only audit log di localStorage. Track siapa edit apa kapan.
// Notion API free tier tidak expose audit endpoint, jadi client-side only.
// Limit 200 entries (FIFO).

const Audit = {
  KEY: "dvb2-audit",
  LIMIT: 200,
  _load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },
  _save(arr) { localStorage.setItem(this.KEY, JSON.stringify(arr.slice(-this.LIMIT))); },
  log(entry) {
    if (!Session.pic) return;
    const arr = this._load();
    arr.push({ ...entry, pic: Session.pic, at: new Date().toISOString() });
    this._save(arr);
  },
  list() { return this._load(); },
  lastEdit(db, rowId) {
    return this._load().reverse().find(e => e.db === db && e.rowId === rowId);
  },
  formatRelative(iso) {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru saja";
    if (m < 60) return m + " menit lalu";
    const h = Math.floor(m / 60);
    if (h < 24) return h + " jam lalu";
    const d = Math.floor(h / 24);
    return d + " hari lalu";
  },
};

// Hook into existing CRUD functions (call after successful save)
// Will be auto-wired from app.js init.
function applyAuditHooks() {
  // Wrap existing API methods
  ["create", "update", "remove"].forEach(op => {
    const orig = API[op].bind(API);
    API[op] = async function (db, ...rest) {
      const result = await orig(db, ...rest);
      Audit.log({ action: op, db, rowId: result?.id || rest[0] });
      return result;
    };
  });
}
