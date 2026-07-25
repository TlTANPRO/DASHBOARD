const https = require('https');
const TOKEN = process.env.NOTION_TOKEN;
const req = (m, p, b) => new Promise((res, rej) => {
  const d = b ? JSON.stringify(b) : null;
  const r = https.request({
    host: 'api.notion.com', path: p, method: m,
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...(d ? { 'Content-Length': Buffer.byteLength(d) } : {})
    }
  }, (x) => {
    let buf = '';
    x.on('data', c => buf += c);
    x.on('end', () => {
      try {
        const j = JSON.parse(buf);
        if (x.statusCode >= 400) rej(new Error('HTTP ' + x.statusCode + ': ' + JSON.stringify(j)));
        else res(j);
      } catch (e) { rej(e); }
    });
  });
  r.on('error', rej);
  if (d) r.write(d);
  r.end();
});

const dbs = [
  { key: 'kpi',     id: '3a84cf7e-9f24-819d-95d8-f951e6a1a6a2' },
  { key: 'sow',     id: '3a84cf7e-9f24-816c-be14-ef1f171b4d52' },
  { key: 'program', id: '3a84cf7e-9f24-8172-bd10-ee9e8056940a' },
  { key: 'jobdesk', id: '3a84cf7e-9f24-814f-bd01-cd52e64db04e' }
];

Promise.all(dbs.map(d =>
  req('GET', '/v1/databases/' + d.id)
    .then(r => ({ key: d.key, name: r.title[0]?.plain_text, parent: r.parent?.type, props: Object.keys(r.properties).length }))
    .catch(e => ({ key: d.key, err: e.message }))
)).then(rs => {
  rs.forEach(r => console.log(JSON.stringify(r)));
});
