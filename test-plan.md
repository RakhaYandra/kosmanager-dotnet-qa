# KosManager QA — Test Plan

Target: API `kosmanager-dotnet` + web `kosmanager-dotnet-web` (single-kos MVP).
Strategi: Newman (kontrak API) + Playwright API-flows + 1 kasus real Telegram.
Semua data fiktif. Status: verified-local, kecuali TC-NOTIFY-05 (verified-real).

## Scope

IN: auth 2 role, rooms, tenants (+CSV), bills generate, payments + verifikasi,
dashboard + CSV, notify mock/telegram, RBAC negatif.
OUT: webhook publik, denda otomatis, struk PDF, multi-kos (Fase 2).

## Matriks RBAC

| Aksi | owner | penghuni | anon |
|---|---|---|---|
| auth register/login/me | ✅ | ✅ | ✅/✅/❌ |
| rooms CRUD | ✅ | ❌ (baca: ✅ list) | ❌ |
| tenants CRUD/import | ✅ | ❌ | ❌ |
| bills list | semua | milik sendiri | ❌ |
| bills generate | ✅ | 403 | 401 |
| payments create | ✅ | milik sendiri | ❌ |
| payments verify/queue | ✅ | 403 | ❌ |
| dashboard/report | ✅ | 403 | 401 |
| notify test | ✅ | 403 | ❌ |

## Lingkungan uji

MySQL 8.4 Docker + EF migrate + seed fiktif (6 kamar, 5 penghuni, 7 tagihan).
API `:8090`, channel default `mock`. Akun: `owner@kos.local`, `sinta@kos.local`.

## Kriteria lolos

Newman 25/25 · QA cases 50/50 Pass · e2e Playwright 12/12 · 1 bug policy:
temuan real (bukan seed) wajib repro + severity.
