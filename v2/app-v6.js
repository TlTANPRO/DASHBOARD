// V2 · Main app — V1 SSOT render + V2 CRUD + auth + Notion proxy
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const fmtIDR = n => "Rp " + (n || 0).toLocaleString("id-ID");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const todayISO = () => new Date().toISOString().split("T")[0];
const OWNER_PICS = ["Pak Ardian", "Bu Nisya"];

// ============================================================
// SESSION / AUTH
// ============================================================
const Session = {
  pic: null,
  token: null,
  loginAt: null,
  isOwner() { return OWNER_PICS.includes(this.pic); },
  save() {
    sessionStorage.setItem("dvb2", JSON.stringify({
      pic: this.pic, token: this.token, loginAt: this.loginAt
    }));
  },
  load() {
    const s = sessionStorage.getItem("dvb2");
    if (!s) return false;
    const d = JSON.parse(s);
    if (Date.now() - d.loginAt > 12 * 3600 * 1000) {
      sessionStorage.removeItem("dvb2");
      return false;
    }
    this.pic = d.pic;
    this.token = d.token;
    this.loginAt = d.loginAt;
    return true;
  },
  clear() {
    sessionStorage.removeItem("dvb2");
    this.pic = this.token = this.loginAt = null;
  }
};

function updateSessionPill() {
  const pill = $("#session-pill");
  const txt = $("#session-text");
  const btn = $("#login-btn");
  if (Session.pic) {
    pill.classList.remove("logged-out");
    txt.textContent = "✓ " + Session.pic;
    btn.textContent = "Logout";
    btn.onclick = () => { Session.clear(); location.reload(); };
  } else {
    pill.classList.add("logged-out");
    txt.textContent = "Belum login";
    btn.textContent = "Login";
    btn.onclick = showLoginModal;
  }
}

