// validate-schema.js
// Cek 4 Notion DB punya property sesuai schema (nama + tipe).
// Pakai: NOTION_TOKEN=... node validate-schema.js
//
// PASS = semua property expected ada + tipe sesuai.
// FAIL = list property yang missing atau wrong type.

const https = require("https");
const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) {
  console.error("ERROR: set NOTION_TOKEN env var dulu.");
  process.exit(1);
}

const HOST = "api.notion.com";
const NV = "2022-06-28";

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

// Schema expectations: db → list of {name, type}
const EXPECTED = {
  kpi: [
    { name: "KPI ID", type: "title" },
    { name: "PIC", type: "select" },
    { name: "Divisi", type: "select" },
    { name: "Periode", type: "select" },
    { name: "Target", type: "number" },
    { name: "Realisasi", type: "number" },
    { name: "Satuan", type: "select" },
    { name: "Status", type: "select" },
    { name: "Catatan", type: "rich_text" },
    { name: "Bukti", type: "url" },
    { name: "Edit_Time", type: "rich_text" },
  ],
  sow: [
    { name: "SOW ID", type: "title" },
    { name: "PIC", type: "select" },
    { name: "Tahun", type: "number" },
    { name: "Kategori", type: "multi_select" },
    { name: "Deskripsi", type: "rich_text" },
    { name: "Bobot (%)", type: "number" },
    { name: "Frekuensi", type: "select" },
    { name: "Status", type: "select" },
    { name: "Effective From", type: "date" },
    { name: "Edit_Time", type: "rich_text" },
  ],
  program: [
    { name: "Program ID", type: "title" },
    { name: "Nama Program", type: "rich_text" },
    { name: "PIC Penanggung Jawab", type: "select" },
    { name: "Quarter", type: "select" },
    { name: "Tahun", type: "number" },
    { name: "Tanggal Mulai", type: "date" },
    { name: "Deadline", type: "date" },
    { name: "Budget (Rp)", type: "number" },
    { name: "Actual Spend (Rp)", type: "number" },
    { name: "Progress (%)", type: "number" },
    { name: "Status", type: "select" },
    { name: "Risiko", type: "rich_text" },
    { name: "Edit_Time", type: "rich_text" },
  ],
  jobdesk: [
    { name: "Jobdesk ID", type: "title" },
    { name: "PIC", type: "select" },
    { name: "Tanggal", type: "date" },
    { name: "Jobdesk", type: "rich_text" },
    { name: "Kategori", type: "select" },
    { name: "Target Output", type: "rich_text" },
    { name: "Actual Output", type: "rich_text" },
    { name: "Prioritas", type: "select" },
    { name: "Status", type: "select" },
    { name: "Bukti", type: "url" },
    { name: "Edit_Time", type: "rich_text" },
  ],
};

const DBS = {
  kpi:     "3a84cf7e-9f24-819d-95d8-f951e6a1a6a2",
  sow:     "3a84cf7e-9f24-816c-be14-ef1f171b4d52",
  program: "3a84cf7e-9f24-8172-bd10-ee9e8056940a",
  jobdesk: "3a84cf7e-9f24-814f-bd01-cd52e64db04e",
};

(async () => {
  let pass = 0, fail = 0;
  for (const [key, dbId] of Object.entries(DBS)) {
    const db = await req("GET", "/v1/databases/" + dbId);
    const props = db.properties;
    const exp = EXPECTED[key];
    const missing = [];
    const wrongType = [];
    for (const e of exp) {
      const p = props[e.name];
      if (!p) { missing.push(e.name); continue; }
      if (p.type !== e.type) wrongType.push(`${e.name} (expected ${e.type}, got ${p.type})`);
    }
    if (missing.length === 0 && wrongType.length === 0) {
      console.log(`PASS  ${key.padEnd(8)} | ${db.title[0]?.plain_text} | ${exp.length} props OK`);
      pass++;
    } else {
      console.log(`FAIL  ${key.padEnd(8)} | ${db.title[0]?.plain_text}`);
      if (missing.length) console.log("       missing:", missing.join(", "));
      if (wrongType.length) console.log("       wrong type:", wrongType.join("; "));
      fail++;
    }
  }
  console.log(`\n${pass} pass, ${fail} fail`);
  process.exit(fail > 0 ? 1 : 0);
})().catch(e => { console.error("FATAL:", e.message); process.exit(2); });
