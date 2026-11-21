// INSPECTION: 2026-11-20 (from qa/01-specifications/module-auth/submodule-session/00-inventory.md)
// Guard at the end of every protected page: if (!localStorage.getItem("isLoggedIn")) location.href = "index.php".
// Protected: /shop.php, /mens-wear.php, /womens-wear.php, /kids-wear.php, /electronics.php, /cart.php.
// Logout: header-logout-btn removes isLoggedIn and goes to /index.php (JS only, no /logout.php).
// Session tests start from the lane storageState (isLoggedIn = "true"); "no session" tests use NO_SESSION.

import { test, expect } from '@playwright/test';
import { expectOpenDefect } from '../../fixtures/defects';
import {
  NO_SESSION, badge, expectRedirectToLogin, observeRedirect, readStorage, seedStorage,
} from '../../fixtures/shop-helpers';
import { logout } from '../../page-objects/LoginPage';

const PROTECTED = ['/mens-wear.php', '/womens-wear.php', '/kids-wear.php', '/electronics.php', '/cart.php'];

test.describe('AUTH - Sesión y control de acceso (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-AUTH-SES-001] Acceso a la tienda sin sesión redirige al login @P0', async ({ page }) => {
    await page.goto('/shop.php');
    await expectRedirectToLogin(page);
    await expect(page.getByTestId('login-email-input')).toBeVisible();
  });

  test('[TC-AUTH-SES-002] Acceso a categorías y carrito sin sesión redirige al login (parametrizado) @P0', async ({ page }) => {
    for (const path of PROTECTED) {
      await test.step(`Ruta ${path}`, async () => {
        await page.goto(path);
        await expectRedirectToLogin(page);
      });
    }
  });

  test('[TC-AUTH-SES-010] Un indicador de sesión no emitido por el login no concede acceso @P1', async ({ page }) => {
    // 1. actions and observations
    await seedStorage(page, { isLoggedIn: 'false' });
    expect(await readStorage(page, 'isLoggedIn')).toBe('false');
    await page.goto('/shop.php');
    const redirected = await observeRedirect(page, /\/index\.php$/);
    const finalPath = new URL(page.url()).pathname;
    const categoryCards = await page.getByTestId('category-card-men').count();

    // 2. pure assertions (spec RN-AUTH-015)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-001',
      'the session guard accepts any non-empty isLoggedIn value, including "false" (RN-AUTH-015)',
      () => {
        expect(redirected, 'redirect to /index.php').toBe(true);
        expect(finalPath).toBe('/index.php');
        expect(categoryCards).toBe(0);
      }
    );
  });

  test('[TC-AUTH-SES-011] El servidor no entrega contenido protegido sin sesión @P1', async ({ playwright, browser, baseURL }) => {
    test.info().annotations.push({
      type: 'manual-part',
      description: 'Paso 3 (JavaScript deshabilitado) automatizado con un contexto javaScriptEnabled:false.',
    });
    // 1. actions and observations: raw HTTP without any client state
    const api = await playwright.request.newContext({ baseURL });
    const response = await api.get('/shop.php', { maxRedirects: 0 });
    const status = response.status();
    const body = await response.text();
    await api.dispose();
    const deniedOrRedirected = [301, 302, 303, 307, 308, 401, 403].includes(status);
    const bodyHasProtectedContent =
      body.includes('data-testid="category-card-men"') || body.includes('data-testid="header-logout-btn"');

    // Step 3: same page with JavaScript disabled (the client-side guard cannot run).
    const noJs = await browser.newContext({ baseURL, javaScriptEnabled: false, storageState: NO_SESSION });
    const noJsPage = await noJs.newPage();
    await noJsPage.goto('/shop.php');
    const noJsCardsVisible = await noJsPage.getByTestId('category-card-men').isVisible();
    const noJsLogoutVisible = await noJsPage.getByTestId('header-logout-btn').isVisible();
    await noJs.close();

    // 2. pure assertions (spec RN-AUTH-015)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-002',
      'protected pages are served with full content (HTTP 200) to clients without a session (RN-AUTH-015)',
      () => {
        expect(
          deniedOrRedirected || !bodyHasProtectedContent,
          `server must redirect/deny or omit protected content (status ${status})`
        ).toBe(true);
        expect(noJsCardsVisible, 'category cards visible without JS').toBe(false);
        expect(noJsLogoutVisible, 'logout button visible without JS').toBe(false);
      }
    );
  });
});

test.describe('AUTH - Sesión y control de acceso (con sesión)', () => {
  test('[TC-AUTH-SES-003] Tras el login el encabezado muestra logout y carrito @P1', async ({ page }) => {
    await page.goto('/shop.php');
    const logoutBtn = page.getByTestId('header-logout-btn');
    await expect(logoutBtn).toBeVisible();
    await expect(logoutBtn).toHaveAttribute('title', 'Logout');
    await expect(page.getByTestId('header-cart-link')).toBeVisible();
    await expect(badge(page)).toHaveText('0');
  });

  test('[TC-AUTH-SES-004] Logout cierra la sesión y redirige al login @P0', async ({ page }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await expect(page.getByTestId('header-logout-btn')).toBeHidden();
  });

  test('[TC-AUTH-SES-005] Tras el logout las páginas protegidas redirigen al login @P0', async ({ page }) => {
    await page.goto('/shop.php');
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await page.goto('/cart.php');
    await expectRedirectToLogin(page);
    await page.goto('/shop.php');
    await expectRedirectToLogin(page);
  });

  test('[TC-AUTH-SES-006] El botón "Atrás" tras el logout no restaura el acceso @P1', async ({ page }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await page.goBack();
    await expectRedirectToLogin(page);
    await expect(page.getByTestId('category-card-men')).toHaveCount(0);
  });

  test('[TC-AUTH-SES-007] La sesión se comparte entre pestañas del mismo contexto @P2', async ({ page, context }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    const tabB = await context.newPage();
    await tabB.goto('/electronics.php');
    await expect(tabB.getByTestId('results-count')).toHaveText('25 products');
    await expect(tabB).toHaveURL(/\/electronics\.php$/);
  });

  test('[TC-AUTH-SES-008] Un contexto de navegador nuevo no hereda la sesión @P2', async ({ page, browser, baseURL }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    const context2 = await browser.newContext({ baseURL, storageState: NO_SESSION });
    const page2 = await context2.newPage();
    await page2.goto('/shop.php');
    await expectRedirectToLogin(page2);
    expect(await readStorage(page2, 'isLoggedIn')).toBeNull();
    await context2.close();
  });

  test('[TC-AUTH-SES-009] La pérdida de isLoggedIn durante la sesión obliga a reautenticarse @P2', async ({ page }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('isLoggedIn'));
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await page.goto('/kids-wear.php');
    await expectRedirectToLogin(page);
  });
});
