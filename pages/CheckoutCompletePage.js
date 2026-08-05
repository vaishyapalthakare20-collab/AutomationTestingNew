import BasePage from './BasePage.js';
import { ROUTES } from '../utils/constants.js';

/**
 * CheckoutCompletePage - Page Object for the order confirmation page.
 */
class CheckoutCompletePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.pageTitle = page.locator('.title');
    // XPath locator for the confirmation header
    this.completeHeader = page.locator("//h2[@class='complete-header']");
    // CSS locator
    this.completeText = page.locator('.complete-text');
    // Built-in role locator
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    // XPath locator for the pony express image
    this.ponyExpressImage = page.locator("//img[@class='pony_express']");
  }

  /** Confirmation header text ("Thank you for your order!"). */
  async getHeaderText() {
    return this.getText(this.completeHeader);
  }

  /** Confirmation body text. */
  async getCompleteText() {
    return this.getText(this.completeText);
  }

  /** Click "Back Home" to return to inventory. */
  async backHome() {
    await this.click(this.backHomeButton);
  }

  /** Whether the confirmation page is displayed. */
  async isOrderComplete() {
    return (
      this.getUrl().includes(ROUTES.CHECKOUT_COMPLETE) &&
      (await this.isVisible(this.completeHeader))
    );
  }
}

export default CheckoutCompletePage;
