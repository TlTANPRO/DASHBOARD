// perf-check.js
// Check bundle size + simple perf hints. No Lighthouse needed.
// Pakai: node perf-check.js

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = [
  "v2/index.html",
  "v2/app.js",
  "v2/lib/components/master-view.js",
  "v2/lib/components/status-pill.js",
  "v2/lib/alerts.js",
  "v2/lib/audit.js",
  "v2/lib/weekly-summary.js",
  "v2/config.js",
];

let total = 0;
console.log("=== PERF CHECK · Dashboard V2 ===\n");
console.log("File                                          Size (KB)  Status");
console.log("-".repeat(72));

for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log(`${f.padEnd(45)}  MISSING     ✗`); continue; }
  const stat = fs.statSync(p);
  const kb = stat.size / 1024;
  total += kb;
  const flag = kb > 100 ? "⚠" : (kb > 200 ? "✗" : "✓");
  console.log(`${f.padEnd(45)}  ${kb.toFixed(1).padStart(8)}   ${flag}`);
}

console.log("-".repeat(72));
console.log(`${"TOTAL".padEnd(45)}  ${total.toFixed(1).padStart(8)} KB`);
console.log(`Budget: < 200 KB gzipped. Raw budget for GitHub Pages: < 500 KB.`);
console.log(`Status: ${total < 500 ? "✓ OK" : "⚠ over budget"}`);

// Approx gzipped
let totalGz = 0;
const zlib = require("zlib");
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const buf = fs.readFileSync(p);
  totalGz += zlib.gzipSync(buf).length;
}
console.log(`Gzipped: ${(totalGz / 1024).toFixed(1)} KB  ${totalGz / 1024 < 200 ? "✓ OK" : "⚠ over budget"}`);

// A11y quick check
console.log("\n=== A11Y QUICK CHECK ===");
const htmlContent = fs.readFileSync(path.join(ROOT, "v2/index.html"), "utf8");
const sources = [htmlContent];
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p) || !f.endsWith(".js")) continue;
  sources.push(fs.readFileSync(p, "utf8"));
}
const allSrc = sources.join("\n");
const checks = [
  ["skip-link present", /class="skip-link"/],
  ["focus-visible CSS", /:focus-visible/],
  ["reduced-motion", /prefers-reduced-motion/],
  ["aria-busy", /aria-busy/],
  ["aria-live", /aria-live/],
  ["aria-modal", /aria-modal/],
  ["role=dialog", /role="dialog"/],
  ["role=alert|status", /role.*"(alert|status)"/],
  ["<main> tag", /<main/],
  ["<nav> tag", /<nav/],
  ["<header> tag", /<header/],
  ["lang=id", /lang="id"/],
];
let aPass = 0, aFail = 0;
for (const [name, re] of checks) {
  const ok = re.test(allSrc);
  console.log(`  ${ok ? "✓" : "✗"} ${name}`);
  ok ? aPass++ : aFail++;
}
console.log(`\nA11y: ${aPass}/${aPass + aFail} pass`);
process.exit(0);
