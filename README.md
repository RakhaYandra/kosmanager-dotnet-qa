# kosmanager-dotnet-qa

QA portfolio KosManager — test plan, 47 test cases 100% Pass, RBAC matrix,
Newman 22/22, Playwright e2e 12/12, Excel report. 1 kasus verified-real
(Telegram terkirim ke HP).

## Purpose, Output & Expectations

**Purpose.** Setiap klaim di CV/porto harus punya bukti yang bisa di-run ulang:
kontrak API, matriks RBAC, reminder scheduler, dan 1 pengiriman Telegram asli.

**Output.** `test-plan.md`, 47 cases YAML (`data/testcases.yaml`), suite Newman
(22 requests), 12 API-flows Playwright, `KosManager-QA-Report.xlsx` (Cover,
Cases, Execution Log, Bugs, Summary).

**Expectations.** Clone → API demo up → `npm test` hijau tanpa edit;
setiap case tertelusur ke ID di YAML.

## Metrik

| Suite | Hasil |
|---|---|
| QA cases | 47/47 Pass |
| Newman | 22/22, 0 failed |
| Playwright e2e | 12/12 |
| UI Playwright (web, 17/17 endpoint) | 9/9 aksi (CRUD, CSV up/down, register) |
| Real Telegram | 1/1 verified-real (TC-NOTIFY-05) |
| Bugs open | 0 (1 closed-by-design: kas Rp 0 saat tak ada paid) |

## RBAC matrix

Lihat `test-plan.md` (tabel owner/penghuni/anon per aksi).

## Run lokal

```bash
# API harus jalan + seed (lihat kosmanager-dotnet)
npx --yes newman run ../api/postman_collection.json --env-var baseUrl=http://localhost:8090
cd e2e && npm install && npx playwright test
python3 tools/generate-report.py
```
