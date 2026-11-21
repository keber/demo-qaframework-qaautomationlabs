// Runs ONLY in the opt-in "login-flow" project (no trace / video / screenshot): the TC
// logs in again with the real demo account after a logout.

import { test, expect } from '@playwright/test';
import { LoginPage, logout } from '../../page-objects/LoginPage';
import { badge, demoCredentials, readCart, readStorage, seedStorage } from '../../fixtures/shop-helpers';

test.describe('CAT - Badge del carrito (flujos con login real)', () => {
  test('[TC-CAT-BADGE-011] El carrito y el badge se conservan tras logout y nuevo login @P2', async ({ page }) => {
    const { email, password } = demoCredentials();
    const login = new LoginPage(page);
    await test.step('Iniciar sesión', async () => {
      await login.goto();
      await login.loginWithSecret(email, password);
    });
    await seedStorage(page, { cart: [{ id: 21, qty: 1 }, { id: 22, qty: 1 }] });
    await page.goto('/shop.php');
    await expect(badge(page)).toHaveText('2');
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    expect(await readCart(page)).toEqual([{ id: 21, qty: 1 }, { id: 22, qty: 1 }]);
    await test.step('Iniciar sesión otra vez', async () => {
      await login.loginWithSecret(email, password);
    });
    await expect(badge(page)).toHaveText('2');
  });
});
