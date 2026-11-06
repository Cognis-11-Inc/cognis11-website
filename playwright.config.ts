import { defineConfig, devices } from '@playwright/test';

const base = (process.env.ASTRO_BASE_PATH || '/').replace(/\/?$/, '/');
const testPort = process.env.COGNIS_TEST_PORT || '4327';
const baseURL = `http://127.0.0.1:${testPort}${base}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    launchOptions: {
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // --ignore-lock also keeps Astro 7 in the foreground under agent tooling,
    // so Playwright owns and tears down its preview process.
    command: `npm run preview -- --host 127.0.0.1 --port ${testPort} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
