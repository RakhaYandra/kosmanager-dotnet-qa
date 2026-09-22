# kosmanager-dotnet-qa

QA portfolio KosManager — test plan, 47 test cases 100% Pass, RBAC matrix,
Newman 22/22, Playwright e2e 12/12, Excel report. 1 kasus verified-real
(Telegram terkirim ke HP).

## Run lokal

```bash
# API harus jalan + seed (lihat kosmanager-dotnet)
npx --yes newman run ../api/postman_collection.json --env-var baseUrl=http://localhost:8090
cd e2e && npm install && npx playwright test
python3 tools/generate-report.py
```
