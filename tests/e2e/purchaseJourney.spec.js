import { test, expect } from '../../fixtures/baseFixture.js';
import { TITLES, SORT_OPTIONS } from '../../utils/constants.js';
import env from '../../config/env.config.js';

/**
 * End-to-End Purchase Journey
 * ------------------------------------------------------------------
 * A single test that walks the COMPLETE user flow the way a real
 * customer would, touching every module:
 *   Login -> Browse/Sort -> Add to Cart -> Verify Cart
 *        -> Checkout Info -> Overview (totals) -> Finish -> Confirmation
 *
 * This is a true E2E: it starts from the login page (no auto-login
 * fixture) so the whole journey is validated as one continuous scenario.
 */
test.describe('E2E - Purchase Journey @e2e', () => {
  test('TC_E2E_01: user can log in, buy two products and complete checkout @smoke', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await test.step('1. Log in as the standard user', async () => {
      await loginPage.open();
      await loginPage.login(env.users.standard, env.password);
      expect(await inventoryPage.isLoaded()).toBeTruthy();
      await expect(inventoryPage.pageTitle).toHaveText(TITLES.PRODUCTS);
    });

    await test.step('2. Sort products low to high and add two items', async () => {
      await inventoryPage.sortBy(SORT_OPTIONS.PRICE_LOW_TO_HIGH);
      await inventoryPage.addMultipleProducts(products);
      expect(await inventoryPage.getCartCount()).toBe(products.length);
    });

    await test.step('3. Open the cart and verify the selected items', async () => {
      await inventoryPage.goToCart();
      await expect(cartPage.pageTitle).toHaveText(TITLES.YOUR_CART);
      expect(await cartPage.getItemCount()).toBe(products.length);
      const names = await cartPage.getCartItemNames();
      for (const product of products) {
        expect(names).toContain(product);
      }
    });

    await test.step('4. Proceed to checkout and fill customer information', async () => {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.pageTitle).toHaveText(TITLES.CHECKOUT_INFO);
      await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
      await checkoutPage.continue();
    });

    await test.step('5. Verify order summary math (subtotal + tax = total)', async () => {
      await expect(checkoutPage.pageTitle).toHaveText(TITLES.CHECKOUT_OVERVIEW);
      const subtotal = await checkoutPage.getSubtotal();
      const tax = await checkoutPage.getTax();
      const total = await checkoutPage.getTotal();
      expect(Number((subtotal + tax).toFixed(2))).toBe(total);
    });

    await test.step('6. Finish the order and verify confirmation', async () => {
      await checkoutPage.finish();
      await expect(checkoutCompletePage.pageTitle).toHaveText(TITLES.CHECKOUT_COMPLETE);
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });

    await test.step('7. Return home and confirm the cart is empty', async () => {
      await checkoutCompletePage.backHome();
      expect(await inventoryPage.isLoaded()).toBeTruthy();
      expect(await inventoryPage.getCartCount()).toBe(0);
    });
  });

  test('TC_E2E_02: user can remove an item mid-journey and check out the rest', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Onesie'];

    await test.step('1. Log in and add three products', async () => {
      await loginPage.open();
      await loginPage.login(env.users.standard, env.password);
      await inventoryPage.addMultipleProducts(products);
      expect(await inventoryPage.getCartCount()).toBe(3);
    });

    await test.step('2. Open the cart and remove one item', async () => {
      await inventoryPage.goToCart();
      await cartPage.removeItem('Sauce Labs Onesie');
      expect(await cartPage.getItemCount()).toBe(2);
      const names = await cartPage.getCartItemNames();
      expect(names).not.toContain('Sauce Labs Onesie');
    });

    await test.step('3. Check out the remaining two items', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
      await checkoutPage.continue();
      await expect(checkoutPage.pageTitle).toHaveText(TITLES.CHECKOUT_OVERVIEW);
      await checkoutPage.finish();
    });

    await test.step('4. Verify the order is confirmed', async () => {
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });
  });

  test('TC_E2E_03: resetting app state mid-journey clears the cart before a fresh purchase', async ({ loginPage, inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage, }) => {
    await test.step('1. Log in and add two products', async () => {
      await loginPage.open();
      await loginPage.login(env.users.standard, env.password);
      await inventoryPage.addMultipleProducts(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
      expect(await inventoryPage.getCartCount()).toBe(2);
    });

    await test.step('2. Reset app state and confirm the cart is emptied', async () => {
      await inventoryPage.resetAppState();
      expect(await inventoryPage.getCartCount()).toBe(0);
    });

    await test.step('3. Add a different product and complete checkout', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
      expect(await inventoryPage.getCartCount()).toBe(1);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo('Jane', 'Doe', '54321');
      await checkoutPage.continue();
      await checkoutPage.finish();
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });
  });

  test('TC_E2E_04: user can complete two separate purchases in one session', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    await test.step('1. Log in', async () => {
      await loginPage.open();
      await loginPage.login(env.users.standard, env.password);
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });

    await test.step('2. First purchase — Sauce Labs Backpack', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
      await checkoutPage.continue();
      await checkoutPage.finish();
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
      await checkoutCompletePage.backHome();
      expect(await inventoryPage.getCartCount()).toBe(0);
    });

    await test.step('3. Second purchase — Sauce Labs Bike Light', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Bike Light');
      expect(await inventoryPage.getCartCount()).toBe(1);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo('Jane', 'Smith', '67890');
      await checkoutPage.continue();
      await checkoutPage.finish();
      expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
    });
  });
});
