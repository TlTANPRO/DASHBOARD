// lib/rollup.js — Cross-DB rollup helpers
import { API } from "./api.js";

// KPI rollup: hitung jobdesk terkait per KPI
// Karena tidak ada field link_to_KPI di Jobdesk, pakai keyword match
export async function kpiRollup(kpiTitle) {
  const [jobdesk, program, sow] = await Promise.all([
    API.listJobdesk().catch(() => []),
    API.listProgram().catch(() => []),
    API.listSOW().catch(() => []),
  ]);
  const kw = (kpiTitle || "").toLowerCase().split(/\s+/).filter(w => w.length > 4);
  if (kw.length === 0) return { jobdesk: [], program: [], sow: [], summary: "" };
  const matchKw = (text) => kw.some(k => (text || "").toLowerCase().includes(k));

  const relatedJD = jobdesk.filter(j => matchKw(j.Aktivitas));
  const relatedProg = program.filter(p => matchKw(p.Judul || p["Nama Program"]));
  const relatedSOW = sow.filter(s => matchKw(s.Deskripsi || s.Judul));

  return {
    jobdesk: relatedJD.slice(0, 5),
    program: relatedProg.slice(0, 5),
    sow: relatedSOW.slice(0, 5),
    summary: `${relatedJD.length} jobdesk • ${relatedProg.length} program • ${relatedSOW.length} SOW terkait`,
  };
}
