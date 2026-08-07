import { test, expect } from '../../fixtures/baseFixture.js';
import { ROUTES } from '../../utils/constants.js';
import env from '../../config/env.config.js';

/**
 * Logout Scenario
 * ------------------------------------------------------------------
 * Verifies a logged-in user can log out and is returned to the login page.
 */
test.describe('Login - Logout @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC_LOGIN_LOGOUT: user can log out successfully', async ({loginPage,inventoryPage,}) => {
    await loginPage.login(env.users.standard, env.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    expect(inventoryPage.getUrl()).toContain(ROUTES.LOGIN);

    console.log('User logged out successfully and returned to the login page.');
  });
});
