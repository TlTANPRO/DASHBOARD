#!/usr/bin/env node
/**
 * sync-from-program-kerja.mjs — Parse `output/PROGRAM KERJA.docx` BAB 5/6/7
 *                                  → data/kpi-{perusahaan,divisi,personal}.json
 *
 * Pattern: parse DOCX → JSON, NEVER hardcode KPI values.
 *
 * Usage:
 *   node scripts/sync-from-program-kerja.mjs
 *   node scripts/sync-from-program-kerja.mjs --dry-run   # preview only, no writes
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mammoth from "mammoth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");

// CLI args
const dryRun = process.argv.includes("--dry-run");

// Resolve PROGRAM KERJA.docx path (relative to buku-management-syahfalah/)
const BUKU_ROOT = path.resolve(PROJECT_ROOT, "..");
const DOCX_CANDIDATES = [
  path.join(BUKU_ROOT, "output", "PROGRAM KERJA.docx"),
  path.join(BUKU_ROOT, "output", "buku-management-syahfalah-v1.0.docx"),
];

function findDocx() {
  for (const p of DOCX_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    `PROGRAM KERJA.docx not found. Searched:\n${DOCX_CANDIDATES.join("\n")}`
  );
}

// Extract BAB 5/6/7 from raw text — find 2nd occurrence (skip TOC)
function extractSections(text) {
  const lines = text.split("\n");
  const babIdx = {};
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^BAB (\d+)\s+(.+?)\s*$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!babIdx[n]) babIdx[n] = [];
      babIdx[n].push({ line: i, title: m[2].trim() });
    }
  }
  // Skip first occurrence (TOC entries at line ~0..30)
  const startOf = (n) => babIdx[n]?.[1]?.line ?? babIdx[n]?.[0]?.line ?? -1;
  const endOf = (n) => {
    const arr = babIdx[n + 1];
    if (!arr) return lines.length;
    const e = arr[1]?.line ?? arr[0]?.line ?? lines.length;
    return e <= startOf(n) ? lines.length : e;
  };
  return {
    bab5: lines.slice(startOf(5), endOf(5)).join("\n"),
    bab6: lines.slice(startOf(6), endOf(6)).join("\n"),
    bab7: lines.slice(startOf(7), endOf(7)).join("\n"),
  };
}

// Parse BAB 5 (KPI Perusahaan) — has Level 1/2 with Formula+Target table, Level 3/4 as text summaries
function parseBab5(text) {
  const result = { level_1: [], level_2: [], level_3_summary: [], level_4_note: "" };

  // L1: section "5.1  KPI Perusahaan — Level 1 (Direktur)" → ends at "5.2"
  const l1Match = text.match(/5\.1[\s\S]*?(?=5\.2\s|$)/);
  if (l1Match) {
    result.level_1 = parseThreeColTable(l1Match[0]);
  }

  // L2: section "5.2  KPI Kepala Kantor — Level 2" → ends at "5.3"
  const l2Match = text.match(/5\.2[\s\S]*?(?=5\.3\s|$)/);
  if (l2Match) {
    result.level_2 = parseTwoColTable(l2Match[0]);
  }

  // L3: section "5.3  KPI PIC Divisi — Level 3" → ends at "5.4"
  const l3Match = text.match(/5\.3[\s\S]*?(?=5\.4\s|$)/);
  if (l3Match) {
    result.level_3_summary = parseDivisiSlots(l3Match[0]);
  }

  // L4: section "5.4  KPI Staff — Level 4" → ends at "5.5"
  const l4Match = text.match(/5\.4[\s\S]*?(?=5\.5\s|$)/);
  if (l4Match) {
    result.level_4_note = l4Match[0]
      .replace(/^5\.4[\s\S]*?\n/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return result;
}

// Parse BAB 6 (KPI Divisi) — 6 sections (6.1 .. 6.6), each with 2-col table
function parseBab6(text) {
  const divisiOrder = [
    { slug: "marketing", nama: "Marketing & Sales", pattern: /^6\.1\s+Divisi Marketing/m },
    { slug: "proyek", nama: "Proyek & Konstruksi", pattern: /^6\.2\s+Divisi Proyek/m },
    { slug: "operasional", nama: "Operasional & Admin", pattern: /^6\.3\s+Divisi Operasional/m },
    { slug: "legal", nama: "Legal & Compliance", pattern: /^6\.4\s+Divisi Legal/m },
    { slug: "media", nama: "Media & Konten Kreatif", pattern: /^6\.5\s+Divisi Media/m },
    { slug: "owner", nama: "Owner / Director", pattern: /^6\.6\s+KPI Owner/m },
  ];

  const sections = [];
  for (let i = 0; i < divisiOrder.length; i++) {
    const cur = divisiOrder[i];
    const next = divisiOrder[i + 1];
    const start = text.search(cur.pattern);
    if (start < 0) continue;
    const end = next ? text.search(next.pattern) : text.length;
    const body = text.slice(start, end);
    sections.push({
      slug: cur.slug,
      nama: cur.nama,
      kpis: parseTwoColTable(body),
    });
  }
  return sections;
}

// Parse BAB 7 (KPI Personal) — 12 sections (7.1 .. 7.12), each with 2-col table
function parseBab7(text) {
  const picMap = [
    { pattern: /^7\.1\s+Pak Ardian/m, pic: "Pak Ardian", divisi: "owner" },
    { pattern: /^7\.2\s+Bu Nisya/m, pic: "Bu Nisya", divisi: "legal" },
    { pattern: /^7\.3\s+Mada/m, pic: "Mada", divisi: "marketing" },
    { pattern: /^7\.4\s+Riza/m, pic: "Riza", divisi: "marketing" },
    { pattern: /^7\.5\s+Yudi/m, pic: "Yudi/Sdek", divisi: "marketing" },
    { pattern: /^7\.6\s+Amir/m, pic: "Amir", divisi: "proyek" },
    { pattern: /^7\.7\s+Novita/m, pic: "Novita", divisi: "operasional" },
    { pattern: /^7\.8\s+Rizal/m, pic: "Rizal", divisi: "proyek" },
    { pattern: /^7\.9\s+Sinta/m, pic: "Sinta", divisi: "operasional" },
    { pattern: /^7\.10\s+Reni/m, pic: "Reni", divisi: "media" },
    { pattern: /^7\.11\s+Rifki/m, pic: "Rifki", divisi: "media" },
    { pattern: /^7\.12\s+Reta/m, pic: "Reta", divisi: "media" },
  ];

  const rows = [];
  for (let i = 0; i < picMap.length; i++) {
    const cur = picMap[i];
    const next = picMap[i + 1];
    const start = text.search(cur.pattern);
    if (start < 0) continue;
    const end = next ? text.search(next.pattern) : text.length;
    const body = text.slice(start, end);
    const kpis = parseTwoColTable(body);
    for (const k of kpis) {
      rows.push({
        pic: cur.pic,
        kpi: k.indikator,
        target: k.target,
        actual: "",
        evidence: "",
        divisi: cur.divisi,
      });
    }
  }
  return rows;
}

// Parse 2-col table: alternating "label\nvalue\n" pattern
function parseTwoColTable(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const kpis = [];
  let i = 0;
  // Skip section header + body preamble (e.g. "5.2  KPI..." + "Dilaporkan bulanan ke Direktur:")
  while (i < lines.length && lines[i].match(/^\d+\.\d+\s+/)) i++;
  while (i < lines.length && !/^(KPI|Target|Indikator)$/i.test(lines[i])) i++;
  while (i < lines.length && /^(KPI|Target|Indikator)$/i.test(lines[i])) i++;
  while (i < lines.length) {
    const label = lines[i++];
    if (!label) continue;
    const value = lines[i++] || "";
    if (label && value) {
      kpis.push({ indikator: label, target: value, actual: "" });
    }
  }
  return kpis;
}

// Parse 3-col table (KPI/Formula/Target) — for BAB 5.1
function parseThreeColTable(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const kpis = [];
  let i = 0;
  // Skip section header (5.1 ...) + preamble
  while (i < lines.length && lines[i].match(/^\d+\.\d+\s+/)) i++;
  // Skip body preamble lines until we hit "KPI" header
  while (i < lines.length && !/^KPI$/i.test(lines[i])) i++;
  // Skip header row (KPI / Formula / Target)
  while (i < lines.length && /^(KPI|Formula|Target)$/i.test(lines[i])) i++;
  while (i < lines.length) {
    const kpi = lines[i++];
    if (!kpi) continue;
    const formula = lines[i++] || "";
    const target = lines[i++] || "";
    if (kpi && target) {
      kpis.push({ indikator: kpi, formula, target, actual: "" });
    }
  }
  return kpis;
}

// Parse BAB 5.3 (Divisi slots — text per-divisi summary)
function parseDivisiSlots(text) {
  // Skip section header + preamble lines until we hit the table
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const slots = [];
  let i = 0;
  while (i < lines.length && lines[i].match(/^\d+\.\d+\s+/)) i++; // skip 5.3 header
  while (i < lines.length && !/^Divisi$/i.test(lines[i])) i++;   // skip preamble until "Divisi" header
  while (i < lines.length && /^(Divisi|Slot KPI Utama)$/i.test(lines[i])) i++; // skip header row
  // Now alternate: divisi / slot_kpi
  while (i < lines.length) {
    const divisi = lines[i++];
    if (!divisi) continue;
    const slot = lines[i++] || "";
    if (divisi && slot && !/^5\./.test(divisi)) {
      slots.push({ divisi, slot_kpi: slot });
    }
  }
  return slots;
}

async function main() {
  console.log("=".repeat(60));
  console.log("sync-from-program-kerja.mjs");
  console.log("=".repeat(60));
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "WRITE"}`);

  const docxPath = findDocx();
  console.log(`Source: ${docxPath}`);

  const { value: text } = await mammoth.extractRawText({ path: docxPath });
  const { bab5, bab6, bab7 } = extractSections(text);

  const perusahaan = parseBab5(bab5);
  const divisi = parseBab6(bab6);
  const personalRows = parseBab7(bab7);

  // Validate counts
  console.log(`BAB 5 L1: ${perusahaan.level_1.length} KPI`);
  console.log(`BAB 5 L2: ${perusahaan.level_2.length} KPI`);
  console.log(`BAB 5 L3: ${perusahaan.level_3_summary.length} slots`);
  console.log(`BAB 6: ${divisi.length} divisi`);
  divisi.forEach(d => console.log(`  - ${d.slug}: ${d.kpis.length} KPI`));
  console.log(`BAB 7: ${personalRows.length} rows`);

  if (dryRun) {
    console.log("\n[DRY-RUN] No files written.");
    return;
  }

  const now = new Date().toISOString().slice(0, 10);
  const note = `Synced from output/PROGRAM KERJA.docx BAB ${perusahaan.level_1.length ? "5/6/7" : "?"} via sync-from-program-kerja.mjs`;

  const kpiPerusahaanJson = {
    _meta: {
      source: "output/PROGRAM KERJA.docx BAB 5 (KPI Perusahaan Level 1-4)",
      generated_at: now,
      note,
    },
    level_1: perusahaan.level_1,
    level_2: perusahaan.level_2,
    level_3_summary: perusahaan.level_3_summary,
    level_4_note: perusahaan.level_4_note,
  };

  const kpiDivisiJson = {
    _meta: {
      source: "output/PROGRAM KERJA.docx BAB 6 (KPI 6 Divisi)",
      generated_at: now,
      note,
    },
    divisi: divisi,
  };

  const kpiPersonalJson = {
    _meta: {
      source: "output/PROGRAM KERJA.docx BAB 7 via sync-from-program-kerja.mjs",
      generated_at: now,
      count: personalRows.length,
      note,
    },
    rows: personalRows,
  };

  await writeFile(path.join(DATA_DIR, "kpi-perusahaan.json"), JSON.stringify(kpiPerusahaanJson, null, 2), "utf8");
  await writeFile(path.join(DATA_DIR, "kpi-divisi.json"), JSON.stringify(kpiDivisiJson, null, 2), "utf8");
  await writeFile(path.join(DATA_DIR, "kpi-personal.json"), JSON.stringify(kpiPersonalJson, null, 2), "utf8");

  console.log("\n[OK] kpi-perusahaan.json + kpi-divisi.json + kpi-personal.json written");
  console.log("=".repeat(60));
}

main().catch(e => { console.error("[FATAL]", e); process.exit(1); });