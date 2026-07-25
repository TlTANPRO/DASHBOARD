// create-notion-dbs.js
// Otomatis bikin parent page "DASHBOARD PERUSAHAAN V2" + 4 inline DB di Notion.
// Pakai: NOTION_TOKEN=secret_xxx node create-notion-dbs.js
//
// Output: file notion-ids.json dengan 4 DB ID.
// Paste DB ID ke deploy/v2/config.js, set mode = "live".

const https = require("https");
const fs = require("fs");

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) {
  console.error("ERROR: set NOTION_TOKEN env var dulu.");
  console.error("  PowerShell:  $env:NOTION_TOKEN = 'secret_xxx'");
  console.error("  Bash:        export NOTION_TOKEN=secret_xxx");
  process.exit(1);
}

const NOTION_VERSION = "2022-06-28";
const HOST = "api.notion.com";

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      host: HOST,
      path,
      method,
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const r = https.request(opts, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => {
        try {
          const j = JSON.parse(buf);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(j)}`));
          } else resolve(j);
        } catch (e) { reject(e); }
      });
    });
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}

// ====== Schema ======
const PIC_LIST = [
  "Pak Ardian", "Bu Nisya", "Mada", "Riza",
  "Yudi (Sdek)", "Rizal", "Amir", "Novita",
  "Sinta", "Reni", "Rifki", "Reta"
];
const DIVISI = ["Owner", "Operasional", "Marketing", "Proyek", "Media", "Admin"];

function selOpt(name) { return { name, color: "default" }; }
function selProps(name, options) {
  return { [name]: { select: { options: options.map(selOpt) } } };
}
function textProp(name) { return { [name]: { rich_text: {} } }; }
function numProp(name) { return { [name]: { number: { format: "number" } } }; }
function dateProp(name) { return { [name]: { date: {} } }; }
function urlProp(name) { return { [name]: { url: {} } }; }
function titleProp(name) { return [name]: { title: {} } };

const SCHEMAS = {
  kpi: {
    name: "1. KPI Tracker",
    props: {
      ...titleProp("KPI ID"),
      ...selProps("PIC", PIC_LIST),
      ...selProps("Divisi", DIVISI),
      ...selProps("Periode", ["Mingguan", "Bulanan", "Kuartalan"]),
      ...numProp("Target"),
      ...numProp("Realisasi"),
      ...selProps("Satuan", ["%", "Unit", "Rp", "Closing", "Lead", "Jam"]),
      ...selProps("Status", ["On Track", "At Risk", "Off Track", "Achieved"]),
      ...textProp("Catatan"),
      ...urlProp("Bukti"),
      ...textProp("Edit_Time"),
    },
  },
  sow: {
    name: "2. Scope of Work",
    props: {
      ...titleProp("SOW ID"),
      ...selProps("PIC", PIC_LIST),
      ...numProp("Tahun"),
      ...{
        Kategori: {
          multi_select: {
            options: ["Operasional", "Strategis", "Compliance", "Pengembangan", "Reporting"]
              .map(selOpt),
          },
        },
      },
      ...textProp("Deskripsi"),
      ...numProp("Bobot (%)"),
      ...selProps("Frekuensi", ["Harian", "Mingguan", "Bulanan", "Kuartalan"]),
      ...selProps("Status", ["Active", "Paused", "Completed"]),
      ...dateProp("Effective From"),
      ...textProp("Edit_Time"),
    },
  },
  program: {
    name: "3. Program Kerja",
    props: {
      ...titleProp("Program ID"),
      ...textProp("Nama Program"),
      ...selProps("PIC Penanggung Jawab", PIC_LIST),
      ...selProps("Quarter", ["Q1", "Q2", "Q3", "Q4"]),
      ...numProp("Tahun"),
      ...dateProp("Tanggal Mulai"),
      ...dateProp("Deadline"),
      ...numProp("Budget (Rp)"),
      ...numProp("Actual Spend (Rp)"),
      ...numProp("Progress (%)"),
      ...selProps("Status", ["Planning", "On Track", "At Risk", "Delayed", "Done", "Cancelled"]),
      ...textProp("Risiko"),
      ...textProp("Edit_Time"),
    },
  },
  jobdesk: {
    name: "4. Jobdesk Harian + Target",
    props: {
      ...titleProp("Jobdesk ID"),
      ...selProps("PIC", PIC_LIST),
      ...dateProp("Tanggal"),
      ...textProp("Jobdesk"),
      ...selProps("Kategori", ["Harian", "Mingguan", "Bulanan"]),
      ...textProp("Target Output"),
      ...textProp("Actual Output"),
      ...selProps("Prioritas", ["P1", "P2", "P3"]),
      ...selProps("Status", ["To Do", "In Progress", "Done", "Blocked"]),
      ...urlProp("Bukti"),
      ...textProp("Edit_Time"),
    },
  },
};

async function main() {
  console.log("Step 1: cari parent page 'DASHBOARD PERUSAHAAN V2'...");

  // Search for existing page
  let parentPageId = null;
  try {
    const search = await req("POST", "/v1/search", {
      query: "DASHBOARD PERUSAHAAN V2",
      filter: { value: "page", property: "object" },
    });
    const found = search.results.find(r => r.properties?.title?.title?.[0]?.plain_text === "DASHBOARD PERUSAHAAN V2");
    if (found) {
      parentPageId = found.id;
      console.log("  Found existing page:", parentPageId);
    }
  } catch (e) { console.log("  search fail (lanjut create):", e.message); }

  if (!parentPageId) {
    console.log("Step 2: create parent page...");
    try {
      const page = await req("POST", "/v1/pages", {
        parent: { type: "workspace", workspace: true },
        properties: {
          title: { title: [{ text: { content: "DASHBOARD PERUSAHAAN V2" } }] },
        },
        children: [
          {
            object: "block",
            type: "heading_1",
            heading_1: {
              rich_text: [{ type: "text", text: { content: "Database Operasional — 12 PIC" } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: "4 inline DB di bawah. Edit via Notion atau via Dashboard V2." } }],
            },
          },
        ],
      });
      parentPageId = page.id;
      console.log("  Created:", parentPageId);
    } catch (e) {
      console.error("FAIL create page:", e.message);
      console.error("\nFallback: bikin manual di Notion. Share page ke integration 'Dashboard V2'.");
      console.error("Lanjut step 3, paste parentPageId manual.\n");
      parentPageId = process.argv[2];
      if (!parentPageId) {
        console.error("Usage: node create-notion-dbs.js <parent_page_id>");
        process.exit(1);
      }
    }
  }

  console.log("\nStep 3: create 4 databases...");

  const ids = {};
  for (const [key, schema] of Object.entries(SCHEMAS)) {
    process.stdout.write(`  - ${schema.name}... `);
    try {
      const db = await req("POST", "/v1/databases", {
        parent: { type: "page_id", page_id: parentPageId },
        title: [{ type: "text", text: { content: schema.name } }],
        properties: schema.props,
      });
      ids[key] = db.id;
      console.log("OK " + db.id);
    } catch (e) {
      console.log("FAIL");
      console.error("    ", e.message);
      process.exit(1);
    }
  }

  console.log("\n=== SELESAI ===");
  console.log("\n4 DB IDs (paste ke deploy/v2/config.js):\n");
  console.log(JSON.stringify(ids, null, 2));

  fs.writeFileSync("notion-ids.json", JSON.stringify({
    parentPage: parentPageId,
    databases: ids,
    createdAt: new Date().toISOString(),
  }, null, 2));
  console.log("\nSaved ke notion-ids.json");
  console.log("\nNext step: lihat deploy/v2/docs/SETUP.md step 5-7 untuk setup Worker.");
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
