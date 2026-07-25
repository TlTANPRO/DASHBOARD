// V2 DASHBOARD CONFIG — copy ke config.js dan isi real values
// gitignore: config.js

window.DASHBOARD_CONFIG = {
  // Cloudflare Worker proxy base
  // Setelah deploy, contoh: "https://titan-notion-proxy.nickasad10007.workers.dev"
  workerBase: "https://titan-notion-proxy.YOUR-SUBDOMAIN.workers.dev",

  // Notion API version (stable: 2022-06-28)
  notionVersion: "2022-06-28",

  // 4 Database IDs dari Notion (32-char UUID each)
  // Cara ambil: di Notion, click kanan DB → Copy link → extract ID dari URL
  databases: {
    kpi:     "PASTE_KPI_DB_ID_HERE_32_CHARS",
    sow:     "PASTE_SOW_DB_ID_HERE_32_CHARS",
    program: "PASTE_PROGRAM_DB_ID_HERE_32_CHARS",
    jobdesk: "PASTE_JOBDESK_DB_ID_HERE_32_CHARS",
  },

  // 12 PIC names (harus match dengan select options di Notion)
  picList: [
    "Pak Ardian", "Bu Nisya", "Mada", "Riza",
    "Yudi (Sdek)", "Rizal", "Amir", "Novita",
    "Sinta", "Reni", "Rifki", "Reta"
  ],

  // 4 divisi (harus match dengan select options)
  divisiList: ["Owner", "Operasional", "Marketing", "Proyek", "Media", "Admin"],

  // Watermark text
  watermark: "DOKUMEN INTERNAL — TIDAK UNTUK DISEBARLUASKAN",

  // Auto-poll interval (ms) — 60s default
  pollIntervalMs: 60000,

  // Mode: "live" = fetch ke Notion via Worker, "demo" = fallback static only
  mode: "demo"
};
