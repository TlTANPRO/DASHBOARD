// migrate-add-approval.js
// Tambah 3 property ke Jobdesk DB: Approval, Approval_By, Approval_Time.
// Idempotent: kalau property sudah ada → skip (return "exists").
// Pakai: NOTION_TOKEN=... node migrate-add-approval.js [--confirm]
//
// Default = dry run. --confirm untuk execute.

const https = require("https");
const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) { console.error("ERROR: set NOTION_TOKEN"); process.exit(1); }

const NV = "2022-06-28";
const JOB_DESK_DB = "3a84cf7e-9f24-814f-bd01-cd52e64db04e";

const req = (m, p, b) => new Promise((res, rej) => {
  const d = b ? JSON.stringify(b) : null;
  const r = https.request({
    host: "api.notion.com", path: p, method: m,
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

async function getCurrentSchema(dbId) {
  const r = await req("GET", "/v1/databases/" + dbId);
  return r.properties;
}

(async () => {
  const isConfirm = process.argv.includes("--confirm");
  console.log("=== MIGRATE · Tambah Approval ke Jobdesk DB ===");
  console.log(`Mode: ${isConfirm ? "CONFIRM" : "DRY RUN"}\n`);

  const current = await getCurrentSchema(JOB_DESK_DB);
  const existingNames = Object.keys(current);
  console.log("Existing properties:", existingNames.join(", "));

  const newProps = {};

  if (!existingNames.includes("Approval")) {
    newProps["Approval"] = {
      select: {
        name: "Approval",
        options: [
          { name: "Pending", color: "yellow" },
          { name: "Approved", color: "green" },
          { name: "Rejected", color: "red" },
        ]
      }
    };
  } else {
    console.log("  ✓ 'Approval' already exists, skip");
  }

  if (!existingNames.includes("Approval_By")) {
    newProps["Approval_By"] = { rich_text: {} };
  } else {
    console.log("  ✓ 'Approval_By' already exists, skip");
  }

  if (!existingNames.includes("Approval_Time")) {
    newProps["Approval_Time"] = { date: {} };
  } else {
    console.log("  ✓ 'Approval_Time' already exists, skip");
  }

  if (Object.keys(newProps).length === 0) {
    console.log("\nNothing to migrate. Schema up-to-date.");
    process.exit(0);
  }

  if (!isConfirm) {
    console.log("\nDRY RUN. New properties:");
    for (const [k, v] of Object.entries(newProps)) {
      console.log(`  ${k}: ${JSON.stringify(v).slice(0, 80)}...`);
    }
    console.log("\nRun with --confirm to apply.");
    process.exit(0);
  }

  try {
    await req("PATCH", "/v1/databases/" + JOB_DESK_DB, { properties: newProps });
    console.log("\n✓ Migration applied. New properties:", Object.keys(newProps).join(", "));
    process.exit(0);
  } catch (e) {
    console.error("✗ Migration failed:", e.message);
    process.exit(1);
  }
})();