function showLoginModal() {
  const cfg = window.DASHBOARD_CONFIG;
  openModal("Login Dashboard Syahfalah", `
    <form id="login-form">
      <div class="form-row">
        <label>Pilih PIC
        <select class="select" name="pic" required>
          ${cfg.picList.map(p => `<option value="${p}">${p}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>PIN (4-6 digit)
        <input class="input" type="password" name="pin" inputmode="numeric" maxlength="6" pattern="[0-9]{4,6}" required />
        </label>
      </div>
      <p class="muted" style="font-size:0.75rem;margin-bottom:var(--space-3)">
        Mode <strong>${cfg.mode}</strong>. Masukkan PIN 4 digit yang dibagikan owner via WA.
      </p>
      <div style="display:flex;gap:var(--space-2);justify-content:flex-end">
        <button type="button" class="btn btn-ghost" id="login-cancel">Batal</button>
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </form>
  `);
  $("#login-cancel").onclick = closeModal;
  $("#login-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const pic = fd.get("pic");
    const pin = fd.get("pin");
    if (cfg.mode === "live") {
      try {
        const res = await fetch(cfg.workerBase + "/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pic, pin })
        });
        if (!res.ok) throw new Error("Login gagal");
        const data = await res.json();
        Session.pic = data.pic || pic;
        Session.token = data.token;
        Session.loginAt = Date.now();
        Session.save();
        toast("success", "Login sebagai " + Session.pic);
        closeModal();
        updateSessionPill();
        toggleOwnerUI();
        refreshAll();
        document.dispatchEvent(new Event("session:updated"));
      } catch (err) {
        toast("error", "Login gagal: " + err.message);
      }
    } else {
      // DEMO MODE
      Session.pic = pic;
      Session.token = "demo-" + Date.now();
      Session.loginAt = Date.now();
      Session.save();
      toast("success", "Demo login sebagai " + pic);
      closeModal();
      updateSessionPill();
      toggleOwnerUI();
      refreshAll();
      document.dispatchEvent(new Event("session:updated"));
    }
  };
}

// ============================================================
// TOAST (V2.1 — pause on hover, aria-live, a11y)
// ============================================================
function toast(type, msg, opts = {}) {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  el.textContent = msg;
  const timer = setTimeout(() => el.remove(), opts.duration || 3500);
  el.addEventListener("mouseenter", () => clearTimeout(timer));
  el.addEventListener("mouseleave", () => setTimeout(() => el.remove(), 1200));
  $("#toast-stack").appendChild(el);
  return el;
}

// ============================================================
// MODAL (V2.1 — a11y: focus trap, Escape, body scroll lock, restore focus)
// ============================================================
let _modalReturnFocus = null;
let _modalKeyHandler = null;

function openModal(title, bodyHTML) {
  const back = $("#modal-backdrop");
  if (back.classList.contains("open")) closeModal();
  _modalReturnFocus = document.activeElement;
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = bodyHTML;
  back.classList.add("open");
  document.body.style.overflow = "hidden";

  // Focus first input/button after paint
  setTimeout(() => {
    const focusable = $("#modal-body").querySelector("input, select, textarea, button");
    (focusable || $("#modal-close")).focus();
  }, 30);

  // Escape + focus trap
  _modalKeyHandler = (e) => {
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key === "Tab") {
      const focusable = Array.from($("#modal-body").querySelectorAll("input, select, textarea, button, [tabindex]:not([tabindex='-1'])"))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", _modalKeyHandler);
}

function closeModal() {
  $("#modal-backdrop").classList.remove("open");
  document.body.style.overflow = "";
  if (_modalKeyHandler) { document.removeEventListener("keydown", _modalKeyHandler); _modalKeyHandler = null; }
  if (_modalReturnFocus && typeof _modalReturnFocus.focus === "function") {
    setTimeout(() => _modalReturnFocus.focus(), 50);
  }
}

$("#modal-close").onclick = closeModal;
$("#modal-backdrop").onclick = (e) => {
  if (e.target.id === "modal-backdrop") closeModal();
};

// Custom confirm dialog (replace native window.confirm)
function confirmDialog({ title, body, danger = false, confirmText = "Konfirmasi", cancelText = "Batal" }) {
  return new Promise((resolve) => {
    const back = $("#confirm-backdrop");
    $("#confirm-title").textContent = title;
    $("#confirm-body").textContent = body;
    const ok = $("#confirm-ok"), cancel = $("#confirm-cancel");
    ok.textContent = confirmText;
    cancel.textContent = cancelText;
    ok.classList.toggle("btn-danger", danger);
    back.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => ok.focus(), 30);

    const cleanup = (result) => {
      back.classList.remove("open");
      document.body.style.overflow = "";
      ok.removeEventListener("click", okH);
      cancel.removeEventListener("click", cancelH);
      document.removeEventListener("keydown", keyH);
      resolve(result);
    };
    const okH = () => cleanup(true);
    const cancelH = () => cleanup(false);
    const keyH = (e) => { if (e.key === "Escape") cleanup(false); if (e.key === "Enter") cleanup(true); };
    ok.addEventListener("click", okH);
    cancel.addEventListener("click", cancelH);
    document.addEventListener("keydown", keyH);
  });
}

// Set save button loading state
function setSaveLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.dataset.label = btn.dataset.label || btn.textContent;
  btn.textContent = loading ? "Menyimpan…" : btn.dataset.label;
  btn.style.opacity = loading ? "0.7" : "";
}

// ============================================================
// XSS-safe escape helper (audit Critical)
// ============================================================
function escapeHTML(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Skeleton table placeholder (T4.1 a11y: aria-busy + reduced-motion safe)
function skeletonTable(rows = 5, cols = 5) {
  const widths = [80, 100, 120, 60, 140];
  let html = '<table class="crud-table"><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      const w = widths[c % widths.length];
      html += `<td><span class="skeleton" style="width:${w}px;height:14px"></span></td>`;
    }
    html += '</tr>';
  }
  return html + '</tbody></table>';
}

// ============================================================
// NOTION API (live mode) + DEMO STORAGE (demo mode)
// ============================================================
const Store = {
  // Demo storage key
  _k: "dvb2-demo",
  _load() {
    try { return JSON.parse(localStorage.getItem(this._k)) || {}; }
    catch { return {}; }
  },
  _save(data) { localStorage.setItem(this._k, JSON.stringify(data)); },
  get(db) { const d = this._load(); return d[db] || []; },
  set(db, rows) {
    const d = this._load();
    d[db] = rows;
    this._save(d);
  },
  add(db, row) {
    const rows = this.get(db);
    row.id = row.id || ("local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8));
    row.createdAt = new Date().toISOString();
    row._editTime = new Date().toISOString();
    rows.unshift(row);
    this.set(db, rows);
    return row;
  },
  update(db, id, patch) {
    const rows = this.get(db);
    const idx = rows.findIndex(r => r.id === id);
    if (idx < 0) throw new Error("Not found");
    rows[idx] = { ...rows[idx], ...patch, _editTime: new Date().toISOString() };
    this.set(db, rows);
    return rows[idx];
  },
  remove(db, id) {
    const rows = this.get(db).filter(r => r.id !== id);
    this.set(db, rows);
  }
};

const API = {
  async query(dbKey, filter = null) {
    const cfg = window.DASHBOARD_CONFIG;
    if (cfg.mode === "live") {
      const dbId = cfg.databases[dbKey];
      const body = { page_size: 100 };
      if (filter) body.filter = filter;
      const res = await fetch(cfg.workerBase + "/notion/v1/databases/" + dbId + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": cfg.notionVersion,
          "X-PIC": Session.pic || "anon",
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Query gagal: " + res.status);
      return await res.json();
    } else {
      // DEMO: filter in-memory
      let rows = Store.get(dbKey);
      if (filter && filter.property && filter[filter.property]) {
        const val = filter[filter.property];
        if (val.select) rows = rows.filter(r => r[filter.property] === val.select.equals);
      }
      return { results: rows };
    }
  },
  async create(dbKey, properties) {
    const cfg = window.DASHBOARD_CONFIG;
    if (cfg.mode === "live") {
      const dbId = cfg.databases[dbKey];
      const res = await fetch(cfg.workerBase + "/notion/v1/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": cfg.notionVersion,
          "X-PIC": Session.pic || "anon",
        },
        body: JSON.stringify({ parent: { database_id: dbId }, properties })
      });
      if (!res.ok) throw new Error("Create gagal: " + res.status);
      return await res.json();
    } else {
      return Store.add(dbKey, properties);
    }
  },
  async update(dbKey, id, properties, editTime) {
    const cfg = window.DASHBOARD_CONFIG;
    if (cfg.mode === "live") {
      const dbId = cfg.databases[dbKey];
      const isOwner = Session.isOwner();
      // Owner skip optimistic lock — force override
      const headers = {
        "Content-Type": "application/json",
        "Notion-Version": cfg.notionVersion,
        "X-PIC": Session.pic || "anon",
        "Authorization": "Bearer " + (Session.token || ""),
        ...(editTime && !isOwner ? { "X-Edit-Time": editTime } : {}),
        ...(isOwner ? { "X-Owner-Override": "true" } : {}),
      };
      const res = await fetch(cfg.workerBase + "/notion/v1/pages/" + id, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ properties })
      });
      if (res.status === 409) throw new Error("Data sudah diubah orang lain — refresh dulu");
      if (!res.ok) throw new Error("Update gagal: " + res.status);
      return await res.json();
    } else {
      return Store.update(dbKey, id, properties);
    }
  },
  async remove(dbKey, id) {
    const cfg = window.DASHBOARD_CONFIG;
    if (cfg.mode === "live") {
      const res = await fetch(cfg.workerBase + "/notion/v1/pages/" + id, {
        method: "DELETE",
        headers: {
          "X-PIC": Session.pic || "anon",
          "Authorization": "Bearer " + (Session.token || ""),
        }
      });
      if (!res.ok) throw new Error("Delete gagal: " + res.status);
      return true;
    } else {
      Store.remove(dbKey, id);
      return true;
    }
  }
};

// ============================================================
// RENDER V1 SECTIONS (read-only, dari V1 SSOT)
// ============================================================
const FALLBACK = {
  pic: [
    {nama: "Pak Ardian", title: "Owner / Direktur", tag: "Owner", tasks: ["Strategic decision", "Final approve budget", "Review KPI bulanan", "Ekspansi klien"]},
    {nama: "Bu Nisya", title: "Co-Director / Legal", tag: "Owner", tasks: ["Legal drafting", "Audit mingguan front office", "Approve kontrak", "Cross-check SP3K"]},
    {nama: "Mada", title: "Chief of Staff (B10 PIC)", tag: "B10 PIC · Back-end only", tasks: ["Operasional lintas fungsi", "Approval + monitoring", "Coaching + audit", "KPI konsolidasi"]},
    {nama: "Riza", title: "Digital Marketing", tag: "Marketing", tasks: ["Lead generation", "Meta ads + organic", "CRM update", "Closing support"]},
    {nama: "Yudi (Sdek)", title: "Sales Counter + Maintenance", tag: "Marketing", tasks: ["Closing pojok V4", "Walk-in konsumen", "Maintenance", "STB support"]},
    {nama: "Rizal", title: "Kepala Pelaksana", tag: "Proyek", tasks: ["Daily task proyek", "Brief mandor", "Monitoring progres", "Cross-check purchasing"]},
    {nama: "Amir", title: "Site Manager", tag: "Proyek · Daily tetap", tasks: ["Daily report lapangan", "Koordinasi subkon", "Material handling", "Quality check"]},
    {nama: "Novita", title: "Admin Pemberkasan", tag: "Admin · Fixed + Mel", tasks: ["Pemberkasan klien", "SP3K tracking", "Legal support", "Closing file"]},
    {nama: "Sinta", title: "Purchasing + Stopper Kualitas", tag: "Purchasing · Stopper", tasks: ["Stopper kualitas material", "Best price 3 vendor", "Retensi vendor", "Block PO bila spek turun"]},
    {nama: "Reni", title: "Ketua Media", tag: "Media · Manager", tasks: ["Fee media closing-based", "3 pilar konten", "UTM tracking", "Supervisi Rifki + Reta"]},
    {nama: "Rifki", title: "Media Staff", tag: "Media", tasks: ["Produksi konten", "Story + Reels", "Posting schedule", "Engagement"]},
    {nama: "Reta", title: "Media Staff", tag: "Media", tasks: ["Produksi konten", "Carousel + feed", "Insight report", "Hashtag research"]},
  ],
  fee_pilar: [
    {nama: "Product Knowledge", bobot: "30%", desc: "Konten edukasi spek rumah, material, harga. Tunjukkan expertise internal."},
    {nama: "Brand Awareness", bobot: "20%", desc: "Story behind-the-scene, tim, progres, testimoni. Bangun trust + recall."},
    {nama: "Closing Trigger", bobot: "50%", desc: "CTA kuat, promo terbatas, urgency soft. Konten yang convert lead → closing."},
  ],
  pricing: [
    {tier: "BRONZE", sub: "Tanpa Management", unit: 5, fee: 2750000, margin: "15-20%", resp: "Klien: lead + closing + berkas. Perusahaan: spek + sertifikat + BAST."},
    {tier: "SILVER", sub: "Partial Management", unit: 6, fee: 3250000, margin: "20-25%", resp: "Klien: lead + closing. Perusahaan: proyek + admin + legal + after-sales."},
    {tier: "GOLD", sub: "Full Management", unit: 7, fee: 3750000, margin: "25-35%", resp: "Perusahaan: SEMUA. Klien: review bulanan + strategic decision."},
  ],
  stb_wajib: [
    {nama: "Report Harian", desc: "Auto dashboard internal. Mada konsolidasi, Rizal update progres harian, Amir kirim foto + catatan lapangan."},
    {nama: "Notion Reminder", desc: "H-7, H-3, H-1, H-0 reminder ke Novita + Bu Nisya. Tidak ada yang miss deadline karena lupa."},
    {nama: "Dokumen STB", desc: "Masa kadaluarsa maks 6 bulan. Hardcopy di Sinta, softcopy di Notion + Drive. BAST ditandatangani kedua pihak."},
  ],
  stb_punish: [
    {jenjang: 1, konsekuensi: "Lembur hangus", trigger: "Telat report 1x", recovery: "Submit sebelum tutup hari"},
    {jenjang: 2, konsekuensi: "Hari Minggu kerja", trigger: "Telat report 2x berturut", recovery: "Bukti progress 100%"},
    {jenjang: 3, konsekuensi: "Visit konsumen + konten", trigger: "Telat report 3x", recovery: "Laporan konsumen verbatim"},
    {jenjang: 4, konsekuensi: "Potong gaji 10%", trigger: "Telat report 4x", recovery: "Recovery plan 30 hari"},
    {jenjang: 5, konsekuensi: "Kontrak review", trigger: "Telat report 5x / komplain klien", recovery: "Kontrak baru 3 bulan probasi"},
  ],
  manager_sifat: [
    {nama: "Tertib & Disiplin", desc: "Manager V5 = contoh untuk tim. Datang tepat waktu, pakai sistem (dashboard, SOP), konsisten. Audit finding manager = 0."},
    {nama: "Memahami Karyawan & Atasan", desc: "Paham karakter + kekuatan bawahan. Tahu apa atasan mau. 1-on-1 tiap bulan. Assign task sesuai kekuatan."},
    {nama: "Generalis (Cross-Function)", desc: "Paham lintas divisi. Bisa diskusi sama PIC tanpa gap. Paham financial/pricing/margin di level overview."},
  ],
  manager_list: [
    {nama: "Mada", peran: "Chief of Staff · supervise 11 PIC", tier: "operasional"},
    {nama: "Bu Nisya", peran: "Co-Director Legal · supervise Novita + audit", tier: "legal"},
    {nama: "Rizal", peran: "Kepala Pelaksana · supervise Amir + mandor + subkon", tier: "proyek"},
    {nama: "Reni", peran: "Ketua Media · supervise Rifki + Reta", tier: "media"},
    {nama: "Riza", peran: "Senior Digital Marketing (jika promosi)", tier: "marketing"},
  ],
  glosarium: [
    ["AHS", "Analisa Harga Satuan"], ["BAST", "Berita Acara Serah Terima"], ["BPN", "Badan Pertanahan Nasional"], ["BPJS", "Badan Penyelenggara Jaminan Sosial"],
    ["CPL", "Cost Per Lead"], ["CS", "Customer Service"], ["CTA", "Call To Action"], ["FLPP", "Fasilitas Likuiditas Pembiayaan Perumahan"],
    ["HPP", "Harga Pokok Penjualan / Produksi"], ["HR", "Human Resources"], ["IG", "Instagram"], ["JHT", "Jaminan Hari Tua"],
    ["JP", "Jaminan Pensiun"], ["KPI", "Key Performance Indicator"], ["KPP", "Komunikasi Pemberkasan Pembayaran"], ["K3", "Keselamatan dan Kesehatan Kerja"],
    ["NIP", "Nomor Induk Pegawai"], ["PIC", "Person In Charge"], ["PIP", "Performance Improvement Plan"], ["PO", "Purchase Order"],
    ["PPh", "Pajak Penghasilan"], ["QC", "Quality Control"], ["RAB", "Rencana Anggaran Biaya"], ["ROI", "Return On Investment"],
    ["SDM", "Sumber Daya Manusia"], ["SHM", "Sertifikat Hak Milik"], ["SLA", "Service Level Agreement"], ["SOP", "Standard Operating Procedure"],
    ["SPK", "Surat Perintah Kerja"], ["SP3K", "Surat Penawaran Pemesanan Kredit (FLPP)"], ["SSOT", "Single Source Of Truth"], ["STB", "Serah Terima Bangunan"],
    ["THR", "Tunjangan Hari Raya"], ["UTM", "Urchin Tracking Module (web analytics)"], ["WA", "WhatsApp"], ["KPR", "Kredit Pemilikan Rumah"],
    ["LPB", "Laporan Penerimaan Barang"], ["RKS", "Rencana Kerja dan Syarat-Syarat"], ["BAP", "Berita Acara Pemeriksaan"], ["Retensi", "Potongan 5% ditahan 30 hari pasca BAST"],
    ["Subkon", "Subkontraktor"], ["Mandor", "Ketua tukang di lapangan"], ["Cross-train", "Pelatihan skill lintas fungsi"], ["Polyvalent", "Mampu multi-skill"],
    ["Leaderboard", "Ranking internal per divisi"], ["Mel", "Insertif per file closing"], ["BAST 1", "BAST Tahap 1 (50% pekerjaan)"], ["BAST 2", "BAST Tahap 2 (100% pekerjaan)"],
  ],
};

function renderPIC() {
  $("#pic-grid").innerHTML = FALLBACK.pic.map(p => {
    const isB10 = p.tag.includes("B10");
    return `
      <div class="pic-card ${isB10 ? 'highlight' : ''}">
        <div class="pic-header">
          <div class="pic-avatar">${p.nama.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
          <div class="pic-info">
            <div class="pic-name">${p.nama}</div>
            <div class="pic-role">${p.title}</div>
          </div>
        </div>
        <ul class="pic-tasks">${p.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
        <span class="pic-tag">${p.tag}</span>
      </div>`;
  }).join('');
}

function renderFee() { /* deprecated V2.1 — use Referensi section */ }
function renderPricing() { /* deprecated V2.1 */ }
function renderSTB() { /* deprecated V2.1 */ }
function renderManager() { /* deprecated V2.1 */ }
function renderGlosarium() { /* deprecated V2.1 */ }

// ============================================================
// V2 CRUD: KPI TRACKER
// ============================================================
async function loadKPI() {
  const list = $("#kpi-list");
  if (!Session.pic) {
    list.innerHTML = `<div class="empty-state">
      <h3>Login dulu</h3>
      <p>Masukkan PIN 4 digit untuk melihat KPI Anda.</p>
    </div>`;
    return;
  }
  list.setAttribute("aria-busy", "true");
  list.innerHTML = skeletonTable(6, 5);
  try {
    const res = await API.query("kpi");
    let rows = res.results || [];
    // Filter UI
    const fPic = $("#kpi-filter-pic").value;
    const fPeriode = $("#kpi-filter-periode").value;
    const fStatus = $("#kpi-filter-status").value;
    if (fPic) rows = rows.filter(r => r.PIC === fPic);
    if (fPeriode) rows = rows.filter(r => r.Periode === fPeriode);
    if (fStatus) rows = rows.filter(r => r.Status === fStatus);
    if (rows.length === 0) {
      list.innerHTML = `<div class="empty-state">
        <h3>Belum ada KPI</h3>
        <p>Mulai catat KPI untuk Mada, Riza, Rizal — target bulanan closing, lead, BAST, dll. Klik "+ Tambah KPI".</p>
      </div>`;
      return;
    }
    list.innerHTML = `<table class="crud-table">
      <thead><tr>
        <th>KPI ID</th><th>PIC</th><th>Periode</th><th>Target</th><th>Realisasi</th>
        <th>Skor</th><th>Grade</th><th>Status</th><th>Catatan</th><th></th>
      </tr></thead>
      <tbody>${rows.map((r, i) => kpiRowHTML(r, i)).join('')}</tbody>
    </table>`;
    list.removeAttribute("aria-busy");
    list.querySelectorAll("[data-action=edit]").forEach(b => b.onclick = () => editKPI(b.dataset.id, rows[+b.dataset.idx]));
    list.querySelectorAll("[data-action=del]").forEach(b => b.onclick = () => deleteKPI(b.dataset.id));
  } catch (e) {
    list.removeAttribute("aria-busy");
    list.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${escapeHTML(e.message)}</p></div>`;
  }
}

// ============================================================
// V2 VIEW: TARGET DIVISI (aggregate Personal KPI per divisi)
// ============================================================
async function loadDivisi() {
  const grid = $("#divisi-grid");
  if (!Session.pic) {
    grid.innerHTML = `<div class="empty-state">
      <h3>Login dulu</h3>
      <p>Masukkan PIN untuk lihat target divisi.</p>
    </div>`;
    return;
  }
  grid.setAttribute("aria-busy", "true");
  try {
    const res = await API.query("kpi");
    const rows = res.results || [];
    // Group by Divisi
    const byDivisi = {};
    rows.forEach(r => {
      const d = r.Divisi || "Lain-lain";
      if (!byDivisi[d]) byDivisi[d] = { pics: new Set(), target: 0, realisasi: 0, items: [] };
      byDivisi[d].pics.add(r.PIC);
      byDivisi[d].target += r.Target || 0;
      byDivisi[d].realisasi += r.Realisasi || 0;
      byDivisi[d].items.push(r);
    });
    const divisiNames = Object.keys(byDivisi).sort();
    if (divisiNames.length === 0) {
      grid.innerHTML = `<div class="empty-state">
        <h3>Belum ada KPI</h3>
        <p>Tambah KPI di section KPI Tracker untuk populate target divisi.</p>
      </div>`;
      return;
    }
    grid.innerHTML = divisiNames.map(d => {
      const data = byDivisi[d];
      const pct = data.target > 0 ? Math.round((data.realisasi / data.target) * 100) : 0;
      const pillCls = pct >= 90 ? "success" : pct >= 60 ? "info" : pct >= 40 ? "warning" : "danger";
      const picList = Array.from(data.pics).join(", ");
      return `<div class="card" data-divisi="${escapeHTML(d)}">
        <div class="card-eyebrow">${escapeHTML(d)}</div>
        <div class="card-stat">${pct}<span class="muted" style="font-size:0.875rem">%</span></div>
        <div class="card-foot">
          <span class="pill ${pillCls}">${data.realisasi} / ${data.target}</span>
          <small class="muted">${data.items.length} KPI · ${escapeHTML(picList)}</small>
        </div>
      </div>`;
    }).join('');
    grid.querySelectorAll("[data-divisi]").forEach(c => c.onclick = () => {
      const d = c.dataset.divisi;
      $("#kpi-filter-pic").value = "";
      $("#kpi-filter-status").value = "";
      $("#kpi-filter-periode").value = "";
      location.hash = "#v2-kpi";
      setTimeout(() => loadKPI(), 100);
    });
    grid.removeAttribute("aria-busy");
  } catch (e) {
    grid.removeAttribute("aria-busy");
    grid.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${escapeHTML(e.message)}</p></div>`;
  }
}

function kpiRowHTML(r, i = 0) {
  const skor = r.Target > 0 ? Math.round((r.Realisasi / r.Target) * 100) : 0;
  const grade = skor >= 90 ? "A" : skor >= 75 ? "B" : skor >= 60 ? "C" : "D";
  const gradePill = {A: "success", B: "info", C: "warning", D: "danger"}[grade];
  const statusPill = { "On Track": "success", "Achieved": "success", "At Risk": "warning", "Off Track": "danger" }[r.Status] || "muted";
  // Display readable ID + Tipe pill
  const rawId = r["KPI ID"] || r.kpiId || "";
  const displayId = rawId || (r.PIC ? `KPI ${escapeHTML(r.PIC)}` : (r.id ? r.id.slice(0, 8) : "-"));
  const catatan = (r.Catatan || "");
  const tipe = r.Tipe || "Personal";
  const tipePill = tipe === "Divisi" ? "success" : "info";
  const tipeIcon = tipe === "Divisi" ? "🏢" : "📍";
  const kpiName = r.KPI ? r.KPI.slice(0, 40) + (r.KPI.length > 40 ? "…" : "") : "";
  return `<tr>
    <td class="mono">${escapeHTML(displayId)}</td>
    <td>${escapeHTML(r.PIC || "-")}</td>
    <td>${kpiName ? `<div><strong>${escapeHTML(kpiName)}</strong></div>` : ""}<span class="muted" style="font-size:0.75rem">${escapeHTML(r.Divisi || "-")} · ${escapeHTML(r.Periode || "-")}</span></td>
    <td class="num">${r.Target || 0} ${escapeHTML(r.Satuan || "")}</td>
    <td class="num">${r.Realisasi || 0}</td>
    <td class="num"><strong>${skor}</strong></td>
    <td><span class="pill ${gradePill}">${grade}</span></td>
    <td><span class="pill ${statusPill}">${escapeHTML(r.Status || "-")}</span></td>
    <td><span class="pill ${tipePill}">${tipeIcon} ${tipe}</span>${catatan ? `<div class="muted" style="font-size:0.75rem;margin-top:2px">${escapeHTML(catatan.slice(0, 30))}${catatan.length > 30 ? "…" : ""}</div>` : ""}</td>
    <td>
      <button class="btn btn-sm" data-action="edit" data-id="${r.id}" data-idx="${i}">Edit</button>
      <button class="btn btn-sm btn-danger" data-action="del" data-id="${r.id}">Hapus</button>
    </td>
  </tr>`;
}

function kpiFormHTML(r = {}) {
  const cfg = window.DASHBOARD_CONFIG;
  const sel = (val, list) => list.map(x => `<option ${val === x ? "selected" : ""}>${x}</option>`).join("");
  return `<form id="kpi-form">
    <div class="form-grid">
      <div class="form-row">
        <label>KPI ID
        <input class="input" name="kpiId" value="${r["KPI ID"] || r.kpiId || "KPI-2026-" + Date.now().toString().slice(-4)}" required />
        </label>
      </div>
      <div class="form-row">
        <label>PIC
        <select class="select" name="PIC" required>
          ${sel(r.PIC || Session.pic, cfg.picList)}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Divisi
        <select class="select" name="Divisi" required>
          ${sel(r.Divisi || "", cfg.divisiList)}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Periode
        <select class="select" name="Periode" required>
          ${sel(r.Periode || "Mingguan", ["Mingguan", "Bulanan", "Kuartalan"])}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Target
        <input class="input" type="number" name="Target" value="${r.Target || 0}" required />
        </label>
      </div>
      <div class="form-row">
        <label>Realisasi
        <input class="input" type="number" name="Realisasi" value="${r.Realisasi || 0}" required />
        </label>
      </div>
      <div class="form-row">
        <label>Satuan
        <select class="select" name="Satuan">
          ${sel(r.Satuan || "%", ["%", "Unit", "Rp", "Closing", "Lead", "Jam"])}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Status
        <select class="select" name="Status">
          ${sel(r.Status || "On Track", ["On Track", "At Risk", "Off Track", "Achieved"])}
        </select>
        </label>
      </div>
    </div>
    <div class="form-row">
      <label>Catatan
      <textarea class="textarea" name="Catatan">${r.Catatan || ""}</textarea>
      </label>
    </div>
    <div class="form-row">
      <label>Bukti (URL)
      <input class="input" type="url" name="Bukti" value="${r.Bukti || ""}" />
      </label>
    </div>
    <div style="display:flex;gap:var(--space-2);justify-content:flex-end;margin-top:var(--space-4)">
      <button type="button" class="btn btn-ghost" id="form-cancel">Batal</button>
      <button type="submit" class="btn btn-primary">Simpan</button>
    </div>
  </form>`;
}

$("#kpi-add").onclick = () => {
  if (!Session.pic) { toast("error", "Login dulu"); return; }
  openModal("Tambah KPI", kpiFormHTML());
  $("#form-cancel").onclick = closeModal;
  $("#kpi-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.create("kpi", props);
      toast("success", "KPI tersimpan");
      closeModal();
      loadKPI();
    } catch (err) { toast("error", err.message); }
  };
};

async function editKPI(id, row) {
  const r = row || Store.get("kpi").find(x => x.id === id);
  if (!r) { toast("error", "Row tidak ditemukan, refresh dulu"); return; }
  openModal("Edit KPI", kpiFormHTML(r));
  $("#form-cancel").onclick = closeModal;
  $("#kpi-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.update("kpi", id, props, r._editTime);
      toast("success", "KPI diupdate");
      closeModal();
      loadKPI();
    } catch (err) { toast("error", err.message); }
  };
}

async function deleteKPI(id) {
  const ok = await confirmDialog({ title: "Hapus KPI?", body: "Tindakan ini tidak dapat dibatalkan.", danger: true, confirmText: "Hapus" });
  if (!ok) return;
  try {
    await API.remove("kpi", id);
    toast("success", "KPI dihapus");
    loadKPI();
  } catch (e) { toast("error", e.message); }
}

// ============================================================
// V2 CRUD: PROGRAM KERJA
// ============================================================
async function loadProgram() {
  const list = $("#prog-list");
  if (!Session.pic) {
    list.innerHTML = `<div class="empty-state">
      <h3>Login dulu</h3><p>Program Kerja butuh login.</p>
    </div>`;
    return;
  }
  list.setAttribute("aria-busy", "true");
  list.innerHTML = skeletonTable(4, 9);
  try {
    const res = await API.query("program");
    let rows = res.results || [];
    const fQ = $("#prog-filter-quarter").value;
    const fS = $("#prog-filter-status").value;
    if (fQ) rows = rows.filter(r => r.Quarter === fQ);
    if (fS) rows = rows.filter(r => r.Status === fS);
    if (rows.length === 0) {
      list.innerHTML = `<div class="empty-state">
        <h3>Belum ada program</h3>
        <p>Program Q3: ekspansi klien, SOP penutup H1→H2, coaching Mada, pipeline closing. Klik "+ Tambah Program" untuk inisiatif baru.</p>
      </div>`;
      return;
    }
    list.innerHTML = `<table class="crud-table">
      <thead><tr>
        <th>Program ID</th><th>Nama</th><th>PIC</th><th>Q</th><th>Progress</th>
        <th>Status</th><th>Deadline</th><th>Budget</th><th></th>
      </tr></thead>
      <tbody>${rows.map(progRowHTML).join('')}</tbody>
    </table>`;
    list.querySelectorAll("[data-action=edit]").forEach(b => b.onclick = () => editProgram(b.dataset.id, rows[+b.dataset.idx]));
    list.querySelectorAll("[data-action=del]").forEach(b => b.onclick = () => deleteProgram(b.dataset.id));
    list.removeAttribute("aria-busy");
  } catch (e) {
    list.removeAttribute("aria-busy");
    list.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${escapeHTML(e.message)}</p></div>`;
  }
}

function progRowHTML(r, i = 0) {
  const pct = r.Progress || 0;
  const pctClass = pct >= 75 ? "high" : pct >= 40 ? "mid" : "low";
  const statusPill = { "On Track": "success", "Done": "success", "At Risk": "warning", "Delayed": "danger", "Planning": "info", "Cancelled": "muted" }[r.Status] || "muted";
  const nama = r["Nama Program"] || r.nama || "";
  const progId = r["Program ID"] || r.programId || (nama ? `Program ${nama.slice(0, 24)}` : (r.id ? r.id.slice(0, 8) : "-"));
  const nm = (nama || "").slice(0, 60);
  return `<tr>
    <td class="mono">${escapeHTML(progId)}</td>
    <td><strong>${escapeHTML(nm)}${nama.length > 60 ? "…" : ""}</strong></td>
    <td>${escapeHTML(r["PIC Penanggung Jawab"] || r.pic || "-")}</td>
    <td>${escapeHTML(r.Quarter || "-")}</td>
    <td class="num">
      <span class="progress"><span class="progress-bar ${pctClass}" style="width:${pct}%"></span></span>
      <span class="mono" style="margin-left:6px">${pct}%</span>
    </td>
    <td><span class="pill ${statusPill}">${escapeHTML(r.Status || "-")}</span></td>
    <td>${escapeHTML(r.Deadline || "-")}</td>
    <td class="num">${r["Budget (Rp)"] ? fmtIDR(r["Budget (Rp)"]) : "-"}</td>
    <td>
      <button class="btn btn-sm" data-action="edit" data-id="${r.id}" data-idx="${i}">Edit</button>
      <button class="btn btn-sm btn-danger" data-action="del" data-id="${r.id}">Hapus</button>
    </td>
  </tr>`;
}

function progFormHTML(r = {}) {
  const cfg = window.DASHBOARD_CONFIG;
  return `<form id="prog-form">
    <div class="form-grid">
      <div class="form-row">
        <label>Program ID
        <input class="input" name="programId" value="${r["Program ID"] || r.programId || "PROG-2026-" + Date.now().toString().slice(-4)}" required />
        </label>
      </div>
      <div class="form-row">
        <label>PIC Penanggung Jawab
        <select class="select" name="pic" required>
          ${cfg.picList.map(p => `<option ${r.pic === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row" style="grid-column:1/-1">
        <label>Nama Program
        <input class="input" name="nama" value="${r.nama || ""}" required />
        </label>
      </div>
      <div class="form-row">
        <label>Quarter
        <select class="select" name="Quarter">
          <option ${r.Quarter === "Q1" ? "selected" : ""}>Q1</option>
          <option ${r.Quarter === "Q2" ? "selected" : ""}>Q2</option>
          <option ${r.Quarter === "Q3" ? "selected" : ""}>Q3</option>
          <option ${r.Quarter === "Q4" ? "selected" : ""}>Q4</option>
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Tahun
        <input class="input" type="number" name="Tahun" value="${r.Tahun || 2026}" />
        </label>
      </div>
      <div class="form-row">
        <label>Tanggal Mulai
        <input class="input" type="date" name="Mulai" value="${r.Mulai || todayISO()}" />
        </label>
      </div>
      <div class="form-row">
        <label>Deadline
        <input class="input" type="date" name="Deadline" value="${r.Deadline || ""}" />
        </label>
      </div>
      <div class="form-row">
        <label>Progress (%)
        <input class="input" type="number" min="0" max="100" name="Progress" value="${r.Progress || 0}" />
        </label>
      </div>
      <div class="form-row">
        <label>Status
        <select class="select" name="Status">
          ${["Planning", "On Track", "At Risk", "Delayed", "Done", "Cancelled"].map(s => `<option ${r.Status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Budget (Rp)
        <input class="input" type="number" name="budget" value="${r.budget || 0}" />
        </label>
      </div>
    </div>
    <div class="form-row">
      <label>Risiko
      <textarea class="textarea" name="risiko">${r.risiko || ""}</textarea>
      </label>
    </div>
    <div style="display:flex;gap:var(--space-2);justify-content:flex-end;margin-top:var(--space-4)">
      <button type="button" class="btn btn-ghost" id="form-cancel">Batal</button>
      <button type="submit" class="btn btn-primary">Simpan</button>
    </div>
  </form>`;
}

$("#prog-add").onclick = () => {
  if (!Session.pic) { toast("error", "Login dulu"); return; }
  openModal("Tambah Program", progFormHTML());
  $("#form-cancel").onclick = closeModal;
  $("#prog-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.create("program", props);
      toast("success", "Program tersimpan");
      closeModal();
      loadProgram();
    } catch (err) { toast("error", err.message); }
  };
};

async function editProgram(id, row) {
  const r = row || Store.get("program").find(x => x.id === id);
  if (!r) { toast("error", "Row tidak ditemukan, refresh dulu"); return; }
  openModal("Edit Program", progFormHTML(r));
  $("#form-cancel").onclick = closeModal;
  $("#prog-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.update("program", id, props, r._editTime);
      toast("success", "Program diupdate");
      closeModal();
      loadProgram();
    } catch (err) { toast("error", err.message); }
  };
}

async function deleteProgram(id) {
  const ok = await confirmDialog({ title: "Hapus program kerja?", body: "Tindakan ini tidak dapat dibatalkan.", danger: true, confirmText: "Hapus" });
  if (!ok) return;
  try {
    await API.remove("program", id);
    toast("success", "Program dihapus");
    loadProgram();
  } catch (e) { toast("error", e.message); }
}

// ============================================================
// V2 CRUD: JOBDESK HARIAN
// ============================================================
async function loadJobdesk() {
  const list = $("#job-list");
  if (!Session.pic) {
    list.innerHTML = `<div class="empty-state">
      <h3>Login dulu</h3><p>Jobdesk butuh login.</p>
    </div>`;
    return;
  }
  list.setAttribute("aria-busy", "true");
  list.innerHTML = skeletonTable(6, 9);
  try {
    const res = await API.query("jobdesk");
    let rows = res.results || [];
    const fDate = $("#job-filter-date").value;
    const fStatus = $("#job-filter-status").value;
    if (fDate) rows = rows.filter(r => (r.Tanggal?.start || r.Tanggal) === fDate);
    if (fStatus) rows = rows.filter(r => r.Status === fStatus);
    // 7-day history fallback: jika today kosong, tampilkan 7 hari terakhir
    let historyMode = false;
    if (rows.length === 0 && fDate) {
      const today = new Date(fDate);
      const cutoff = new Date(today.getTime() - 7 * 86400000).toISOString().split("T")[0];
      const allRes = await API.query("jobdesk");
      const allRows = (allRes.results || []).filter(r => {
        const t = r.Tanggal?.start || r.Tanggal;
        return t && t >= cutoff && t <= fDate;
      });
      if (allRows.length > 0) {
        rows = allRows;
        historyMode = true;
      }
    }
    if (rows.length === 0) {
      list.innerHTML = `<div class="empty-state">
        <h3>Belum ada jobdesk</h3>
        <p>Catat kerjaan Mada, Riza, Yudi via form atau input langsung di Notion DB Jobdesk.</p>
      </div>`;
      return;
    }
    list.innerHTML = (historyMode ? `<div class="banner banner-warn" style="margin-bottom:var(--space-3)">ℹ️ Jobdesk hari ini kosong. Menampilkan 7 hari terakhir (${rows.length} baris).</div>` : "") + `<table class="crud-table">
      <thead><tr>
        <th>Jobdesk ID</th><th>PIC</th><th>Tanggal</th><th>Jobdesk</th>
        <th>Target</th><th>Actual</th><th>Prioritas</th><th>Status</th><th>Approval</th><th></th>
      </tr></thead>
      <tbody>${rows.map(jobRowHTML).join('')}</tbody>
    </table>`;
    list.querySelectorAll("[data-action=edit]").forEach(b => b.onclick = () => editJob(b.dataset.id, rows[+b.dataset.idx]));
    list.querySelectorAll("[data-action=del]").forEach(b => b.onclick = () => deleteJob(b.dataset.id));
    list.querySelectorAll("[data-action=approve]").forEach(b => b.onclick = () => approveJob(b.dataset.id, "Approved"));
    list.querySelectorAll("[data-action=reject]").forEach(b => b.onclick = () => approveJob(b.dataset.id, "Rejected"));
    list.removeAttribute("aria-busy");
  } catch (e) {
    list.removeAttribute("aria-busy");
    list.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${escapeHTML(e.message)}</p></div>`;
  }
}

function jobRowHTML(r, i = 0) {
  const statusPill = { "To Do": "muted", "In Progress": "info", "Done": "success", "Blocked": "danger" }[r.Status] || "muted";
  const prioPill = { "P1": "danger", "P2": "warning", "P3": "info" }[r.Prioritas] || "muted";
  const approvalPill = { "Pending": "warning", "Approved": "success", "Rejected": "danger" }[r.Approval] || "muted";
  const isOwner = Session.isOwner();
  const showApproveBtn = isOwner && r.Approval !== "Approved";
  const showRejectBtn = isOwner && r.Approval !== "Rejected";
  const jobId = r["Jobdesk ID"] || r.jobdeskId || (r.PIC ? `Jobdesk ${r.PIC} ${(r.Tanggal || "").slice(5)}` : (r.id ? r.id.slice(0, 8) : "-"));
  const job = (r.Jobdesk || r.jobdesk || "");
  const target = (r["Target Output"] || r.target || "");
  const actual = (r["Actual Output"] || r.actual || "");
  return `<tr>
    <td class="mono">${escapeHTML(jobId)}</td>
    <td>${escapeHTML(r.PIC || "-")}</td>
    <td>${escapeHTML(r.Tanggal || "-")}</td>
    <td>${escapeHTML(job.slice(0, 60))}${job.length > 60 ? "…" : ""}</td>
    <td>${escapeHTML(target.slice(0, 40))}${target.length > 40 ? "…" : ""}</td>
    <td>${escapeHTML(actual.slice(0, 40))}${actual.length > 40 ? "…" : ""}</td>
    <td><span class="pill ${prioPill}">${escapeHTML(r.Prioritas || "-")}</span></td>
    <td><span class="pill ${statusPill}">${escapeHTML(r.Status || "-")}</span></td>
    <td>
      <span class="pill ${approvalPill}">${escapeHTML(r.Approval || "—")}</span>
      ${showApproveBtn ? `<button class="btn btn-sm btn-success" data-action="approve" data-id="${r.id}" title="Approve">✓</button>` : ""}
      ${showRejectBtn ? `<button class="btn btn-sm btn-danger" data-action="reject" data-id="${r.id}" title="Reject">✗</button>` : ""}
      ${r.Approval_By ? `<small class="muted">by ${escapeHTML(r.Approval_By).slice(0, 12)}</small>` : ""}
    </td>
    <td>
      <button class="btn btn-sm" data-action="edit" data-id="${r.id}" data-idx="${i}">Edit</button>
      <button class="btn btn-sm btn-danger" data-action="del" data-id="${r.id}">Hapus</button>
    </td>
  </tr>`;
}

async function approveJob(id, decision) {
  if (!Session.isOwner()) {
    toast("error", "Hanya owner yang bisa approve/reject");
    return;
  }
  const row = Store.get("jobdesk").find(r => r.id === id);
  if (!row) return;
  const ok = await confirmDialog({
    title: decision + " Jobdesk",
    body: `<p>PIC: <strong>${escapeHTML(row.PIC)}</strong></p>
           <p>Job: ${escapeHTML(row.Jobdesk || row.jobdesk || "").slice(0, 80)}</p>
           <p>Tandai jobdesk ini sebagai <strong>${decision}</strong>?</p>`,
    okText: decision,
    danger: decision === "Rejected",
  });
  if (!ok) return;
  try {
    await API.update("jobdesk", id, {
      Approval: decision,
      "Approval_By": Session.pic,
      "Approval_Time": todayISO(),
    }, row._editTime);
    Audit.log({ pic: Session.pic, action: decision.toLowerCase(), db: "jobdesk", rowId: id });
    toast("success", "Jobdesk " + decision);
    loadJobdesk();
  } catch (e) {
    toast("error", "Approve gagal: " + e.message);
  }
}

function jobFormHTML(r = {}) {
  const cfg = window.DASHBOARD_CONFIG;
  return `<form id="job-form">
    <div class="form-grid">
      <div class="form-row">
        <label>Jobdesk ID
        <input class="input" name="jobdeskId" value="${r["Jobdesk ID"] || r.jobdeskId || "JOB-" + todayISO().replace(/-/g, "") + "-" + (Session.pic || "X").split(" ")[0] + "-" + Date.now().toString().slice(-3)}" required />
        </label>
      </div>
      <div class="form-row">
        <label>PIC
        <select class="select" name="PIC" required>
          ${cfg.picList.map(p => `<option ${r.PIC === p || (!r.PIC && p === Session.pic) ? "selected" : ""}>${p}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Tanggal
        <input class="input" type="date" name="Tanggal" value="${r.Tanggal || todayISO()}" required />
        </label>
      </div>
      <div class="form-row">
        <label>Kategori
        <select class="select" name="Kategori">
          ${["Harian", "Mingguan", "Bulanan"].map(s => `<option ${r.Kategori === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Prioritas
        <select class="select" name="Prioritas">
          ${["P1", "P2", "P3"].map(s => `<option ${r.Prioritas === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Status
        <select class="select" name="Status">
          ${["To Do", "In Progress", "Done", "Blocked"].map(s => `<option ${r.Status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        </label>
      </div>
      <div class="form-row">
        <label>Approval
        <select class="select" name="Approval">
          ${["Pending", "Approved", "Rejected"].map(s => `<option ${(r.Approval || "Pending") === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        </label>
      </div>
    </div>
    <div class="form-row">
      <label>Jobdesk
      <textarea class="textarea" name="Jobdesk" required>${r.Jobdesk || r.jobdesk || ""}</textarea>
      </label>
    </div>
    <div class="form-grid">
      <div class="form-row">
        <label>Target Output
        <textarea class="textarea" name="target">${r.target || r["Target Output"] || ""}</textarea>
        </label>
      </div>
      <div class="form-row">
        <label>Actual Output
        <textarea class="textarea" name="actual">${r.actual || r["Actual Output"] || ""}</textarea>
        </label>
      </div>
    </div>
    <div class="form-row">
      <label>Bukti (URL)
      <input class="input" type="url" name="Bukti" value="${r.Bukti || ""}" />
      </label>
    </div>
    <div style="display:flex;gap:var(--space-2);justify-content:flex-end;margin-top:var(--space-4)">
      <button type="button" class="btn btn-ghost" id="form-cancel">Batal</button>
      <button type="submit" class="btn btn-primary">Simpan</button>
    </div>
  </form>`;
}

$("#job-add").onclick = () => {
  if (!Session.pic) { toast("error", "Login dulu"); return; }
  openModal("Tambah Jobdesk", jobFormHTML());
  $("#form-cancel").onclick = closeModal;
  $("#job-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.create("jobdesk", props);
      toast("success", "Jobdesk tersimpan");
      closeModal();
      loadJobdesk();
    } catch (err) { toast("error", err.message); }
  };
};

async function editJob(id, row) {
  const r = row || Store.get("jobdesk").find(x => x.id === id);
  if (!r) { toast("error", "Row tidak ditemukan, refresh dulu"); return; }
  openModal("Edit Jobdesk", jobFormHTML(r));
  $("#form-cancel").onclick = closeModal;
  $("#job-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const props = Object.fromEntries(fd);
    try {
      await API.update("jobdesk", id, props, r._editTime);
      toast("success", "Jobdesk diupdate");
      closeModal();
      loadJobdesk();
    } catch (err) { toast("error", err.message); }
  };
}

async function deleteJob(id) {
  const ok = await confirmDialog({ title: "Hapus jobdesk?", body: "Tindakan ini tidak dapat dibatalkan.", danger: true, confirmText: "Hapus" });
  if (!ok) return;
  try {
    await API.remove("jobdesk", id);
    toast("success", "Jobdesk dihapus");
    loadJobdesk();
  } catch (e) { toast("error", e.message); }
}

// ============================================================
// V2-B: SOW (view only)
// ============================================================
async function loadSOW() {
  const list = $("#sow-list");
  if (!Session.pic) {
    list.innerHTML = `<div class="empty-state">
      <h3>Login dulu</h3><p>SOW butuh login untuk view per-PIC.</p>
    </div>`;
    return;
  }
  list.setAttribute("aria-busy", "true");
  list.innerHTML = skeletonTable(8, 8);
  try {
    const res = await API.query("sow");
    let rows = res.results || [];
    const fPic = $("#sow-filter-pic").value;
    const fStatus = $("#sow-filter-status").value;
    if (fPic) rows = rows.filter(r => r.PIC === fPic);
    if (fStatus) rows = rows.filter(r => r.Status === fStatus);
    if (rows.length === 0) {
      list.innerHTML = `<div class="empty-state">
        <h3>Belum ada SOW</h3>
        <p>SOW biasanya diinput oleh owner / Mada via Notion langsung.</p>
      </div>`;
      return;
    }
    list.innerHTML = `<table class="crud-table">
      <thead><tr>
        <th>SOW ID</th><th>PIC</th><th>Kategori</th><th>Deskripsi</th>
        <th>Frekuensi</th><th>Bobot</th><th>Status</th><th>Effective</th>
      </tr></thead>
      <tbody>${rows.map(r => {
        const statusPill = { "Active": "success", "Paused": "warning", "Completed": "info" }[r.Status] || "muted";
        const sowId = r["SOW ID"] || r.sowId || (r.PIC ? `SOW ${r.PIC}` : (r.id ? r.id.slice(0, 8) : "-"));
        const kat = (r.Kategori || "");
        const desc = (r.Deskripsi || "");
        return `<tr>
          <td class="mono">${escapeHTML(sowId)}</td>
          <td>${escapeHTML(r.PIC || "-")}</td>
          <td>${escapeHTML(kat.slice(0, 50))}${kat.length > 50 ? "…" : ""}</td>
          <td>${escapeHTML(desc.slice(0, 60))}${desc.length > 60 ? "…" : ""}</td>
          <td>${escapeHTML(r.Frekuensi || "-")}</td>
          <td class="num">${r["Bobot (%)"] || r.bobot || 0}%</td>
          <td><span class="pill ${statusPill}">${escapeHTML(r.Status || "-")}</span></td>
          <td>${escapeHTML(r["Effective From"] || r.effective || "-")}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
    list.removeAttribute("aria-busy");
  } catch (e) {
    list.removeAttribute("aria-busy");
    list.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${escapeHTML(e.message)}</p></div>`;
  }
}

// ============================================================
// 02 LEADERBOARD (auto-compute dari KPI)
// ============================================================
function renderLeaderboard() {
  const allKPI = Store.get("kpi");
  const byDivisi = { marketing: [], proyek: [], media: [], admin: [] };
  // Map PIC → divisi (dari FALLBACK.pic)
  const picToDivisi = {};
  FALLBACK.pic.forEach(p => {
    if (p.tag.includes("Marketing")) picToDivisi[p.nama] = "marketing";
    else if (p.tag.includes("Proyek") || p.tag.includes("Purchasing")) picToDivisi[p.nama] = "proyek";
    else if (p.tag.includes("Media")) picToDivisi[p.nama] = "media";
    else if (p.tag.includes("Admin")) picToDivisi[p.nama] = "admin";
  });
  allKPI.forEach(k => {
    const d = picToDivisi[k.PIC];
    if (d && k.Target > 0) byDivisi[d].push(k);
  });
  const grid = $("#leaderboard-grid");
  grid.style.cssText = "";
  grid.className = "bento";
  let html = "";
  for (const [key, list] of Object.entries(byDivisi)) {
    if (list.length === 0) continue;
    const totals = {};
    list.forEach(k => {
      const skor = (k.Realisasi / k.Target) * 100;
      if (!totals[k.PIC]) totals[k.PIC] = { skor: 0, n: 0 };
      totals[k.PIC].skor += skor;
      totals[k.PIC].n++;
    });
    const ranked = Object.entries(totals)
      .map(([pic, t]) => ({ pic, avg: t.skor / t.n, n: t.n }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
    const labelMap = { marketing: "MARKETING", proyek: "PROYEK", media: "MEDIA", admin: "ADMIN" };
    const colorMap = { marketing: "var(--accent)", proyek: "var(--success)", media: "var(--info)", admin: "var(--warning)" };
    html += `<div class="bento-card span-2">
      <div class="bento-eyebrow" style="color:${colorMap[key]}">${labelMap[key]}</div>`;
    if (ranked.length === 0) {
      html += `<div class="bento-foot" style="color:var(--text-muted)">Belum ada data KPI untuk divisi ini.</div>`;
    } else {
      ranked.forEach((r, i) => {
        const topClass = i === 0 ? "success" : i === 1 ? "info" : "warning";
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">
          <div>
            <span class="pill ${topClass}" style="margin-right:8px">#${i+1}</span>
            <strong>${r.pic}</strong>
            <span class="muted mono" style="font-size:0.75rem;margin-left:8px">${r.n} KPI</span>
          </div>
          <div class="mono tnum"><strong>${r.avg.toFixed(0)}</strong><span class="muted">/100</span></div>
        </div>`;
      });
    }
    html += `</div>`;
  }
  if (!html) html = `<div class="empty-state"><h3>Belum ada data KPI</h3><p>Leaderboard auto-compute dari KPI Personal. Login + tambah KPI Personal untuk Mada, Riza, dst.</p></div>`;
  grid.innerHTML = html;
}

// ============================================================
// 03 KPI SCORE CARD (deprecated V2.1 — content moved to Referensi accordion in index.html)
// ============================================================
function renderKPI5D() { /* no-op: 5D dim shown in Referensi section */ }

// ============================================================
// FILTER BAR WIRE-UP
// ============================================================
function fillPICDropdowns() {
  const cfg = window.DASHBOARD_CONFIG;
  ["#kpi-filter-pic", "#sow-filter-pic"].forEach(sel => {
    const el = $(sel);
    if (el) cfg.picList.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p; opt.textContent = p;
      el.appendChild(opt);
    });
  });
  // Default filter: PIC logged in
  if (Session.pic) {
    ["#kpi-filter-pic", "#sow-filter-pic"].forEach(sel => { $(sel).value = Session.pic; });
  }
}

$("#kpi-filter-reset").onclick = () => {
  $("#kpi-filter-pic").value = Session.pic || "";
  $("#kpi-filter-periode").value = "";
  $("#kpi-filter-status").value = "";
  loadKPI();
};
$("#prog-filter-reset").onclick = () => {
  $("#prog-filter-quarter").value = "";
  $("#prog-filter-status").value = "";
  loadProgram();
};
$("#job-filter-reset").onclick = () => {
  $("#job-filter-date").value = "";
  $("#job-filter-status").value = "";
  loadJobdesk();
};
$("#sow-filter-reset").onclick = () => {
  $("#sow-filter-pic").value = Session.pic || "";
  $("#sow-filter-status").value = "";
  loadSOW();
};

["kpi-filter-pic", "kpi-filter-periode", "kpi-filter-status"].forEach(id => {
  $("#" + id).addEventListener("change", loadKPI);
});
["prog-filter-quarter", "prog-filter-status"].forEach(id => {
  $("#" + id).addEventListener("change", loadProgram);
});
["job-filter-date", "job-filter-status"].forEach(id => {
  $("#" + id).addEventListener("change", loadJobdesk);
});
["sow-filter-pic", "sow-filter-status"].forEach(id => {
  $("#" + id).addEventListener("change", loadSOW);
});

// ============================================================
// NAV ACTIVE STATE
// ============================================================
function setupNav() {
  const links = $$(".nav-link");
  const sections = links.map(l => $(l.getAttribute("href"))).filter(Boolean);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const active = links.find(l => l.getAttribute("href") === "#" + e.target.id);
        if (active) active.classList.add("active");
      }
    });
  }, {rootMargin: "-40% 0px -55% 0px"});
  sections.forEach(s => obs.observe(s));
}

// ============================================================
// SEED DEMO DATA (first run)
// ============================================================
function seedDemo() {
  if (Store.get("kpi").length > 0) return;
  const today = todayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const sample = [
    { "KPI ID": "KPI-2026-0001", "PIC": "Riza", "Divisi": "Marketing", "Periode": "Bulanan", Target: 40, Realisasi: 38, Satuan: "Lead", Status: "On Track", Catatan: "Closing 4 dari lead 38", _editTime: new Date().toISOString(), id: "seed-1" },
    { "KPI ID": "KPI-2026-0002", "PIC": "Riza", "Divisi": "Marketing", "Periode": "Bulanan", Target: 6, Realisasi: 4, Satuan: "Closing", Status: "At Risk", Catatan: "Butuh加速 Q3 akhir", _editTime: new Date().toISOString(), id: "seed-2" },
    { "KPI ID": "KPI-2026-0003", "PIC": "Yudi (Sdek)", "Divisi": "Marketing", "Periode": "Bulanan", Target: 5, Realisasi: 3, Satuan: "Closing", Status: "At Risk", Catatan: "Walk-in 22", _editTime: new Date().toISOString(), id: "seed-3" },
    { "KPI ID": "KPI-2026-0004", "PIC": "Rizal", "Divisi": "Proyek", "Periode": "Mingguan", Target: 100, Realisasi: 95, Satuan: "%", Status: "On Track", Catatan: "BAST on-time", _editTime: new Date().toISOString(), id: "seed-4" },
    { "KPI ID": "KPI-2026-0005", "PIC": "Sinta", "Divisi": "Proyek", "Periode": "Bulanan", Target: 15, Realisasi: 12, Satuan: "Unit", Status: "On Track", Catatan: "Best price 3 vendor", _editTime: new Date().toISOString(), id: "seed-5" },
    { "KPI ID": "KPI-2026-0006", "PIC": "Novita", "Divisi": "Admin", "Periode": "Bulanan", Target: 10, Realisasi: 8, Satuan: "Unit", Status: "On Track", Catatan: "Closing file 8", _editTime: new Date().toISOString(), id: "seed-6" },
    { "KPI ID": "KPI-2026-0007", "PIC": "Reni", "Divisi": "Media", "Periode": "Mingguan", Target: 6, Realisasi: 7, Satuan: "Unit", Status: "Achieved", Catatan: "3 pilar on track", _editTime: new Date().toISOString(), id: "seed-7" },
  ];
  Store.set("kpi", sample);

  const sampleProg = [
    { "Program ID": "PROG-2026-001", nama: "Ekspansi klien Q3", pic: "Mada", Quarter: "Q3", Tahun: 2026, Mulai: "2026-07-01", Deadline: "2026-09-30", Progress: 35, Status: "On Track", budget: 50000000, risiko: "Klien kedua belum confirm", _editTime: new Date().toISOString(), id: "seed-p1" },
    { "Program ID": "PROG-2026-002", nama: "Onboarding admin polyvalent", pic: "Novita", Quarter: "Q3", Tahun: 2026, Mulai: "2026-07-15", Deadline: "2026-10-15", Progress: 20, Status: "On Track", budget: 5000000, risiko: "Butuh cross-train Sinta", _editTime: new Date().toISOString(), id: "seed-p2" },
    { "Program ID": "PROG-2026-003", nama: "Coaching 3 pilar (Mada)", pic: "Mada", Quarter: "Q3", Tahun: 2026, Mulai: "2026-07-20", Deadline: "2026-09-20", Progress: 50, Status: "On Track", budget: 0, risiko: "-", _editTime: new Date().toISOString(), id: "seed-p3" },
  ];
  Store.set("program", sampleProg);

  const sampleJob = [
    { "Jobdesk ID": "JOB-20260725-Mada-01", PIC: "Mada", Tanggal: today, Jobdesk: "Konsolidasi KPI Q3 lintas divisi", target: "11 PIC review", actual: "8 PIC reviewed", Prioritas: "P1", Status: "In Progress", Kategori: "Harian", _editTime: new Date().toISOString(), id: "seed-j1" },
    { "Jobdesk ID": "JOB-20260725-Mada-02", PIC: "Mada", Tanggal: today, Jobdesk: "Approve BAST 3 unit", target: "3 BAST", actual: "1 BAST", Prioritas: "P1", Status: "In Progress", Kategori: "Harian", _editTime: new Date().toISOString(), id: "seed-j2" },
    { "Jobdesk ID": "JOB-20260725-Riza-01", PIC: "Riza", Tanggal: today, Jobdesk: "Lead gen Meta ads harian", target: "3 lead/hari", actual: "4 lead", Prioritas: "P1", Status: "Done", Kategori: "Harian", _editTime: new Date().toISOString(), id: "seed-j3" },
    { "Jobdesk ID": "JOB-20260725-Rizal-01", PIC: "Rizal", Tanggal: today, Jobdesk: "Brief mandor 2 site", target: "2 site", actual: "2 site", Prioritas: "P1", Status: "Done", Kategori: "Harian", _editTime: new Date().toISOString(), id: "seed-j4" },
  ];
  Store.set("jobdesk", sampleJob);

  const sampleSOW = [
    { "SOW ID": "SOW-Mada-01", PIC: "Mada", Kategori: "Operasional, Strategis", Deskripsi: "Konsolidasi KPI + approval lintas divisi", Frekuensi: "Harian", "Bobot (%)": 30, Status: "Active", "Effective From": "2026-01-01", _editTime: new Date().toISOString(), id: "seed-s1" },
    { "SOW ID": "SOW-Rizal-01", PIC: "Rizal", Kategori: "Operasional", Deskripsi: "Daily task proyek + brief mandor", Frekuensi: "Harian", "Bobot (%)": 25, Status: "Active", "Effective From": "2026-01-01", _editTime: new Date().toISOString(), id: "seed-s2" },
    { "SOW ID": "SOW-Sinta-01", PIC: "Sinta", Kategori: "Operasional, Compliance", Deskripsi: "Stopper kualitas material + best price 3 vendor", Frekuensi: "Harian", "Bobot (%)": 20, Status: "Active", "Effective From": "2026-01-01", _editTime: new Date().toISOString(), id: "seed-s3" },
  ];
  Store.set("sow", sampleSOW);
}

// ============================================================
// BOOT
// ============================================================
function refreshAll() {
  loadKPI();
  loadDivisi();
  loadProgram();
  loadJobdesk();
  loadSOW();
  // renderLeaderboard() disabled — section hidden
  if (Session.isOwner()) renderMasterView();
  renderAlertBadge();
  renderAlertPanel($("#alerts-list"));
}

function toggleOwnerUI() {
  const show = Session.isOwner();
  $$(".owner-only").forEach(el => { el.hidden = !show; });
  if (show) renderMasterView();
  renderAlertBadge();
}

document.addEventListener("DOMContentLoaded", async () => {
  Session.load();
  updateSessionPill();
  fillPICDropdowns();

  // Dynamic date stamp (hero + brand)
  const bulanID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const now = new Date();
  const dateStr = `${now.getDate()} ${bulanID[now.getMonth()]} ${now.getFullYear()}`;
  const brand = $("#brand-sub");
  if (brand) brand.textContent = `PT Syahfalah Global + Lembayung · ${dateStr}`;
  const eyebrow = $("#hero-eyebrow");
  if (eyebrow) eyebrow.textContent = `Live · ${dateStr}`;

  // V1 sections (always render)
  renderPIC();

  // V2 sections (after seed + login)
  const cfg = window.DASHBOARD_CONFIG;
  if (cfg.mode === "demo") seedDemo();
  $("#job-filter-date").value = todayISO();
  refreshAll();
  setupNav();
  toggleOwnerUI();

  // Audit hook: wrap API methods to log changes
  if (typeof applyAuditHooks === "function") applyAuditHooks();
  // Show alert badge link when logged in
  const updateBadgeLink = () => {
    const link = $("#alert-badge-link");
    if (link) link.hidden = !Session.pic;
  };
  updateBadgeLink();
  document.addEventListener("session:updated", updateBadgeLink);

  // Master view filter listeners
  ["master-filter-divisi", "master-filter-status"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", () => renderMasterView());
  });
  document.getElementById("master-filter-reset")?.addEventListener("click", () => {
    if ($("#master-filter-divisi")) $("#master-filter-divisi").value = "";
    if ($("#master-filter-status")) $("#master-filter-status").value = "";
    renderMasterView();
  });

  // When user logs in/out, update owner UI
  const origUpdate = updateSessionPill;
  // Hook: after login modal confirms, refresh
  document.addEventListener("session:updated", () => { toggleOwnerUI(); refreshAll(); });
});

// Auto-refresh tiap 60 detik (kalau tab aktif)
let pollTimer = null;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(pollTimer);
    pollTimer = null;
  } else {
    if (Session.pic) refreshAll();
    if (!pollTimer) pollTimer = setInterval(() => {
      if (Session.pic && !document.hidden) refreshAll();
    }, window.DASHBOARD_CONFIG.pollIntervalMs);
  }
});
