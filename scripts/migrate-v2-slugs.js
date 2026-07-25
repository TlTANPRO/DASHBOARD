// migrate-v2-slugs.js
// Migrate Notion: add KPI name field + Tipe, populate 36 existing KPI,
// add 12 Divisi-level KPI rows, rewrite all ID fields dengan slug.
// Pakai: NOTION_TOKEN=... node migrate-v2-slugs.js [--confirm] [--dry]
//
// Default = dry run.

const https = require("https");
const WORKER = "titan-notion-proxy.nickasad10000.workers.dev";
const DBS = {
  kpi:     "3a84cf7e-9f24-819d-95d8-f951e6a1a6a2",
  sow:     "3a84cf7e-9f24-816c-be14-ef1f171b4d52",
  program: "3a84cf7e-9f24-8172-bd10-ee9e8056940a",
};

const req = (m, p, b) => new Promise((res, rej) => {
  const d = b ? JSON.stringify(b) : null;
  const r = https.request({
    host: WORKER, path: "/notion" + p, method: m,
    headers: {
      "Content-Type": "application/json",
      ...(d ? { "Content-Length": Buffer.byteLength(d) } : {})
    }
  }, (x) => {
    let buf = "";
    x.on("data", c => buf += c);
    x.on("end", () => {
      try {
        const j = JSON.parse(buf);
        if (x.statusCode >= 400) rej(new Error("HTTP " + x.statusCode + ": " + JSON.stringify(j).slice(0, 200)));
        else res(j);
      } catch (e) { rej(e); }
    });
  });
  r.on("error", rej);
  if (d) r.write(d);
  r.end();
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(s) {
  if (!s) return "";
  return s.toString()
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ñ]/g, "n")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function queryAll(dbKey) {
  const dbId = DBS[dbKey];
  const all = [];
  let cursor = undefined;
  while (true) {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await req("POST", `/v1/databases/${dbId}/query`, body);
    all.push(...(res.results || []));
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return all;
}

// ============================================================
// EXTRACT existing KPI rows by PIC+Divisi+Satuan
// ============================================================
function extractKpi(p) {
  return {
    id: p.id,
    pic: p.properties["PIC"]?.select?.name || "",
    divisi: p.properties["Divisi"]?.select?.name || "",
    target: p.properties["Target"]?.number || 0,
    realisasi: p.properties["Realisasi"]?.number || 0,
    satuan: p.properties["Satuan"]?.select?.name || "",
    periode: p.properties["Periode"]?.select?.name || "",
    status: p.properties["Status"]?.select?.name || "On Track",
  };
}

// Generate descriptive name dari PIC + kategori logic
// Per PIC, ada beberapa KPI yg sudah ada di seed. Generate nama berdasarkan
// pola divisi + satuan + periode.
function generateKpiName(row, idx) {
  const { pic, divisi, satuan, periode } = row;
  const nameMap = {
    "Pak Ardian": ["Closing Bulanan", "Achievement Bulanan"],
    "Bu Nisya": ["Compliance Bulanan", "SP3K Bulanan"],
    "Mada": ["Konsolidasi Lead Lintas Divisi", "Coaching Sesi", "Approval Lintas Fungsi", "Report Mingguan Owner"],
    "Riza": ["Lead Gen Bulanan", "Closing Bulanan", "Lead Mingguan", "ROAS Bulanan"],
    "Yudi (Sdek)": ["Closing Walk-in", "Lead Walk-in", "Closing Mingguan"],
    "Rizal": ["Progres Proyek Mingguan", "BAST Bulanan", "Zero Accident"],
    "Amir": ["Daily Report Mingguan", "Quality Check Bulanan", "Zero Complaint"],
    "Novita": ["Pemberkasan Klien Bulanan", "Closing Mingguan", "Akurasi SP3K Bulanan"],
    "Sinta": ["Stopper Kualitas Material", "Best Price Vendor", "PO Compliance"],
    "Reni": ["Konten Fee Mingguan", "Closing Fee Bulanan", "Revenue Fee Media Bulanan"],
    "Rifki": ["Story Mingguan", "Konten Bulanan", "Engagement Rate"],
    "Reta": ["Carousel Mingguan", "Konten Bulanan"],
  };
  const list = nameMap[pic] || ["KPI"];
  const pick = list[idx % list.length] || list[0];
  return pick;
}

function extractSow(p) {
  return {
    id: p.id,
    desc: p.properties["Deskripsi"]?.rich_text?.[0]?.plain_text || "",
    pic: p.properties["PIC"]?.select?.name || "",
  };
}
function extractProgram(p) {
  return {
    id: p.id,
    nama: p.properties["Nama Program"]?.rich_text?.[0]?.plain_text || p.properties["Nama Program"]?.title?.[0]?.plain_text || "",
    pic: p.properties["PIC Penanggung Jawab"]?.select?.name || p.properties["PIC"]?.select?.name || "",
  };
}

function generateIds(rows, nameField) {
  const baseSlug = rows.map(r => ({ ...r, baseSlug: slugify(r[nameField]), picShort: slugify(r.pic) }));
  const counts = {};
  baseSlug.forEach(r => counts[r.baseSlug] = (counts[r.baseSlug] || 0) + 1);
  baseSlug.forEach(r => {
    if (counts[r.baseSlug] > 1 && r.picShort) r.newId = `${r.baseSlug}-${r.picShort}`;
    else r.newId = r.baseSlug;
  });
  return baseSlug;
}

// ============================================================
// DIVISI-LEVEL KPI
// ============================================================
const DIVISI_KPI = [
  { nama: "Closing Marketing Q3", divisi: "Marketing", pic: "Riza", target: 12, satuan: "Closing", note: "Sum target Riza + Yudi" },
  { nama: "Lead Marketing Q3", divisi: "Marketing", pic: "Riza", target: 70, satuan: "Lead", note: "Sum target Riza + Yudi" },
  { nama: "Progres Proyek Q3", divisi: "Proyek", pic: "Rizal", target: 100, satuan: "%", note: "Rata-rata Rizal + Amir + Sinta" },
  { nama: "BAST Proyek Q3", divisi: "Proyek", pic: "Rizal", target: 4, satuan: "BAST", note: "Sum target Rizal" },
  { nama: "Konten Media Q3", divisi: "Media", pic: "Reni", target: 50, satuan: "Konten", note: "Sum target Reni + Rifki + Reta" },
  { nama: "Closing Fee Media Q3", divisi: "Media", pic: "Reni", target: 15000000, satuan: "Rp", note: "Sum target fee Reni" },
  { nama: "Pemberkasan Admin Q3", divisi: "Admin", pic: "Novita", target: 15, satuan: "Unit", note: "Sum target Novita" },
  { nama: "Vendor Best Price Admin Q3", divisi: "Admin", pic: "Sinta", target: 20, satuan: "Vendor", note: "Sum target Sinta" },
  { nama: "Approval Operasional Q3", divisi: "Operasional", pic: "Mada", target: 100, satuan: "%", note: "Mada approval rate" },
  { nama: "Konsolidasi KPI Operasional", divisi: "Operasional", pic: "Mada", target: 30, satuan: "Lead", note: "Mada konsolidasi" },
  { nama: "Strategic Decision Owner", divisi: "Owner", pic: "Pak Ardian", target: 12, satuan: "Decision", note: "Pak Ardian strategic" },
  { nama: "Compliance Owner Q3", divisi: "Owner", pic: "Bu Nisya", target: 100, satuan: "%", note: "Bu Nisya compliance" },
];

// ============================================================
// MAIN
// ============================================================
async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm");
  console.log("Mode:", confirm ? "CONFIRM (write)" : "DRY RUN");
  if (!confirm) console.log("(Tambah --confirm untuk execute.)\n");

  // 1. Add 'KPI' (title) + 'Tipe' (select) properties to KPI DB
  if (confirm) {
    console.log("=== STEP 1: ADD PROPERTIES TO KPI DB ===");
    try {
      await req("PATCH", `/v1/databases/${DBS.kpi}`, {
        properties: {
          "KPI": { rich_text: {} },
          "Tipe": { select: { options: [
            { name: "Personal", color: "blue" },
            { name: "Divisi", color: "green" }
          ]}}
        }
      });
      console.log("  + Added 'KPI' (rich_text) + 'Tipe' (Personal/Divisi)");
    } catch (e) {
      console.error("  FAIL add properties:", e.message);
      return;
    }
    await sleep(2000);
  }

  // 2. Query existing
  console.log("=== STEP 2: QUERY EXISTING ===");
  const kpiRaw = await queryAll("kpi");
  const sowRaw = await queryAll("sow");
  const programRaw = await queryAll("program");
  console.log(`  KPI: ${kpiRaw.length}, SOW: ${sowRaw.length}, Program: ${programRaw.length}`);

  // 3. Extract + group KPI by PIC (sequential index for name)
  const kpiRows = kpiRaw.map(extractKpi);
  const picIdx = {};
  kpiRows.forEach(r => {
    r.idx = picIdx[r.pic] || 0;
    picIdx[r.pic] = r.idx + 1;
  });
  kpiRows.forEach(r => { r.kpiName = generateKpiName(r, r.idx); });
  // 4. Slug
  const sowSlugs = generateIds(sowRaw.map(extractSow), "desc");
  const programSlugs = generateIds(programRaw.map(extractProgram), "nama");

  // Preview
  console.log("\n=== KPI NAME PREVIEW (sample) ===");
  kpiRows.slice(0, 8).forEach(r => console.log(`  ${r.pic} (${r.divisi} ${r.satuan} ${r.periode}) → ${r.kpiName}`));
  console.log("\n=== SOW ID PREVIEW (sample) ===");
  sowSlugs.slice(0, 8).forEach(r => console.log(`  ${r.id.slice(0,8)} → ${r.newId}`));
  console.log("\n=== PROGRAM ID PREVIEW ===");
  programSlugs.forEach(r => console.log(`  ${r.id.slice(0,8)} → ${r.newId}`));
  console.log("\n=== DIVISI-LEVEL KPI (NEW) ===");
  DIVISI_KPI.forEach(d => console.log(`  + ${d.nama} | ${d.divisi} | ${d.pic}`));

  if (!confirm) {
    console.log("\n[DRY RUN] Tidak ada perubahan. Run dengan --confirm untuk execute.");
    return;
  }

  // 5. Update KPI: name + Tipe=Personal + ID=slug
  console.log("\n=== STEP 3: UPDATE 36 KPI ROWS (name + Tipe=Personal + ID=slug) ===");
  for (let i = 0; i < kpiRows.length; i++) {
    const r = kpiRows[i];
    const slug = slugify(r.kpiName);
    try {
      await req("PATCH", `/v1/pages/${r.id}`, {
        properties: {
          "KPI": { rich_text: [{ text: { content: r.kpiName } }] },
          "KPI ID": { title: [{ text: { content: slug } }] },
          "Tipe": { select: { name: "Personal" } },
        }
      });
      console.log(`  [${i+1}/${kpiRows.length}] ${r.pic}: ${r.kpiName} → ${slug}`);
    } catch (e) {
      console.error(`  [${i+1}/${kpiRows.length}] FAILED ${r.pic}: ${e.message}`);
    }
    if ((i + 1) % 10 === 0) { await sleep(60000); } else { await sleep(1000); }
  }

  // 6. Update SOW: ID = slug
  console.log("\n=== STEP 4: UPDATE 38 SOW (ID=slug) ===");
  for (let i = 0; i < sowSlugs.length; i++) {
    const r = sowSlugs[i];
    if (!r.newId) continue;
    try {
      await req("PATCH", `/v1/pages/${r.id}`, {
        properties: { "SOW ID": { title: [{ text: { content: r.newId } }] } }
      });
      console.log(`  [${i+1}/${sowSlugs.length}] → ${r.newId}`);
    } catch (e) {
      console.error(`  [${i+1}/${sowSlugs.length}] FAILED: ${r.newId} → ${e.message}`);
    }
    if ((i + 1) % 10 === 0) { await sleep(60000); } else { await sleep(1000); }
  }

  // 7. Update Program: ID = slug
  console.log("\n=== STEP 5: UPDATE 6 PROGRAM (ID=slug) ===");
  for (let i = 0; i < programSlugs.length; i++) {
    const r = programSlugs[i];
    if (!r.newId) continue;
    try {
      await req("PATCH", `/v1/pages/${r.id}`, {
        properties: { "Program ID": { title: [{ text: { content: r.newId } }] } }
      });
      console.log(`  [${i+1}/${programSlugs.length}] → ${r.newId}`);
    } catch (e) {
      console.error(`  [${i+1}/${programSlugs.length}] FAILED: ${r.newId} → ${e.message}`);
    }
    await sleep(1000);
  }

  // 8. Insert 12 Divisi KPI rows
  console.log("\n=== STEP 6: INSERT 12 DIVISI-LEVEL KPI ===");
  for (let i = 0; i < DIVISI_KPI.length; i++) {
    const d = DIVISI_KPI[i];
    const slug = slugify(d.nama);
    try {
      await req("POST", "/v1/pages", {
        parent: { database_id: DBS.kpi },
        properties: {
          "KPI ID": { title: [{ text: { content: slug } }] },
          "KPI": { rich_text: [{ text: { content: d.nama } }] },
          "PIC": { select: { name: d.pic } },
          "Divisi": { select: { name: d.divisi } },
          "Periode": { select: { name: "Bulanan" } },
          "Target": { number: d.target },
          "Realisasi": { number: 0 },
          "Satuan": { select: { name: d.satuan } },
          "Status": { select: { name: "On Track" } },
          "Tipe": { select: { name: "Divisi" } },
          "Catatan": { rich_text: [{ text: { content: `[Divisi] ${d.note}` } }] },
          "Edit_Time": { rich_text: [{ text: { content: process.env.MIGRATION_TS || "" } }] },
        }
      });
      console.log(`  [${i+1}/${DIVISI_KPI.length}] + ${d.nama}`);
    } catch (e) {
      console.error(`  [${i+1}/${DIVISI_KPI.length}] FAILED: ${d.nama} → ${e.message}`);
    }
    if ((i + 1) % 10 === 0) { await sleep(60000); } else { await sleep(1000); }
  }

  console.log("\n=== DONE ===");
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
