import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import CheckoutCompletePage from '../pages/CheckoutCompletePage.js';
import * as dataGenerator from '../utils/dataGenerator.js';
import env from '../config/env.config.js';
import logger from '../utils/logger.js';

/**
 * @typedef {import('../pages/LoginPage.js').default} LoginPageType
 * @typedef {import('../pages/InventoryPage.js').default} InventoryPageType
 * @typedef {import('../pages/CartPage.js').default} CartPageType
 * @typedef {import('../pages/CheckoutPage.js').default} CheckoutPageType
 * @typedef {import('../pages/CheckoutCompletePage.js').default} CheckoutCompletePageType
 */

/**
 * @typedef {object} FrameworkFixtures
 * @property {LoginPageType} loginPage
 * @property {InventoryPageType} inventoryPage
 * @property {CartPageType} cartPage
 * @property {CheckoutPageType} checkoutPage
 * @property {CheckoutCompletePageType} checkoutCompletePage
 * @property {import('@playwright/test').Page} loggedInPage
 * @property {typeof import('../utils/dataGenerator.js')} data
 */

/**
 * Custom Playwright fixtures (dependency injection layer).
 *
 * Provides:
 *  - Page Objects ready to use in every test (loginPage, inventoryPage, ...)
 *  - loggedInPage: a page already authenticated as standard_user,
 *    so tests that need an authenticated session don't repeat login steps.
 *  - data: the data generator (fake customer/user data) for data-driven tests.
 */
/** @type {import('@playwright/test').TestType<FrameworkFixtures>} */
const test = base.extend({
  // Page Object fixtures
  // Pattern: new SomePage(page) builds a real page object from the class
  // (blueprint) and gives it the browser tab (page) to control.
  // use(...) then hands that ready object to the test, so tests never
  // need to write "new LoginPage(page)" themselves.
  //
  // What is "use"?
  //   - "use" is a special function Playwright gives every fixture.
  //   - use(x) means: "object x is ready -> pause the fixture here,
  //     run the test with x, then come back for cleanup."
  //   - Code BEFORE use() = setup (runs first).
  //   - The test body runs AT the use() line.
  //   - Code AFTER use() = cleanup (runs after the test finishes).
  //   - We "await" it so the fixture WAITS for the test to finish
  //     before running any cleanup. (return can't do this; use can.)
  loginPage: async ({ page }, use) => {
    // Build a LoginPage object with the browser tab, then hand it to the test.
    // The test receives this exact object as { loginPage }.
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    // Build an InventoryPage object and hand it to the test
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    // Build a CartPage object and hand it to the test
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    // Build a CheckoutPage object and hand it to the test
    await use(new CheckoutPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    // Build a CheckoutCompletePage object and hand it to the test
    await use(new CheckoutCompletePage(page));
  },

  /**
   * Auto-login fixture.
   * Logs in as the standard user and lands on the inventory page.
   * Use this in tests that require an authenticated state.
   */
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(env.users.standard, env.password);
    await page.waitForURL(/inventory/);
    await use(page);
  },

  /**
   * Test data fixture.
   * Exposes the data generator so tests can create fresh fake data.
   */
  data: async ({ }, use) => {
    await use(dataGenerator);
  },
});

/**
 * Global afterEach hook.
 * On failure, capture a full-page screenshot and:
 *   1. Save it to reports/failed-screenshots/ as a real .png file
 *   2. Attach it to the report (Allure / HTML) so debugging a failed
 *      run doesn't require re-running it.
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    logger.warn(`Test failed: "${testInfo.title}" — capturing screenshot`);
    try {
      const screenshot = await page.screenshot({ fullPage: true });

      // 1) Save to the dedicated failed-screenshots folder
      const screenshotDir = path.resolve('reports/failed-screenshots');
      fs.mkdirSync(screenshotDir, { recursive: true });
      const safeTitle = testInfo.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 80);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(screenshotDir, `${safeTitle}_${timestamp}.png`);
      fs.writeFileSync(filePath, screenshot);
      logger.info(`Failure screenshot saved: ${filePath}`);

      // 2) Attach to the report
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    } catch (error) {
      logger.error(`Could not capture failure screenshot: ${error.message}`);
    }
  }
});

export { test, expect };
