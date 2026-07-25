// seed-data.js
// Idempotent seed: cek title existing sebelum insert.
// Pakai: NOTION_TOKEN=... node seed-data.js [--confirm] [--force]
//
// Default = dry run (cetak apa yang akan diinsert, tidak insert).
// --confirm = execute.
// --force = overwrite existing rows (hapus dulu, lalu insert).
//
// Schema 4 DB ada di validate-schema.js (KPI 11 props, SOW 10, Program 13, Jobdesk 11).

const https = require("https");
const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) { console.error("ERROR: set NOTION_TOKEN"); process.exit(1); }

const NV = "2022-06-28";
const HOST = "api.notion.com";
const DBS = {
  kpi:     "3a84cf7e-9f24-819d-95d8-f951e6a1a6a2",
  sow:     "3a84cf7e-9f24-816c-be14-ef1f171b4d52",
  program: "3a84cf7e-9f24-8172-bd10-ee9e8056940a",
  jobdesk: "3a84cf7e-9f24-814f-bd01-cd52e64db04e",
};

const req = (m, p, b) => new Promise((res, rej) => {
  const d = b ? JSON.stringify(b) : null;
  const r = https.request({
    host: HOST, path: p, method: m,
    headers: {
      Authorization: "Bearer " + TOKEN,
      "Notion-Version": NV,
      "Content-Type": "application/json",
      ...(d ? { "Content-Length": Buffer.byteLength(d) } : {})
    }
  }, (x) => {
    let buf = "";
    x.on("data", c => buf += c);
    x.on("end", () => {
      try {
        const j = JSON.parse(buf);
        if (x.statusCode >= 400) rej(new Error("HTTP " + x.statusCode + ": " + JSON.stringify(j)));
        else res(j);
      } catch (e) { rej(e); }
    });
  });
  r.on("error", rej);
  if (d) r.write(d);
  r.end();
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ============================================================
// SEED DATA
// ============================================================

// 12 PIC × 3-4 SOW = ~40 rows
const SEED_SOW = [
  // Owner
  { id: "SOW-Ardian-01", pic: "Pak Ardian", tahun: 2026, kategori: ["Strategis", "Reporting"], desc: "Strategic decision lintas divisi", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Ardian-02", pic: "Pak Ardian", tahun: 2026, kategori: ["Reporting"], desc: "Final approve budget bulanan + kuartalan", bobot: 25, freq: "Bulanan", status: "Active" },
  { id: "SOW-Nisya-01", pic: "Bu Nisya", tahun: 2026, kategori: ["Compliance", "Operasional"], desc: "Legal drafting + review kontrak", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Nisya-02", pic: "Bu Nisya", tahun: 2026, kategori: ["Operasional"], desc: "Audit mingguan front office + SP3K", bobot: 25, freq: "Mingguan", status: "Active" },
  // Mada (Chief of Staff)
  { id: "SOW-Mada-01", pic: "Mada", tahun: 2026, kategori: ["Operasional", "Strategis"], desc: "Konsolidasi KPI lintas divisi", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Mada-02", pic: "Mada", tahun: 2026, kategori: ["Operasional"], desc: "Coaching 1-on-1 PIC", bobot: 25, freq: "Mingguan", status: "Active" },
  { id: "SOW-Mada-03", pic: "Mada", tahun: 2026, kategori: ["Operasional"], desc: "Approval lintas fungsi (BAST, budget)", bobot: 25, freq: "Harian", status: "Active" },
  { id: "SOW-Mada-04", pic: "Mada", tahun: 2026, kategori: ["Reporting"], desc: "Report mingguan ke owner", bobot: 20, freq: "Mingguan", status: "Active" },
  // Riza
  { id: "SOW-Riza-01", pic: "Riza", tahun: 2026, kategori: ["Operasional"], desc: "Lead generation via Meta Ads + organik", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Riza-02", pic: "Riza", tahun: 2026, kategori: ["Operasional"], desc: "CRM update + segmentasi lead", bobot: 25, freq: "Harian", status: "Active" },
  { id: "SOW-Riza-03", pic: "Riza", tahun: 2026, kategori: ["Operasional"], desc: "Closing support + handover ke Novita", bobot: 25, freq: "Mingguan", status: "Active" },
  { id: "SOW-Riza-04", pic: "Riza", tahun: 2026, kategori: ["Reporting"], desc: "Report CPL + ROAS mingguan", bobot: 20, freq: "Mingguan", status: "Active" },
  // Yudi
  { id: "SOW-Yudi-01", pic: "Yudi (Sdek)", tahun: 2026, kategori: ["Operasional"], desc: "Closing pojok V4 walk-in konsumen", bobot: 35, freq: "Harian", status: "Active" },
  { id: "SOW-Yudi-02", pic: "Yudi (Sdek)", tahun: 2026, kategori: ["Operasional"], desc: "Maintenance STB + after sales", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Yudi-03", pic: "Yudi (Sdek)", tahun: 2026, kategori: ["Operasional"], desc: "Walk-in接待 + presentasi spek", bobot: 35, freq: "Harian", status: "Active" },
  // Rizal
  { id: "SOW-Rizal-01", pic: "Rizal", tahun: 2026, kategori: ["Operasional"], desc: "Daily task proyek + brief mandor", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Rizal-02", pic: "Rizal", tahun: 2026, kategori: ["Operasional"], desc: "Monitoring progres semua site", bobot: 25, freq: "Harian", status: "Active" },
  { id: "SOW-Rizal-03", pic: "Rizal", tahun: 2026, kategori: ["Compliance"], desc: "Cross-check purchasing Sinta", bobot: 20, freq: "Mingguan", status: "Active" },
  { id: "SOW-Rizal-04", pic: "Rizal", tahun: 2026, kategori: ["Reporting"], desc: "Daily report progres lapangan", bobot: 25, freq: "Harian", status: "Active" },
  // Amir
  { id: "SOW-Amir-01", pic: "Amir", tahun: 2026, kategori: ["Operasional"], desc: "Daily report lapangan + foto", bobot: 35, freq: "Harian", status: "Active" },
  { id: "SOW-Amir-02", pic: "Amir", tahun: 2026, kategori: ["Operasional"], desc: "Koordinasi subkontraktor", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Amir-03", pic: "Amir", tahun: 2026, kategori: ["Compliance"], desc: "Quality check + material handling", bobot: 35, freq: "Harian", status: "Active" },
  // Novita
  { id: "SOW-Novita-01", pic: "Novita", tahun: 2026, kategori: ["Operasional", "Compliance"], desc: "Pemberkasan klien + SP3K tracking", bobot: 40, freq: "Harian", status: "Active" },
  { id: "SOW-Novita-02", pic: "Novita", tahun: 2026, kategori: ["Operasional"], desc: "Closing file + arsip dokumen", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Novita-03", pic: "Novita", tahun: 2026, kategori: ["Pengembangan"], desc: "Onboarding polyvalent (cross-train Sinta)", bobot: 30, freq: "Bulanan", status: "Active" },
  // Sinta
  { id: "SOW-Sinta-01", pic: "Sinta", tahun: 2026, kategori: ["Operasional", "Compliance"], desc: "Stopper kualitas material", bobot: 35, freq: "Harian", status: "Active" },
  { id: "SOW-Sinta-02", pic: "Sinta", tahun: 2026, kategori: ["Operasional"], desc: "Best price 3 vendor + retensi", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Sinta-03", pic: "Sinta", tahun: 2026, kategori: ["Compliance"], desc: "Block PO bila spek turun", bobot: 35, freq: "Harian", status: "Active" },
  // Reni
  { id: "SOW-Reni-01", pic: "Reni", tahun: 2026, kategori: ["Operasional", "Strategis"], desc: "Fee media closing-based (3 pilar)", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Reni-02", pic: "Reni", tahun: 2026, kategori: ["Operasional"], desc: "UTM tracking + analytics", bobot: 25, freq: "Mingguan", status: "Active" },
  { id: "SOW-Reni-03", pic: "Reni", tahun: 2026, kategori: ["Pengembangan"], desc: "Supervisi Rifki + Reta (coaching)", bobot: 25, freq: "Mingguan", status: "Active" },
  { id: "SOW-Reni-04", pic: "Reni", tahun: 2026, kategori: ["Reporting"], desc: "Insight report mingguan", bobot: 20, freq: "Mingguan", status: "Active" },
  // Rifki
  { id: "SOW-Rifki-01", pic: "Rifki", tahun: 2026, kategori: ["Operasional"], desc: "Produksi konten Story + Reels", bobot: 40, freq: "Harian", status: "Active" },
  { id: "SOW-Rifki-02", pic: "Rifki", tahun: 2026, kategori: ["Operasional"], desc: "Posting schedule harian", bobot: 30, freq: "Harian", status: "Active" },
  { id: "SOW-Rifki-03", pic: "Rifki", tahun: 2026, kategori: ["Operasional"], desc: "Engagement + reply komentar", bobot: 30, freq: "Harian", status: "Active" },
  // Reta
  { id: "SOW-Reta-01", pic: "Reta", tahun: 2026, kategori: ["Operasional"], desc: "Produksi konten Carousel + feed", bobot: 40, freq: "Harian", status: "Active" },
  { id: "SOW-Reta-02", pic: "Reta", tahun: 2026, kategori: ["Operasional"], desc: "Insight report mingguan", bobot: 30, freq: "Mingguan", status: "Active" },
  { id: "SOW-Reta-03", pic: "Reta", tahun: 2026, kategori: ["Pengembangan"], desc: "Hashtag research + trend watch", bobot: 30, freq: "Mingguan", status: "Active" },
];

// 12 PIC × 4-5 KPI/bulan = ~55 rows
const SEED_KPI = [
  // Owner
  { id: "KPI-2026-0001", pic: "Pak Ardian", divisi: "Owner", periode: "Bulanan", target: 4, realisasi: 3, satuan: "Closing", status: "On Track" },
  { id: "KPI-2026-0002", pic: "Pak Ardian", divisi: "Owner", periode: "Bulanan", target: 100, realisasi: 92, satuan: "%", status: "On Track" },
  { id: "KPI-2026-0003", pic: "Bu Nisya", divisi: "Owner", periode: "Bulanan", target: 100, realisasi: 100, satuan: "%", status: "Achieved" },
  { id: "KPI-2026-0004", pic: "Bu Nisya", divisi: "Owner", periode: "Bulanan", target: 10, realisasi: 9, satuan: "Unit", status: "On Track" },
  // Mada
  { id: "KPI-2026-0005", pic: "Mada", divisi: "Operasional", periode: "Bulanan", target: 30, realisasi: 22, satuan: "Lead", status: "On Track" },
  { id: "KPI-2026-0006", pic: "Mada", divisi: "Operasional", periode: "Mingguan", target: 8, realisasi: 6, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0007", pic: "Mada", divisi: "Operasional", periode: "Bulanan", target: 4, realisasi: 3, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0008", pic: "Mada", divisi: "Operasional", periode: "Mingguan", target: 4, realisasi: 4, satuan: "Unit", status: "Achieved" },
  // Riza
  { id: "KPI-2026-0009", pic: "Riza", divisi: "Marketing", periode: "Bulanan", target: 40, realisasi: 38, satuan: "Lead", status: "On Track" },
  { id: "KPI-2026-0010", pic: "Riza", divisi: "Marketing", periode: "Bulanan", target: 6, realisasi: 4, satuan: "Closing", status: "At Risk" },
  { id: "KPI-2026-0011", pic: "Riza", divisi: "Marketing", periode: "Mingguan", target: 10, realisasi: 9, satuan: "Lead", status: "On Track" },
  { id: "KPI-2026-0012", pic: "Riza", divisi: "Marketing", periode: "Bulanan", target: 1000000, realisasi: 850000, satuan: "Rp", status: "On Track" },
  // Yudi
  { id: "KPI-2026-0013", pic: "Yudi (Sdek)", divisi: "Marketing", periode: "Bulanan", target: 5, realisasi: 3, satuan: "Closing", status: "At Risk" },
  { id: "KPI-2026-0014", pic: "Yudi (Sdek)", divisi: "Marketing", periode: "Bulanan", target: 30, realisasi: 22, satuan: "Lead", status: "On Track" },
  { id: "KPI-2026-0015", pic: "Yudi (Sdek)", divisi: "Marketing", periode: "Mingguan", target: 3, realisasi: 2, satuan: "Closing", status: "On Track" },
  // Rizal
  { id: "KPI-2026-0016", pic: "Rizal", divisi: "Proyek", periode: "Mingguan", target: 100, realisasi: 95, satuan: "%", status: "On Track" },
  { id: "KPI-2026-0017", pic: "Rizal", divisi: "Proyek", periode: "Bulanan", target: 4, realisasi: 3, satuan: "BAST", status: "On Track" },
  { id: "KPI-2026-0018", pic: "Rizal", divisi: "Proyek", periode: "Bulanan", target: 0, realisasi: 0, satuan: "Accident", status: "Achieved" },
  // Amir
  { id: "KPI-2026-0019", pic: "Amir", divisi: "Proyek", periode: "Mingguan", target: 7, realisasi: 7, satuan: "Report", status: "Achieved" },
  { id: "KPI-2026-0020", pic: "Amir", divisi: "Proyek", periode: "Bulanan", target: 100, realisasi: 98, satuan: "%", status: "On Track" },
  { id: "KPI-2026-0021", pic: "Amir", divisi: "Proyek", periode: "Bulanan", target: 2, realisasi: 0, satuan: "Complaint", status: "Achieved" },
  // Novita
  { id: "KPI-2026-0022", pic: "Novita", divisi: "Admin", periode: "Bulanan", target: 10, realisasi: 8, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0023", pic: "Novita", divisi: "Admin", periode: "Mingguan", target: 3, realisasi: 2, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0024", pic: "Novita", divisi: "Admin", periode: "Bulanan", target: 100, realisasi: 95, satuan: "%", status: "On Track" },
  // Sinta
  { id: "KPI-2026-0025", pic: "Sinta", divisi: "Proyek", periode: "Bulanan", target: 15, realisasi: 12, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0026", pic: "Sinta", divisi: "Proyek", periode: "Bulanan", target: 100, realisasi: 100, satuan: "%", status: "Achieved" },
  { id: "KPI-2026-0027", pic: "Sinta", divisi: "Proyek", periode: "Mingguan", target: 4, realisasi: 3, satuan: "Vendor", status: "On Track" },
  // Reni
  { id: "KPI-2026-0028", pic: "Reni", divisi: "Media", periode: "Mingguan", target: 6, realisasi: 7, satuan: "Unit", status: "Achieved" },
  { id: "KPI-2026-0029", pic: "Reni", divisi: "Media", periode: "Bulanan", target: 15, realisasi: 14, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0030", pic: "Reni", divisi: "Media", periode: "Bulanan", target: 5000000, realisasi: 4200000, satuan: "Rp", status: "On Track" },
  // Rifki
  { id: "KPI-2026-0031", pic: "Rifki", divisi: "Media", periode: "Mingguan", target: 5, realisasi: 6, satuan: "Unit", status: "Achieved" },
  { id: "KPI-2026-0032", pic: "Rifki", divisi: "Media", periode: "Bulanan", target: 20, realisasi: 18, satuan: "Unit", status: "On Track" },
  { id: "KPI-2026-0033", pic: "Rifki", divisi: "Media", periode: "Mingguan", target: 100, realisasi: 95, satuan: "%", status: "On Track" },
  // Reta
  { id: "KPI-2026-0034", pic: "Reta", divisi: "Media", periode: "Mingguan", target: 5, realisasi: 5, satuan: "Unit", status: "Achieved" },
  { id: "KPI-2026-0035", pic: "Reta", divisi: "Media", periode: "Bulanan", target: 20, realisasi: 19, satuan: "Unit", status: "On Track" },
];

// 6 program Q3 2026
const SEED_PROGRAM = [
  { id: "PROG-2026-001", nama: "Ekspansi klien Q3 2026", pic: "Mada", quarter: "Q3", tahun: 2026, mulai: "2026-07-01", deadline: "2026-09-30", budget: 50000000, progress: 35, status: "On Track", risiko: "Klien kedua belum confirm" },
  { id: "PROG-2026-002", nama: "Onboarding admin polyvalent", pic: "Novita", quarter: "Q3", tahun: 2026, mulai: "2026-07-15", deadline: "2026-10-15", budget: 5000000, progress: 20, status: "On Track", risiko: "Butuh cross-train Sinta" },
  { id: "PROG-2026-003", nama: "Coaching 3 pilar Mada (KPI/SOP/Margin)", pic: "Mada", quarter: "Q3", tahun: 2026, mulai: "2026-07-20", deadline: "2026-09-20", budget: 0, progress: 50, status: "On Track", risiko: "-" },
  { id: "PROG-2026-004", nama: "SOP 12 komponen penutup H1 → H2", pic: "Mada", quarter: "Q3", tahun: 2026, mulai: "2026-07-25", deadline: "2026-08-30", budget: 0, progress: 10, status: "Planning", risiko: "Resource compile SOP lama" },
  { id: "PROG-2026-005", nama: "Pipeline closing Q3 (12 unit)", pic: "Riza", quarter: "Q3", tahun: 2026, mulai: "2026-07-01", deadline: "2026-09-30", budget: 8000000, progress: 40, status: "On Track", risiko: "Lead quality Q3 perlu screening" },
  { id: "PROG-2026-006", nama: "Ekspansi media 3 pilar", pic: "Reni", quarter: "Q3", tahun: 2026, mulai: "2026-07-01", deadline: "2026-09-30", budget: 12000000, progress: 60, status: "On Track", risiko: "Closing rate konten masih fluktuatif" },
];

// 12 PIC × 3 jobdesk hari ini = 36 rows
const today = new Date().toISOString().split("T")[0];
const SEED_JOB = [
  // Owner
  { id: `JOB-${today.replace(/-/g,"")}-Ardian-01`, pic: "Pak Ardian", tanggal: today, jobdesk: "Review KPI bulanan lintas divisi", target: "5 divisi", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Ardian-02`, pic: "Pak Ardian", tanggal: today, jobdesk: "Approve budget Q3 awal", target: "1 budget approved", prioritas: "P1", status: "To Do", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Nisya-01`, pic: "Bu Nisya", tanggal: today, jobdesk: "Audit front office + SP3K tracking", target: "8 file dicek", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  // Mada
  { id: `JOB-${today.replace(/-/g,"")}-Mada-01`, pic: "Mada", tanggal: today, jobdesk: "Konsolidasi KPI Q3 lintas divisi", target: "11 PIC review", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Mada-02`, pic: "Mada", tanggal: today, jobdesk: "Approve BAST 3 unit", target: "3 BAST", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Mada-03`, pic: "Mada", tanggal: today, jobdesk: "Coaching Rizal 1-on-1", target: "1 sesi 30 menit", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Riza
  { id: `JOB-${today.replace(/-/g,"")}-Riza-01`, pic: "Riza", tanggal: today, jobdesk: "Lead gen Meta Ads harian", target: "3 lead/hari", prioritas: "P1", status: "Done", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Riza-02`, pic: "Riza", tanggal: today, jobdesk: "CRM update + scoring", target: "10 lead update", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Riza-03`, pic: "Riza", tanggal: today, jobdesk: "Follow up lead Q3 pipeline", target: "5 lead contacted", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Yudi
  { id: `JOB-${today.replace(/-/g,"")}-Yudi-01`, pic: "Yudi (Sdek)", tanggal: today, jobdesk: "Walk-in接待 V4 pojok", target: "5 walk-in", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Yudi-02`, pic: "Yudi (Sdek)", tanggal: today, jobdesk: "Closing presentasi spek", target: "2 closing", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Yudi-03`, pic: "Yudi (Sdek)", tanggal: today, jobdesk: "Maintenance STB terjadwal", target: "2 unit", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Rizal
  { id: `JOB-${today.replace(/-/g,"")}-Rizal-01`, pic: "Rizal", tanggal: today, jobdesk: "Brief mandor 2 site", target: "2 site terbrief", prioritas: "P1", status: "Done", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Rizal-02`, pic: "Rizal", tanggal: today, jobdesk: "Monitor progres harian", target: "100% site visited", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Rizal-03`, pic: "Rizal", tanggal: today, jobdesk: "Cross-check PO Sinta", target: "5 PO dicek", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Amir
  { id: `JOB-${today.replace(/-/g,"")}-Amir-01`, pic: "Amir", tanggal: today, jobdesk: "Daily report lapangan + foto", target: "1 report + 5 foto", prioritas: "P1", status: "Done", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Amir-02`, pic: "Amir", tanggal: today, jobdesk: "Koordinasi subkon 2 site", target: "2 subkon aligned", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Amir-03`, pic: "Amir", tanggal: today, jobdesk: "Quality check material incoming", target: "5 material dicek", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  // Novita
  { id: `JOB-${today.replace(/-/g,"")}-Novita-01`, pic: "Novita", tanggal: today, jobdesk: "Pemberkasan klien SP3K", target: "3 file baru", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Novita-02`, pic: "Novita", tanggal: today, jobdesk: "Closing file + archive", target: "2 file closed", prioritas: "P1", status: "To Do", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Novita-03`, pic: "Novita", tanggal: today, jobdesk: "Update SP3K tracker mingguan", target: "Tracker updated", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Sinta
  { id: `JOB-${today.replace(/-/g,"")}-Sinta-01`, pic: "Sinta", tanggal: today, jobdesk: "Stopper kualitas material incoming", target: "5 material dicek", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Sinta-02`, pic: "Sinta", tanggal: today, jobdesk: "Best price 3 vendor untuk PO besok", target: "3 quote", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Sinta-03`, pic: "Sinta", tanggal: today, jobdesk: "Cross-train Novita untuk polyvalent", target: "1 sesi training", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Reni
  { id: `JOB-${today.replace(/-/g,"")}-Reni-01`, pic: "Reni", tanggal: today, jobdesk: "Review 3 pilar konten mingguan", target: "9 post reviewed", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Reni-02`, pic: "Reni", tanggal: today, jobdesk: "UTM tracking + analytics check", target: "Dashboard updated", prioritas: "P2", status: "To Do", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Reni-03`, pic: "Reni", tanggal: today, jobdesk: "Coaching Rifki + Reta (planning konten)", target: "1 sesi 60 menit", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Rifki
  { id: `JOB-${today.replace(/-/g,"")}-Rifki-01`, pic: "Rifki", tanggal: today, jobdesk: "Produksi Story + Reels", target: "2 konten", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Rifki-02`, pic: "Rifki", tanggal: today, jobdesk: "Posting schedule IG", target: "2 post", prioritas: "P1", status: "To Do", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Rifki-03`, pic: "Rifki", tanggal: today, jobdesk: "Engagement reply + DM", target: "20 interaksi", prioritas: "P2", status: "To Do", kategori: "Harian" },
  // Reta
  { id: `JOB-${today.replace(/-/g,"")}-Reta-01`, pic: "Reta", tanggal: today, jobdesk: "Produksi Carousel + feed post", target: "2 konten", prioritas: "P1", status: "In Progress", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Reta-02`, pic: "Reta", tanggal: today, jobdesk: "Hashtag research mingguan", target: "20 hashtag baru", prioritas: "P2", status: "To Do", kategori: "Harian" },
  { id: `JOB-${today.replace(/-/g,"")}-Reta-03`, pic: "Reta", tanggal: today, jobdesk: "Insight report mingguan", target: "1 report", prioritas: "P3", status: "To Do", kategori: "Harian" },
];

// ============================================================
// CONVERT TO NOTION PROPS
// ============================================================
function sowProps(s) {
  return {
    "SOW ID": { title: [{ text: { content: s.id } }] },
    "PIC": { select: { name: s.pic } },
    "Tahun": { number: s.tahun },
    "Kategori": { multi_select: s.kategori.map(n => ({ name: n })) },
    "Deskripsi": { rich_text: [{ text: { content: s.desc } }] },
    "Bobot (%)": { number: s.bobot },
    "Frekuensi": { select: { name: s.freq } },
    "Status": { select: { name: s.status } },
    "Effective From": { date: { start: "2026-01-01" } },
    "Edit_Time": { rich_text: [{ text: { content: new Date().toISOString() } }] },
  };
}
function kpiProps(k) {
  return {
    "KPI ID": { title: [{ text: { content: k.id } }] },
    "PIC": { select: { name: k.pic } },
    "Divisi": { select: { name: k.divisi } },
    "Periode": { select: { name: k.periode } },
    "Target": { number: k.target },
    "Realisasi": { number: k.realisasi },
    "Satuan": { select: { name: k.satuan } },
    "Status": { select: { name: k.status } },
    "Catatan": { rich_text: [] },
    "Edit_Time": { rich_text: [{ text: { content: new Date().toISOString() } }] },
  };
}
function progProps(p) {
  return {
    "Program ID": { title: [{ text: { content: p.id } }] },
    "Nama Program": { rich_text: [{ text: { content: p.nama } }] },
    "PIC Penanggung Jawab": { select: { name: p.pic } },
    "Quarter": { select: { name: p.quarter } },
    "Tahun": { number: p.tahun },
    "Tanggal Mulai": { date: { start: p.mulai } },
    "Deadline": { date: { start: p.deadline } },
    "Budget (Rp)": { number: p.budget },
    "Actual Spend (Rp)": { number: 0 },
    "Progress (%)": { number: p.progress },
    "Status": { select: { name: p.status } },
    "Risiko": { rich_text: [{ text: { content: p.risiko } }] },
    "Edit_Time": { rich_text: [{ text: { content: new Date().toISOString() } }] },
  };
}
function jobProps(j) {
  return {
    "Jobdesk ID": { title: [{ text: { content: j.id } }] },
    "PIC": { select: { name: j.pic } },
    "Tanggal": { date: { start: j.tanggal } },
    "Jobdesk": { rich_text: [{ text: { content: j.jobdesk } }] },
    "Kategori": { select: { name: j.kategori } },
    "Target Output": { rich_text: [{ text: { content: j.target } }] },
    "Actual Output": { rich_text: [] },
    "Prioritas": { select: { name: j.prioritas } },
    "Status": { select: { name: j.status } },
    "Edit_Time": { rich_text: [{ text: { content: new Date().toISOString() } }] },
  };
}

// ============================================================
// CHECK EXISTING (idempotent)
// ============================================================
async function getExistingTitles(dbId, titleProp) {
  const r = await req("POST", "/v1/databases/" + dbId + "/query", { page_size: 100 });
  const set = new Set();
  for (const row of r.results || []) {
    const t = row.properties[titleProp]?.title?.[0]?.plain_text;
    if (t) set.add(t);
  }
  return set;
}

async function insertRow(dbId, props) {
  return req("POST", "/v1/pages", { parent: { database_id: dbId }, properties: props });
}

// ============================================================
// MAIN
// ============================================================
async function seedTable(name, dbId, titleProp, rows, propsFn) {
  const isConfirm = process.argv.includes("--confirm");
  const isForce = process.argv.includes("--force");

  console.log(`\n[${name}] Checking existing rows...`);
  const existing = await getExistingTitles(dbId, titleProp);
  const toInsert = rows.filter(r => isForce || !existing.has(r.id));
  const skipped = rows.length - toInsert.length;
  console.log(`  ${rows.length} total, ${skipped} already exist, ${toInsert.length} to insert.`);

  if (toInsert.length === 0) return { inserted: 0, skipped };

  if (!isConfirm) {
    console.log(`  DRY RUN. Sample insert:`);
    console.log("    " + JSON.stringify(propsFn(toInsert[0]), null, 2).slice(0, 200) + "...");
    console.log(`  Run with --confirm to actually insert.`);
    return { inserted: 0, skipped };
  }

  let inserted = 0;
  for (const r of toInsert) {
    try {
      await insertRow(dbId, propsFn(r));
      inserted++;
      console.log(`  ✓ ${r.id}`);
      await sleep(400); // rate limit 3 req/s = 333ms; 400ms safe
    } catch (e) {
      console.error(`  ✗ ${r.id}: ${e.message.slice(0, 100)}`);
    }
  }
  return { inserted, skipped };
}

(async () => {
  const isConfirm = process.argv.includes("--confirm");
  console.log("=== SEED DATA · DASHBOARD V2 ===");
  console.log(`Mode: ${isConfirm ? "CONFIRM (insert)" : "DRY RUN (no insert)"}`);

  const results = {};
  results.sow     = await seedTable("SOW",     DBS.sow,     "SOW ID",     SEED_SOW,  sowProps);
  results.kpi     = await seedTable("KPI",     DBS.kpi,     "KPI ID",     SEED_KPI,  kpiProps);
  results.program = await seedTable("PROGRAM", DBS.program, "Program ID", SEED_PROGRAM, progProps);
  results.jobdesk = await seedTable("JOB",     DBS.jobdesk, "Jobdesk ID", SEED_JOB,  jobProps);

  console.log("\n=== SUMMARY ===");
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${k.padEnd(8)}: inserted=${v.inserted}, skipped=${v.skipped}`);
  }
  process.exit(0);
})().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
