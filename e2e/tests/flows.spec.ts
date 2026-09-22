import { test, expect, request } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:8090';
let owner = '', user = '';

test.beforeAll(async () => {
  const ctx = await request.newContext();
  owner = (await (await ctx.post(`${BASE}/api/auth/login`, { data: { email: 'owner@kos.local', password: 'owner123' } })).json()).token;
  user = (await (await ctx.post(`${BASE}/api/auth/login`, { data: { email: 'sinta@kos.local', password: 'penghuni123' } })).json()).token;
  await ctx.dispose();
});

const H = (t: string) => ({ Authorization: `Bearer ${t}` });

test('owner dashboard lengkap', async ({ request }) => {
  const r = await request.get(`${BASE}/api/dashboard`, { headers: H(owner) });
  expect(r.ok()).toBeTruthy();
  const d = await r.json();
  expect(d.occupancy.total).toBeGreaterThanOrEqual(6);
  expect(d.overdue.length).toBeGreaterThan(0);
});

test('penghuni hanya lihat miliknya', async ({ request }) => {
  const r = await request.get(`${BASE}/api/bills`, { headers: H(user) });
  const bills = await r.json();
  expect(bills.length).toBeGreaterThan(0);
  expect(bills.every((b: any) => b.tenant === 'Sinta Prabowo')).toBeTruthy();
});

test('penghuni generate 403', async ({ request }) => {
  const r = await request.post(`${BASE}/api/bills/generate?periode=2099-12`, { headers: H(user) });
  expect(r.status()).toBe(403);
});

test('generate idempoten', async ({ request }) => {
  const p = '2099-11';
  const a = await (await request.post(`${BASE}/api/bills/generate?periode=${p}`, { headers: H(owner) })).json();
  const b = await (await request.post(`${BASE}/api/bills/generate?periode=${p}`, { headers: H(owner) })).json();
  expect(a.generated).toBeGreaterThan(0);
  expect(b.generated).toBe(0);
});

test('alur bayar → verify → paid', async ({ request }) => {
  const bills: any[] = await (await request.get(`${BASE}/api/bills`, { headers: H(user) })).json();
  const unpaid = bills.find((b) => b.status === 'unpaid');
  expect(unpaid).toBeDefined();
  const pay = await request.post(`${BASE}/api/payments`, { headers: H(user), data: { billId: unpaid.id, method: 'transfer' } });
  expect(pay.status()).toBe(201);
  const pid = (await pay.json()).id;
  const v = await request.post(`${BASE}/api/payments/${pid}/verify`, { headers: H(owner), data: { approve: true } });
  expect((await v.json()).verified).toBe(true);
});

test('bayar tagihan orang lain 403', async ({ request }) => {
  const all: any[] = await (await request.get(`${BASE}/api/bills`, { headers: H(owner) })).json();
  const other = all.find((b) => b.tenant !== 'Sinta Prabowo' && b.status === 'unpaid');
  const r = await request.post(`${BASE}/api/payments`, { headers: H(user), data: { billId: other.id, method: 'tunai' } });
  expect(r.status()).toBe(403);
});

test('rooms CRUD roundtrip', async ({ request }) => {
  const c = await request.post(`${BASE}/api/rooms`, { headers: H(owner), data: { number: 'Z9', type: 'standar', monthlyPrice: 1, status: 'kosong' } });
  expect(c.status()).toBe(201);
  const id = (await c.json()).id;
  const u = await request.put(`${BASE}/api/rooms/${id}`, { headers: H(owner), data: { number: 'Z9', type: 'standar', monthlyPrice: 2, status: 'kosong' } });
  expect(u.ok()).toBeTruthy();
  const d = await request.delete(`${BASE}/api/rooms/${id}`, { headers: H(owner) });
  expect(d.status()).toBe(204);
});

test('rooms create tanpa token 401', async ({ request }) => {
  const r = await request.post(`${BASE}/api/rooms`, { data: { number: 'ZX', type: 'standar', monthlyPrice: 1, status: 'kosong' } });
  expect(r.status()).toBe(401);
});

test('tenants CSV import', async ({ request }) => {
  const csv = 'Nama A,0812000091,2026-01-01\nRusak\nNama B,0812000092,2026-02-01\n';
  const r = await request.post(`${BASE}/api/tenants/import`, {
    headers: { ...H(owner) },
    multipart: { file: { name: 't.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) } },
  });
  const j = await r.json();
  expect(j.imported).toBe(2);
  expect(j.failed).toBe(1);
});

test('report CSV header', async ({ request }) => {
  const r = await request.get(`${BASE}/api/dashboard/report.csv`, { headers: H(owner) });
  expect(r.ok()).toBeTruthy();
  expect((await r.text()).split('\n')[0]).toContain('penghuni,periode');
});

test('notify mock terkirim', async ({ request }) => {
  const r = await request.post(`${BASE}/api/notify/test`, { headers: H(owner), data: { chatId: '12345' } });
  const j = await r.json();
  expect(j.sent).toBe(true);
});

test('verify queue hanya owner', async ({ request }) => {
  const a = await request.get(`${BASE}/api/payments/queue`, { headers: H(owner) });
  expect(a.ok()).toBeTruthy();
  const b = await request.get(`${BASE}/api/payments/queue`, { headers: H(user) });
  expect(b.status()).toBe(403);
});
