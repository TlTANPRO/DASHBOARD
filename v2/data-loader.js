// V2 · Data loader untuk V1 SSOT (struktur, leaderboard, fee, pricing, STB, manager, glosarium)
// Path: ../data/tim-v2/<name>.json (relatif dari /v2/)
const SSOT_V1 = "../data/tim-v2/";

const SSOT_FILES = [
  "jd-lengkap-12-pic", "kalkulasi-kpi", "bonus-scheme",
  "sop-stb", "manager-standar", "harga-tier", "hr-policy"
];

const cache = {};
async function loadSSOT(name) {
  if (cache[name]) return cache[name];
  try {
    const r = await fetch(SSOT_V1 + name + ".json");
    if (!r.ok) throw new Error(name + " " + r.status);
    cache[name] = await r.json();
    return cache[name];
  } catch (e) {
    console.warn("SSOT load fail:", name, e.message);
    return null;
  }
}

window.SSOT = { load: loadSSOT, files: SSOT_FILES };
