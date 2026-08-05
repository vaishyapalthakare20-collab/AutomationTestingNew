// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import env from './config/env.config.js';

/**
 * Playwright Configuration - Hybrid Data-Driven Framework
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Root directory that contains all test spec files
  testDir: './tests',

  // Global setup writes Allure environment info before the run
  globalSetup: './global-setup.js',

  // Maximum time (ms) one test can run
  timeout: env.timeouts.test,

  // Assertion timeout
  expect: {
    timeout: env.timeouts.expect,
  },

  // Run tests inside every file in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel workers on CI for stability
  workers: process.env.CI ? 2 : undefined,

  // Reporters: list (console) + HTML + Allure
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/json-report/results.json' }],
    ['junit', { outputFile: 'reports/junit-report/results.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  // Shared settings for all projects
  use: {
    // Base URL so we can use page.goto('/')
    baseURL: env.baseURL,

    // Collect trace, screenshot and video only on failure
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Global action / navigation timeouts
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,

    // Run headless unless HEADLESS=false
    headless: env.headless,

    // Viewport
    viewport: { width: 1366, height: 768 },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Cross-browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Folder for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results',
});
