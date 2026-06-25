import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * Two test surfaces share this one config:
 *  - "api"        -> contract/schema tests against JSONPlaceholder (no browser)
 *  - "e2e-*"       -> UI tests against Hacker News, one project per engine
 *
 * `npx playwright test` with no flags runs all of them.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: env.isCi,
  // The E2E project hits a real, unmocked, rate-limited site (Hacker News throttles
  // aggressively under concurrent load), so retries and capped workers are not just
  // a CI nicety: they're required for the suite to be reliably green anywhere.
  retries: env.isCi ? 2 : 1,
  workers: env.isCi ? 2 : 4,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ...(env.isCi ? ([['github']] as const) : []),
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.jsonPlaceholderBaseUrl,
      },
    },
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.hackerNewsBaseUrl,
      },
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: env.hackerNewsBaseUrl,
      },
    },
    {
      name: 'e2e-webkit',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Safari'],
        baseURL: env.hackerNewsBaseUrl,
      },
    },
  ],
});
