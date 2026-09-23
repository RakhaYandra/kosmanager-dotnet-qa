# kosmanager-dotnet-qa

[![ci](https://github.com/RakhaYandra/kosmanager-dotnet-qa/actions/workflows/qa.yml/badge.svg)](https://github.com/RakhaYandra/kosmanager-dotnet-qa/actions)

> Ekosistem: [api](https://github.com/RakhaYandra/kosmanager-dotnet) · [web](https://github.com/RakhaYandra/kosmanager-dotnet-web) · [docs](https://github.com/RakhaYandra/kosmanager-dotnet-docs/releases) · [qa](https://github.com/RakhaYandra/kosmanager-dotnet-qa) · [data](https://github.com/RakhaYandra/kosmanager-dotnet-data) · [ops](https://github.com/RakhaYandra/kosmanager-dotnet-ops)

QA portfolio KosManager — test plan, 54 test cases 100% Pass, RBAC matrix,
Newman 25/25, Playwright e2e 12/12, Excel report. 1 kasus verified-real
(Telegram terkirim ke HP).

## Purpose, Output & Expectations

**Purpose.** Setiap klaim di CV/porto harus punya bukti yang bisa di-run ulang:
kontrak API, matriks RBAC, reminder scheduler, dan 1 pengiriman Telegram asli.

**Output.** `test-plan.md`, 54 cases YAML (`data/testcases.yaml`), suite Newman
(25 requests), 12 API-flows Playwright, `KosManager-QA-Report.xlsx` (Cover,
Cases, Execution Log, Bugs, Summary).

**Expectations.** Clone → API demo up → `npm test` hijau tanpa edit;
setiap case tertelusur ke ID di YAML.

## Metrik

| Suite | Hasil |
|---|---|
| QA cases | 54/54 Pass |
| Newman | 25/25, 0 failed |
| Playwright e2e | 12/12 |
| UI Playwright (web, 17/17 endpoint) | 9/9 aksi (CRUD, CSV up/down, register) |
| Real Telegram | 1/1 verified-real (TC-NOTIFY-05) |
| Bugs open | 0 (1 closed-by-design: kas Rp 0 saat tak ada paid) |

## RBAC matrix

Lihat `test-plan.md` (tabel owner/penghuni/anon per aksi).

## Hasil (run 2026-09-22, env terisolasi)

Newman 25/25 (0 failed) · Playwright 12/12 · QA 50/50 · UI 9/9 ·
Telegram real 1/1 · DB: MySQL 8.4 scratch + seed fiktif.

## Struktur

```
test-plan.md            # strategi + matriks RBAC + kriteria lolos
data/testcases.yaml     # 50 cases (sumber kebenaran)
e2e/tests/flows.spec.ts # 12 API-flows Playwright
reports/                # newman.json, playwright.json, KosManager-QA-Report.xlsx
tools/generate-report.py# YAML+JSON -> Excel 5-sheet
```

## Bug temuan (ringkas)

Nol bug open. 1 closed-by-design: kas Rp 0 saat tak ada paid (bukan bug).
Riwayat debug nyata (bukan di Excel): JWT secret <256 bit, Pomelo/EF downgrade,
Blazor prerender-vs-session, MudDrawer overlay — lihat runbook `-ops`.

## Run lokal

```bash
# API harus jalan + seed (lihat kosmanager-dotnet)
npx --yes newman run ../api/postman_collection.json --env-var baseUrl=http://localhost:8090
cd e2e && npm install && npx playwright test
python3 tools/generate-report.py
```
