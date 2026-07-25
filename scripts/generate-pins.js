// generate-pins.js
// Generate random 4-digit PIN per PIC, hash PBKDF2-SHA256, output JSON untuk Worker secret PINS.
// Pakai: node generate-pins.js
// Output: prints JSON + assignment table untuk owner distribusi via WA.

const crypto = require("crypto");

const PIC_LIST = [
  "Pak Ardian", "Bu Nisya", "Mada", "Riza",
  "Yudi (Sdek)", "Rizal", "Amir", "Novita",
  "Sinta", "Reni", "Rifki", "Reta"
];

function pbkdf2Hash(pin, salt) {
  const key = crypto.pbkdf2Sync(pin, Buffer.from(salt, "hex"), 100000, 32, "sha256");
  return key.toString("hex");
}

function generateSalt() {
  return crypto.randomBytes(8).toString("hex");
}

console.log("=== PIN GENERATOR · DASHBOARD V2 ===\n");
console.log("Random 4-digit PIN per PIC, hash PBKDF2-SHA256.\n");

const pins = {};
const assignment = [];

for (const pic of PIC_LIST) {
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  const salt = generateSalt();
  const hash = pbkdf2Hash(pin, salt);
  pins[pic] = `pbkdf2$${salt}$${hash}`;
  assignment.push({ pic, pin });
}

console.log("--- Distribution table (untuk owner share via WA) ---\n");
console.log("| PIC          | PIN  |");
console.log("|--------------|------|");
for (const a of assignment) {
  console.log(`| ${a.pic.padEnd(12)} | ${a.pin}  |`);
}

console.log("\n--- Worker secret (PINS) — paste ke `wrangler secret put PINS` ---\n");
console.log(JSON.stringify(pins, null, 2));
console.log("\n--- Cara set secret ---");
console.log("cd ../notion-proxy-worker");
console.log("wrangler secret put PINS");
console.log("(paste JSON di atas, satu baris)");
console.log("\n--- Test PIN verify ---");
console.log("Login di dashboard dengan PIN sesuai tabel → harus SUCCESS.");
