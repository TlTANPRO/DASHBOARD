const https = require("https")
const WORKER = "titan-notion-proxy.nickasad10000.workers.dev"
const KPI_DB = "3a84cf7e-9f24-819d-95d8-f951e6a1a6a2"

function req(m, p, b) {
  return new Promise((res, rej) => {
    const d = b ? JSON.stringify(b) : null
    const r = https.request({ host: WORKER, path: "/notion" + p, method: m,
      headers: { "Content-Type": "application/json", ...(d ? { "Content-Length": Buffer.byteLength(d) } : {}) } },
      (x) => { let buf = ""; x.on("data", c => buf += c); x.on("end", () => { try { const j = JSON.parse(buf); if (x.statusCode >= 400) rej(new Error("HTTP "+x.statusCode+": "+JSON.stringify(j).slice(0,200))); else res(j) } catch (e) { rej(e) } }) })
    r.on("error", rej); if (d) r.write(d); r.end()
  })
}
const sleep = ms => new Promise(r => setTimeout(r, ms))
function slugify(s) { return s.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 50) }

async function queryAll() {
  const all = []; let cur
  while (true) {
    const body = { page_size: 100 }; if (cur) body.start_cursor = cur
    const r = await req("POST", `/v1/databases/${KPI_DB}/query`, body)
    all.push(...(r.results || []))
    if (!r.has_more) break; cur = r.next_cursor
  }
  return all
}

;(async () => {
  const rows = await queryAll()
  const items = rows.map(p => {
    const id = p.properties["KPI ID"]?.title?.[0]?.plain_text || ""
    const name = p.properties["KPI"]?.rich_text?.[0]?.plain_text || ""
    const pic = p.properties["PIC"]?.select?.name || ""
    return { pageId: p.id, id, name, pic, picShort: slugify(pic) }
  })
  const counts = {}
  items.forEach(r => counts[r.id] = (counts[r.id] || 0) + 1)
  const dupRows = items.filter(r => counts[r.id] > 1)
  console.log(`Total=${items.length} dups=${dupRows.length}`)

  // Group by id, then append picShort only to rows where count > 1
  const seen = new Map()
  for (const r of items) {
    if (counts[r.id] > 1) {
      const newId = `${r.id}-${r.picShort}`
      if (seen.has(newId)) {
        // collision on append, add counter
        let i = 2
        while (seen.has(`${r.id}-${r.picShort}-${i}`)) i++
        r.newId = `${r.id}-${r.picShort}-${i}`
      } else {
        r.newId = newId
      }
      seen.set(r.newId, true)
    } else {
      r.newId = r.id
    }
  }

  let updated = 0, fail = 0
  for (let i = 0; i < items.length; i++) {
    const r = items[i]
    if (r.newId === r.id) continue
    try {
      await req("PATCH", `/v1/pages/${r.pageId}`, {
        properties: { "KPI ID": { title: [{ text: { content: r.newId } }] } }
      })
      console.log(`  [${i+1}] ${r.pic}: ${r.id} → ${r.newId}`)
      updated++
    } catch (e) {
      console.log(`  [${i+1}] FAIL ${r.pic}: ${e.message.slice(0, 100)}`)
      fail++
    }
    await sleep(1000)
  }
  console.log(`Updated=${updated} Fail=${fail}`)
})()
