import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list'], ['json', { outputFile: '../reports/playwright.json' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:8090' },
});
