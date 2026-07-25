$headers = @{
  "Authorization" = "Bearer $env:NOTION_TOKEN"
  "Notion-Version" = "2022-06-28"
}
if (-not $env:NOTION_TOKEN) {
  Write-Host "ERROR: set env var dulu: `$env:NOTION_TOKEN = 'ntn_xxx'" -ForegroundColor Red
  exit 1
}
try {
  $res = Invoke-RestMethod -Method Get -Uri "https://api.notion.com/v1/users/me" -Headers $headers
  $res | ConvertTo-Json
} catch {
  Write-Host "ERROR: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
