// V2 DASHBOARD CONFIG — LIVE MODE (Notion via Worker)
// Edit this file to switch between Live (Notion) and Demo (LocalStorage) mode

window.DASHBOARD_CONFIG = {
  // Mode: "live" (Notion via Worker) or "demo" (LocalStorage)
  mode: "live",

  // Cloudflare Worker URL (proxies Notion API)
  workerBase: "https://titan-notion-proxy.nickasad10000.workers.dev",

  // Notion API version
  notionVersion: "2022-06-28",

  // Notion database IDs (per divisi/feature)
  databases: {
    kpi:     "3a84cf7e-9f24-819d-95d8-f951e6a1a6a2",
    sow:     "3a84cf7e-9f24-816c-be14-ef1f171b4d52",
    program: "3a84cf7e-9f24-8172-bd10-ee9e8056940a",
    jobdesk: "3a84cf7e-9f24-814f-bd01-cd52e64db04e",
  },

  // PIC list (dropdown + filter)
  picList: [
    "Pak Ardian", "Bu Nisya", "Mada", "Riza",
    "Yudi (Sdek)", "Rizal", "Amir", "Novita",
    "Sinta", "Reni", "Rifki", "Reta"
  ],

  // Divisi list (filter + assign)
  divisiList: ["Owner", "Operasional", "Marketing", "Proyek", "Media", "Admin"],

  // Watermark text (shown bottom-right of all pages)
  watermark: "DOKUMEN INTERNAL — TIDAK UNTUK DISEBARLUASKAN",

  // Auto-refresh interval (ms) — only when tab visible
  pollIntervalMs: 60000,
};
