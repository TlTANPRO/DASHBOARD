// lib/api.js — data layer: Notion API via Cloudflare Worker / localStorage demo

import { Session } from "./auth.js";
import { cacheTTL, invalidate } from "./cache.js";

const MODE = (window.DASHBOARD_CONFIG?.mode || "demo").toLowerCase();
const WORKER = window.DASHBOARD_CONFIG?.workerBase;
const DBNAMES = window.DASHBOARD_CONFIG?.databases || {};

const LS_PREFIX = "dvb2-";

function lsKey(name) {
  return LS_PREFIX + name;
}

function lsRead(name) {
  try {
    const raw = localStorage.getItem(lsKey(name));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function lsWrite(name, data) {
  try {
    localStorage.setItem(lsKey(name), JSON.stringify(data));
  } catch (e) {
    console.warn("LS write fail", name, e);
  }
}

// ============================================================================
// FIELD NORMALIZATION — Notion schema → dashboard-friendly names
// ============================================================================
const FIELD_MAP = {
  // KPI: "Realisasi" → "Actual", keep "Target"
  kpi: {
    Actual: "Realisasi",
    PIC: "PIC",
    Status: "Status",
    Indikator: "KPI",
    Divisi: "Divisi",
    Tipe: "Tipe",
    Periode: "Periode",
    Satuan: "Satuan",
    Catatan: "Catatan",
    Target: "Target",
    "KPI ID": "KPI ID",
  },
  // SOW: keep as-is
  sow: {
    PIC: "PIC",
    Status: "Status",
    Judul: "SOW ID",
    Bobot: "Bobot (%)",
    Frekuensi: "Frekuensi",
    Kategori: "Kategori",
    Tahun: "Tahun",
    Deskripsi: "Deskripsi",
  },
  // Program: "PIC Penanggung Jawab" → "PIC", "Nama Program" → "Judul"
  program: {
    PIC: "PIC Penanggung Jawab",
    Status: "Status",
    Judul: "Nama Program",
    "Program ID": "Program ID",
    Quarter: "Quarter",
    Tahun: "Tahun",
    Deadline: "Deadline",
    "Tanggal Mulai": "Tanggal Mulai",
    Progress: "Progress (%)",
    Budget: "Budget (Rp)",
    "Actual Spend": "Actual Spend (Rp)",
    Risiko: "Risiko",
  },
  // Jobdesk: keep mostly as-is
  jobdesk: {
    PIC: "PIC",
    Status: "Status",
    Aktivitas: "Jobdesk",
    Output: "Actual Output",
    Target: "Target Output",
    Tanggal: "Tanggal",
    Prioritas: "Prioritas",
    Kategori: "Kategori",
    "Jobdesk ID": "Jobdesk ID",
  },
};

function normalizeRow(dbName, row) {
  if (!row) return row;
  const map = FIELD_MAP[dbName] || {};
  const out = { id: row.id, _editTime: row._editTime, createdAt: row.createdAt };
  // Map: dashboardField = notionField
  for (const [dashField, notionField] of Object.entries(map)) {
    if (row[notionField] !== undefined) {
      out[dashField] = row[notionField];
    } else if (row[dashField] !== undefined) {
      out[dashField] = row[dashField];
    }
  }
  // Keep unknown fields too (passthrough)
  for (const [k, v] of Object.entries(row)) {
    if (!(k in out) && !["id", "_editTime", "createdAt"].includes(k)) {
      out[k] = v;
    }
  }
  return out;
}

function denormalizeRow(dbName, row) {
  // Reverse: dashboardField → notionField
  const map = FIELD_MAP[dbName] || {};
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (["id", "_editTime", "createdAt"].includes(k)) continue;
    const notionField = map[k] || k;
    out[notionField] = v;
  }
  return out;
}

// Notion API via worker
async function workerCall(dbName, opts = {}) {
  if (!WORKER) throw new Error("Worker URL not configured");
  const dbId = DBNAMES[dbName];
  if (!dbId) throw new Error(`Database "${dbName}" not configured`);

  const path = `/notion/v1/databases/${dbId}/query`;
  const url = `${WORKER}${path}`;

  const method = opts.method || "POST";
  const body = opts.body || (method === "POST" || method === "PATCH" ? {} : undefined);

  const headers = {
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };
  if (Session.token) {
    headers["Authorization"] = `Bearer ${Session.token}`;
  }
  if (Session.pic) {
    headers["X-PIC"] = Session.pic;
  }
  if (opts.editTime) {
    headers["X-Edit-Time"] = opts.editTime;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${dbName}: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  // Worker returns { object: "list", results: [...flattened rows], has_more, next_cursor }
  if (data.results && Array.isArray(data.results)) {
    return data.results.map((r) => normalizeRow(dbName, r));
  }
  return data;
}

// Build Notion properties payload for create/update
function buildNotionProps(dbName, row) {
  const notionRow = denormalizeRow(dbName, row);
  const props = {};
  for (const [k, v] of Object.entries(notionRow)) {
    if (v === null || v === undefined || v === "") continue;
    // Heuristic: if field name suggests select, send as select; else rich_text
    if (["Status", "PIC", "PIC Penanggung Jawab", "Periode", "Divisi", "Tipe", "Satuan", "Quarter", "Approval", "Prioritas", "Kategori", "Frekuensi"].includes(k)) {
      props[k] = { select: { name: String(v) } };
    } else if (["Bobot (%)", "Tahun", "Target", "Realisasi", "Progress (%)", "Budget (Rp)", "Actual Spend (Rp)"].includes(k)) {
      props[k] = { number: Number(v) || 0 };
    } else if (["Deadline", "Tanggal", "Tanggal Mulai", "Effective From", "Approval_Time"].includes(k)) {
      props[k] = { date: { start: String(v) } };
    } else if (["Bukti"].includes(k)) {
      props[k] = { url: String(v) };
    } else {
      // Title field or rich text
      if (k === "KPI ID" || k === "SOW ID" || k === "Program ID" || k === "Jobdesk ID") {
        props[k] = { title: [{ text: { content: String(v) } }] };
      } else {
        props[k] = { rich_text: [{ text: { content: String(v) } }] };
      }
    }
  }
  return props;
}

// ============================================================================
// PUBLIC API
// ============================================================================
export const API = {
  mode: MODE,

  // ---------- KPI ----------
  async listKPI(force = false) {
    if (force) invalidate("kpi");
    return cacheTTL("kpi", 60, async () => {
      if (MODE === "live") return await workerCall("kpi");
      return lsRead("kpi") || [];
    });
  },
  async createKPI(record) {
    if (MODE === "live") {
      const dbId = DBNAMES.kpi;
      const props = buildNotionProps("kpi", record);
      const res = await fetch(`${WORKER}/notion/v1/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ parent: { database_id: dbId }, properties: props }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const data = await res.json();
      const list = await this.listKPI();
      return normalizeRow("kpi", data);
    }
    const list = lsRead("kpi") || [];
    const id = `kpi-${Date.now()}`;
    const newRec = { id, ...record, createdAt: new Date().toISOString() };
    list.push(newRec);
    lsWrite("kpi", list);
    return newRec;
  },
  async updateKPI(id, patch, editTime = null) {
    if (MODE === "live") {
      const props = buildNotionProps("kpi", patch);
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
          "X-PIC": Session.pic || "",
          ...(editTime ? { "X-Edit-Time": editTime } : {}),
        },
        body: JSON.stringify({ properties: props }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Update failed: ${res.status} ${t.slice(0, 100)}`);
      }
      return await this.listKPI(true);
    }
    const list = lsRead("kpi") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    lsWrite("kpi", list);
    return list[idx];
  },
  async deleteKPI(id) {
    if (MODE === "live") {
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ archived: true }),
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      return { ok: true };
    }
    const list = lsRead("kpi") || [];
    lsWrite("kpi", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // ---------- PROGRAM ----------
  async listProgram(force = false) {
    if (force) invalidate("program");
    return cacheTTL("program", 60, async () => {
      if (MODE === "live") return await workerCall("program");
      return lsRead("program") || [];
    });
  },
  async createProgram(record) {
    if (MODE === "live") {
      const dbId = DBNAMES.program;
      const props = buildNotionProps("program", record);
      const res = await fetch(`${WORKER}/notion/v1/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ parent: { database_id: dbId }, properties: props }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      return await this.listProgram(true);
    }
    const list = lsRead("program") || [];
    const id = `prog-${Date.now()}`;
    const newRec = { id, ...record, createdAt: new Date().toISOString() };
    list.push(newRec);
    lsWrite("program", list);
    return newRec;
  },
  async updateProgram(id, patch) {
    if (MODE === "live") {
      const props = buildNotionProps("program", patch);
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ properties: props }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      return await this.listProgram(true);
    }
    const list = lsRead("program") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch };
    lsWrite("program", list);
    return list[idx];
  },
  async deleteProgram(id) {
    if (MODE === "live") {
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ archived: true }),
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      return { ok: true };
    }
    const list = lsRead("program") || [];
    lsWrite("program", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // ---------- JOBDESK ----------
  async listJobdesk(force = false) {
    if (force) invalidate("jobdesk");
    return cacheTTL("jobdesk", 60, async () => {
      if (MODE === "live") return await workerCall("jobdesk");
      return lsRead("jobdesk") || [];
    });
  },
  async createJobdesk(record) {
    if (MODE === "live") {
      const dbId = DBNAMES.jobdesk;
      const props = buildNotionProps("jobdesk", record);
      const res = await fetch(`${WORKER}/notion/v1/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ parent: { database_id: dbId }, properties: props }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      return await this.listJobdesk(true);
    }
    const list = lsRead("jobdesk") || [];
    const id = `job-${Date.now()}`;
    const newRec = { id, ...record };
    list.push(newRec);
    lsWrite("jobdesk", list);
    return newRec;
  },
  async updateJobdesk(id, patch) {
    if (MODE === "live") {
      const props = buildNotionProps("jobdesk", patch);
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ properties: props }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      return await this.listJobdesk(true);
    }
    const list = lsRead("jobdesk") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch };
    lsWrite("jobdesk", list);
    return list[idx];
  },
  async deleteJobdesk(id) {
    if (MODE === "live") {
      const res = await fetch(`${WORKER}/notion/v1/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Notion-Version": "2022-06-28", "X-PIC": Session.pic || "" },
        body: JSON.stringify({ archived: true }),
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      return { ok: true };
    }
    const list = lsRead("jobdesk") || [];
    lsWrite("jobdesk", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // ---------- SOW ----------
  async listSOW(force = false) {
    if (force) invalidate("sow");
    return cacheTTL("sow", 60, async () => {
      if (MODE === "live") return await workerCall("sow");
      return lsRead("sow") || [];
    });
  },
};

// ============================================================================
// SSOT loader (V1 data files - local fallback)
// ============================================================================
const SSOT_BASE = "data/tim-v2/";
const SSOT_FILES = [
  "jd-lengkap-12-pic", "kalkulasi-kpi", "bonus-scheme", "sop-stb", "manager-standar",
  "harga-tier", "hr-policy", "struktur-organisasi", "kpi-score-card", "target-personal",
  "target-divisi", "target-perusahaan", "grading-framework", "risk-register",
  "hybrid-channel", "business-model", "sop-12-pic", "sop-customer-service",
  "sop-followup-merayu", "sop-front-office-audit", "sop-subkontraktor",
  "coaching-3-pilar", "coaching-sop", "coaching-scripts-additional",
  "competitor-analysis", "content-calendar", "crm-master", "definisi-target",
  "forecast-q4", "hpp-breakdown-73jt", "iso-esg-nps-insurance", "jd-ringkas-12-pic",
  "legal-contracts", "market-research", "meta-ads-strategy", "meta-ads-trend",
  "onboarding-cross-training", "sales-pipeline", "spk-template-selo",
  "spec-teknis-type36", "succession-plan", "technology-roadmap",
  "termin-pembayaran-selo", "workflow-sop", "ahs-rap-selo", "brand-guidelines",
  "config-tier", "inovasi-q3", "kpi-history", "master-db", "reward-history",
];

const cache = new Map();

export async function loadSSOT(name) {
  if (cache.has(name)) return cache.get(name);
  try {
    const res = await fetch(SSOT_BASE + name + ".json");
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    cache.set(name, data);
    return data;
  } catch (e) {
    console.warn("SSOT load fail:", name, e.message);
    return null;
  }
}

export async function loadAllSSOT() {
  const results = {};
  await Promise.all(
    SSOT_FILES.map(async (name) => {
      const d = await loadSSOT(name);
      if (d) results[name] = d;
    })
  );
  return results;
}

export const SSOT_FILES_LIST = SSOT_FILES;
