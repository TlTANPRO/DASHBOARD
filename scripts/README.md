# Notion Setup Scripts

## create-notion-dbs.js

Otomatis bikin parent page + 4 database di Notion.

### Prasyarat

1. Punya akun Notion (free tier OK)
2. Bikin integration di https://notion.so/my-integrations
   - Name: `Dashboard V2`
   - Type: Internal
   - Capabilities: Read + Update + Insert
3. Copy **Internal Integration Token** (`secret_…`)

### Cara Jalankan

#### PowerShell (Windows)
```powershell
cd C:\Users\Syahfalah\buku-management-syahfalah\scripts
$env:NOTION_TOKEN = "secret_xxxxxxxxxxxxxxxxxxxxxxxx"
node create-notion-dbs.js
```

#### Bash / Git Bash
```bash
cd /c/Users/Syahfalah/buku-management-syahfalah/scripts
export NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxx
node create-notion-dbs.js
```

### Output

- 1 parent page "DASHBOARD PERUSAHAAN V2" di workspace
- 4 DB: KPI Tracker, SOW, Program Kerja, Jobdesk Harian
- File `notion-ids.json` di folder scripts/

### Next Step

Copy 4 ID dari output → paste ke `deploy/v2/config.js` → switch `mode: "live"`.
Lanjut ke Worker deploy (lihat `deploy/v2/docs/SETUP.md`).
