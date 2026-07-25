// lib/api.js — data layer: Notion API via worker / localStorage demo

import { Session } from "./auth.js";

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

// Notion API via worker
async function notionQuery(dbName, opts = {}) {
  if (!WORKER) throw new Error("Worker URL not configured");
  const url = `${WORKER}/${dbName}${opts.query ? "?" + new URLSearchParams(opts.query) : ""}`;
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Pic": Session.pic || "",
      "X-Token": Session.token || "",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Public API
export const API = {
  mode: MODE,

  // KPI
  async listKPI() {
    if (MODE === "live") return notionQuery("kpi");
    return lsRead("kpi") || [];
  },
  async createKPI(record) {
    if (MODE === "live") return notionQuery("kpi", { method: "POST", body: record });
    const list = lsRead("kpi") || [];
    const id = `kpi-${Date.now()}`;
    const newRec = { id, ...record, createdAt: new Date().toISOString() };
    list.push(newRec);
    lsWrite("kpi", list);
    return newRec;
  },
  async updateKPI(id, patch) {
    if (MODE === "live") return notionQuery("kpi", { method: "PATCH", body: { id, ...patch } });
    const list = lsRead("kpi") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    lsWrite("kpi", list);
    return list[idx];
  },
  async deleteKPI(id) {
    if (MODE === "live") return notionQuery("kpi", { method: "DELETE", body: { id } });
    const list = lsRead("kpi") || [];
    lsWrite("kpi", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // Program Kerja
  async listProgram() {
    if (MODE === "live") return notionQuery("program");
    return lsRead("program") || [];
  },
  async createProgram(record) {
    if (MODE === "live") return notionQuery("program", { method: "POST", body: record });
    const list = lsRead("program") || [];
    const id = `prog-${Date.now()}`;
    const newRec = { id, ...record, createdAt: new Date().toISOString() };
    list.push(newRec);
    lsWrite("program", list);
    return newRec;
  },
  async updateProgram(id, patch) {
    if (MODE === "live") return notionQuery("program", { method: "PATCH", body: { id, ...patch } });
    const list = lsRead("program") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch };
    lsWrite("program", list);
    return list[idx];
  },
  async deleteProgram(id) {
    if (MODE === "live") return notionQuery("program", { method: "DELETE", body: { id } });
    const list = lsRead("program") || [];
    lsWrite("program", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // Jobdesk Harian
  async listJobdesk() {
    if (MODE === "live") return notionQuery("jobdesk");
    return lsRead("jobdesk") || [];
  },
  async createJobdesk(record) {
    if (MODE === "live") return notionQuery("jobdesk", { method: "POST", body: record });
    const list = lsRead("jobdesk") || [];
    const id = `job-${Date.now()}`;
    const newRec = { id, ...record };
    list.push(newRec);
    lsWrite("jobdesk", list);
    return newRec;
  },
  async updateJobdesk(id, patch) {
    if (MODE === "live") return notionQuery("jobdesk", { method: "PATCH", body: { id, ...patch } });
    const list = lsRead("jobdesk") || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Not found");
    list[idx] = { ...list[idx], ...patch };
    lsWrite("jobdesk", list);
    return list[idx];
  },
  async deleteJobdesk(id) {
    if (MODE === "live") return notionQuery("jobdesk", { method: "DELETE", body: { id } });
    const list = lsRead("jobdesk") || [];
    lsWrite("jobdesk", list.filter((r) => r.id !== id));
    return { ok: true };
  },

  // SOW
  async listSOW() {
    if (MODE === "live") return notionQuery("sow");
    return lsRead("sow") || [];
  },
};

// SSOT loader (V1 data files)
const SSOT_BASE = "data/tim-v2/";
const SSOT_FILES = [
  "jd-lengkap-12-pic",
  "kalkulasi-kpi",
  "bonus-scheme",
  "sop-stb",
  "manager-standar",
  "harga-tier",
  "hr-policy",
  "struktur-organisasi",
  "kpi-score-card",
  "target-personal",
  "target-divisi",
  "target-perusahaan",
  "grading-framework",
  "risk-register",
  "hybrid-channel",
  "business-model",
  "sop-12-pic",
  "sop-customer-service",
  "sop-followup-merayu",
  "sop-front-office-audit",
  "sop-subkontraktor",
  "coaching-3-pilar",
  "coaching-sop",
  "coaching-scripts-additional",
  "competitor-analysis",
  "content-calendar",
  "crm-master",
  "definisi-target",
  "forecast-q4",
  "hpp-breakdown-73jt",
  "iso-esg-nps-insurance",
  "jd-ringkas-12-pic",
  "kalkulasi-kpi",
  "legal-contracts",
  "manager-standar",
  "market-research",
  "meta-ads-strategy",
  "meta-ads-trend",
  "onboarding-cross-training",
  "sales-pipeline",
  "spk-template-selo",
  "spec-teknis-type36",
  "succession-plan",
  "technology-roadmap",
  "termin-pembayaran-selo",
  "workflow-sop",
  "ahs-rap-selo",
  "brand-guidelines",
  "config-tier",
  "inovasi-q3",
  "kpi-history",
  "master-db",
  "reward-history",
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
