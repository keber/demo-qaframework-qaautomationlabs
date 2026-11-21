// Runs ONLY in the opt-in "login-flow" project (no trace / video / screenshot): the TC
// logs in two browser contexts with the real demo account and logs in again after a logout.

import { test, expect } from '@playwright/test';
import { LoginPage, logout } from '../../page-objects/LoginPage';
import { NO_SESSION, badge, demoCredentials, seedStorage } from '../../fixtures/shop-helpers';

test.describe('CART - Gestión del carrito (flujos con login real)', () => {
  test('[TC-CART-GEST-018] El carrito es propio del navegador y sobrevive al logout @P2', async ({ browser, baseURL }) => {
    const { email, password } = demoCredentials();
    const ctxA = await browser.newContext({ baseURL, storageState: NO_SESSION });
    const ctxB = await browser.newContext({ baseURL, storageState: NO_SESSION });
    try {
      const pageA = await ctxA.newPage();
      const pageB = await ctxB.newPage();
      const loginA = new LoginPage(pageA);
      const loginB = new LoginPage(pageB);

      await test.step('Iniciar sesión en A y B', async () => {
        await loginA.goto();
        await loginA.loginWithSecret(email, password);
        await loginB.goto();
        await loginB.loginWithSecret(email, password);
      });

      await test.step('A agrega el producto 23', async () => {
        await seedStorage(pageA, { cart: null });
        await pageA.goto('/product.php?id=23');
        await expect(badge(pageA)).toHaveText('0');
        await pageA.getByTestId('add-to-cart-23').click();
        await expect(badge(pageA)).toHaveText('1');
      });

      await test.step('B no ve el carrito de A', async () => {
        await pageB.goto('/cart.php');
        await expect(pageB.getByTestId('cart-empty-message')).toHaveText('Your Cart is Empty');
        await expect(badge(pageB)).toHaveText('0');
      });

      await test.step('A conserva su carrito tras logout y nuevo login', async () => {
        await logout(pageA);
        await loginA.loginWithSecret(email, password);
        await pageA.goto('/cart.php');
        await expect(pageA.getByTestId('cart-row-23')).toBeVisible();
      });
    } finally {
      await ctxA.close();
      await ctxB.close();
    }
  });
});
