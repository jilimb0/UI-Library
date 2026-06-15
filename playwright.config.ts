import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const baseURL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: process.env.UI_LIBRARY_SKIP_WEB_SERVER
    ? undefined
    : {
        command: './scripts/pages/serve-pages-preview.sh',
        url: baseURL,
        timeout: 600_000,
        reuseExistingServer: !process.env.CI,
      },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
