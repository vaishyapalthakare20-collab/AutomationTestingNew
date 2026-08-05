import { test } from '@playwright/test';
import BasePage from './BasePage.js';
import { ROUTES } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * LoginPage - Page Object for the SauceDemo login screen.
 *
 * Demonstrates a MIX of locator strategies (as used in real projects):
 *  - Built-in Playwright locators (getByPlaceholder / getByRole) — preferred
 *  - CSS locators
 *  - XPath — for cases where CSS is awkward or to teach XPath
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Locators (kept in the Page Object, never in test files)
    // Built-in locator (recommended modern approach)
    this.usernameInput = page.getByPlaceholder('Username');
    // CSS locator
    this.passwordInput = page.locator('#password');
    // Built-in role locator
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // CSS attribute locator
    this.errorMessage = page.locator('[data-test="error"]');
    // XPath locator (demonstrates XPath usage)
    this.errorButton = page.locator("//button[@class='error-button']");
    // XPath locator for the logo
    this.loginLogo = page.locator("//div[@class='login_logo']");
  }

  /** Open the login page. */
  async open() {
    await this.goto(ROUTES.LOGIN);
  }

  /**
   * Perform a login with the given credentials.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await test.step(`Login as "${username}"`, async () => {
      logger.info(`Attempting login with username: ${username}`);
      await this.fill(this.usernameInput, username);
      await this.fill(this.passwordInput, password);
      await this.click(this.loginButton);
    });
  }

  /**
   * @author John Doe
   * Get the displayed error message text.
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return this.getText(this.errorMessage);
  }

  /**
   * Whether an error message is shown.
   * @returns {Promise<boolean>}
   */
  async hasError() {
    return this.isVisible(this.errorMessage);
  }

  /**
   * Dismiss the displayed error message by clicking the error (X) button.
   */
  async dismissError() {
    logger.info('Dismissing login error message');
    await this.click(this.errorButton);
  }
}

export default LoginPage;
