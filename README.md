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

Angka di tabel ini adalah **sumber kebenaran** seluruh ekosistem. Repo lain
(`api`, `ops`, `docs`) mengutip dari sini, bukan sebaliknya — jangan tambah
salinan angka di repo lain, cepat saja akan basi.

| Suite | Hasil | Diverifikasi oleh |
|---|---|---|
| QA cases | 54/54 Pass | `data/testcases.yaml` (54 ID unik) |
| Newman | 25/25, 0 failed | CI gate `qa.yml` (assert total == 25) |
| Playwright e2e | 12/12 | `e2e/tests/flows.spec.ts` (12 test) |
| Real Telegram | 1/1 verified-real (TC-NOTIFY-05) | manual, env terisolasi |
| Bugs open | 0 (1 closed-by-design: kas Rp 0 saat tak ada paid) | — |

Tidak ada metrik UI Playwright: repo ini tidak punya file test UI, jadi angka
sebelumnya ("9/9 aksi") dihapus — tidak ada buktinya di mana pun.

## RBAC matrix

Lihat `test-plan.md` (tabel owner/penghuni/anon per aksi).

## Hasil (run 2026-09-22, env terisolasi)

Newman 25/25 (0 failed) · Playwright 12/12 · QA 54/54 · Telegram real 1/1 ·
DB: MySQL 8.4 scratch + seed fiktif.

Report run (newman.json, playwright.json, Excel) **tidak di-commit** — di-publish
sebagai CI artifact `qa-reports` (retensi 30 hari) supaya tidak ada token yang
terbaca di riwayat git. Unduh dari tab Artifacts pada run CI.

## Struktur

```
test-plan.md            # strategi + matriks RBAC + kriteria lolos
data/testcases.yaml     # 54 cases (sumber kebenaran)
e2e/tests/flows.spec.ts # 12 API-flows Playwright
reports/                # output — di-generate, di-ignore, dipublish sbg artifact
tools/generate-report.py# YAML+JSON -> Excel 5-sheet
```

## Bug temuan (ringkas)

Nol bug open. 1 closed-by-design: kas Rp 0 saat tak ada paid (bukan bug).
Riwayat debug nyata (bukan di Excel): JWT secret <256 bit, Pomelo/EF downgrade,
Blazor prerender-vs-session, MudDrawer overlay — lihat runbook `-ops`.

## Run lokal

```bash
# API harus jalan + seed (lihat kosmanager-dotnet)
git clone https://github.com/RakhaYandra/kosmanager-dotnet.git
npx --yes newman run kosmanager-dotnet/KosManager.Api/api/postman_collection.json \
  --env-var baseUrl=http://localhost:8090
cd e2e && npm install && npx playwright test
cd .. && python3 tools/generate-report.py
```
