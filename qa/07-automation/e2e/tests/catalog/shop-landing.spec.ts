// INSPECTION: 2026-11-20 (from qa/01-specifications/module-catalog/submodule-shop-landing/00-inventory.md)
// shop.php: breadcrumb (Home "#" / Shop), category-card-{men|women|kids|electronics},
// category-title-*, shop-now-{mens-wear|womens-wear|kids-wear|electronics}.
// Header: header-logo-link -> shop.php, nav-shop (active, hidden < 1350 px), header-cart-link,
// header-cart-count, header-logout-btn, header-search (GET form to https://qaautomationlabs.com/).
// Known harmless JS error: $(...).owlCarousel is not a function (H-CAT-02).

import { test, expect } from '@playwright/test';
import { NO_SESSION, badge, expectRedirectToLogin, norm, seedStorage } from '../../fixtures/shop-helpers';
import { logout } from '../../page-objects/LoginPage';

test.describe('CAT - Inicio de tienda y navegación (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-CAT-SHOP-001] Usuario sin sesión es redirigido al login al abrir shop.php @P0', async ({ page }) => {
    await page.goto('/shop.php');
    await expectRedirectToLogin(page);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });
});

test.describe('CAT - Inicio de tienda y navegación', () => {
  test('[TC-CAT-SHOP-002] Usuario con sesión ve las 4 tarjetas de categoría @P0', async ({ page }) => {
    await page.goto('/shop.php');
    await expect(page.getByTestId('header-logout-btn')).toBeVisible();
    const keys = ['men', 'women', 'kids', 'electronics'];
    const titles = ['Men Fashion', 'Women Fashion', 'Kids Fashion', 'Electronics'];
    for (let i = 0; i < keys.length; i++) {
      await expect(page.getByTestId(`category-title-${keys[i]}`)).toHaveText(titles[i]);
    }
    const cards = page.locator('[data-testid^="category-card-"]');
    await expect(cards).toHaveCount(4);
    const order = await cards.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
    expect(order).toEqual(keys.map((k) => `category-card-${k}`));
    for (const slug of ['mens-wear', 'womens-wear', 'kids-wear', 'electronics']) {
      const btn = page.getByTestId(`shop-now-${slug}`);
      await expect(btn).toBeVisible();
      await expect(btn).toHaveText(/Shop Now/i);
    }
  });

  test('[TC-CAT-SHOP-003] "Shop Now" de cada categoría navega a su página @P1', async ({ page }) => {
    const cases = [
      ['mens-wear', 'Mens Wear'],
      ['womens-wear', 'Womens Wear'],
      ['kids-wear', 'Kids Wear'],
      ['electronics', 'Electronics'],
    ];
    for (const [slug, crumb] of cases) {
      await test.step(`Shop Now ${slug}`, async () => {
        await page.goto('/shop.php');
        await page.getByTestId(`shop-now-${slug}`).click();
        await expect(page).toHaveURL(new RegExp(`/${slug}\\.php$`));
        await expect(page.getByTestId('breadcrumb-current')).toHaveText(crumb);
      });
    }
  });

  test('[TC-CAT-SHOP-004] El logo de la cabecera vuelve a shop.php desde una categoría @P1', async ({ page }) => {
    await page.goto('/mens-wear.php');
    await expect(page.getByTestId('results-count')).toHaveText('20 products');
    await page.getByTestId('header-logo-link').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
    await expect(page.locator('[data-testid^="category-card-"]')).toHaveCount(4);
  });

  test('[TC-CAT-SHOP-005] El enlace "Shop" de la navegación vuelve a shop.php y está activo @P2', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/kids-wear.php');
    await expect(page.getByTestId('results-count')).toHaveText('20 products');
    const navShop = page.getByTestId('nav-shop');
    await expect(navShop).toBeVisible();
    await expect(navShop).toHaveClass(/\bactive\b/);
    await navShop.click();
    await expect(page).toHaveURL(/\/shop\.php$/);
  });

  test('[TC-CAT-SHOP-006] Breadcrumb de shop.php muestra "Home" y "Shop" @P2', async ({ page }) => {
    await page.goto('/shop.php');
    const crumb = norm(await page.getByTestId('breadcrumb').innerText());
    expect(crumb).toContain('Home');
    expect(crumb).toContain('Shop');
    await page.getByTestId('breadcrumb-home').click();
    await expect(page).toHaveURL(/\/shop\.php#?$/);
  });

  test('[TC-CAT-SHOP-007] El badge del carrito es visible en shop.php y refleja el carrito vacío @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/shop.php');
    await expect(badge(page)).toBeVisible();
    await expect(badge(page)).toHaveText('0');
  });

  test('[TC-CAT-SHOP-008] El enlace del carrito en la cabecera navega a cart.php @P1', async ({ page }) => {
    await page.goto('/shop.php');
    await page.getByTestId('header-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.php$/);
  });

  test('[TC-CAT-SHOP-009] Logout desde el catálogo impide volver a la categoría @P1', async ({ page }) => {
    await page.goto('/mens-wear.php');
    await expect(page.getByTestId('results-count')).toHaveText('20 products');
    await logout(page);
    await page.goto('/mens-wear.php');
    await expectRedirectToLogin(page);
  });

  test('[TC-CAT-SHOP-010] La búsqueda de la cabecera apunta al sitio externo y no filtra el catálogo @P3', async ({ page }) => {
    test.info().annotations.push({
      type: 'manual-part',
      description: 'El envío al sitio externo qaautomationlabs.com queda manual (sistema de terceros).',
    });
    await page.goto('/shop.php');
    const form = page.locator('form', { has: page.getByTestId('header-search') });
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute('action', 'https://qaautomationlabs.com/');
    expect((await form.getAttribute('method'))?.toLowerCase()).toBe('get');
    await expect(page.getByTestId('search-input')).toHaveCount(0);
  });
});
