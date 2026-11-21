// INSPECTION: 2026-11-20 (from qa/01-specifications/module-catalog/submodule-cart-badge/00-inventory.md)
// header-cart-count shows cart.length (distinct lines, not units). add-to-cart-{id} on listings and
// product.php: adds { id, qty: 1 } or increments qty. No toast/alert, no network call.
// TC-CAT-BADGE-011 (logout + new login) lives in cart-badge.login.spec.ts (opt-in login-flow project).

import { test, expect } from '@playwright/test';
import { badge, expectResults, openCategory, readCart, seedStorage, toggleFilter } from '../../fixtures/shop-helpers';

test.describe('CAT - Badge del carrito y Add to Cart', () => {
  test('[TC-CAT-BADGE-001] Con carrito vacío el badge muestra 0 @P0', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/mens-wear.php');
    await expect(badge(page)).toBeVisible();
    await expect(badge(page)).toHaveText('0');
  });

  test('[TC-CAT-BADGE-002] Agregar un producto desde el listado incrementa el badge a 1 @P0', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await expect(badge(page)).toHaveText('0');
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    expect(await readCart(page)).toEqual([{ id: 21, qty: 1 }]);
  });

  test('[TC-CAT-BADGE-003] Agregar el mismo producto dos veces incrementa qty y no el badge @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    await page.getByTestId('add-to-cart-21').click();
    await expect.poll(() => readCart(page)).toEqual([{ id: 21, qty: 2 }]);
    await expect(badge(page)).toHaveText('1');
  });

  test('[TC-CAT-BADGE-004] Agregar productos distintos incrementa el badge por cada línea nueva @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    await page.getByTestId('add-to-cart-22').click();
    await expect(badge(page)).toHaveText('2');
    await openCategory(page, '/electronics.php', 25);
    await page.getByTestId('add-to-cart-61').click();
    await expect(badge(page)).toHaveText('3');
    expect(await readCart(page)).toEqual([
      { id: 21, qty: 1 },
      { id: 22, qty: 1 },
      { id: 61, qty: 1 },
    ]);
  });

  test('[TC-CAT-BADGE-005] El badge se mantiene al navegar entre páginas del catálogo @P1', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 21, qty: 1 }, { id: 22, qty: 1 }, { id: 61, qty: 1 }] });
    for (const path of ['/shop.php', '/kids-wear.php', '/product.php?id=23', '/cart.php']) {
      await test.step(`Badge en ${path}`, async () => {
        await page.goto(path);
        await expect(badge(page)).toHaveText('3');
      });
    }
  });

  test('[TC-CAT-BADGE-006] El badge se mantiene tras recargar la página @P1', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 21, qty: 1 }] });
    await page.goto('/shop.php');
    await expect(badge(page)).toHaveText('1');
    await page.reload();
    await expect(badge(page)).toHaveText('1');
  });

  test('[TC-CAT-BADGE-007] Agregar desde un listado filtrado agrega el producto correcto @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-type-footwear', true);
    await expectResults(page, 10);
    await expect(badge(page)).toHaveText('0');
    await page.getByTestId('add-to-cart-35').click();
    await expect(badge(page)).toHaveText('1');
    expect(await readCart(page)).toEqual([{ id: 35, qty: 1 }]);
    await toggleFilter(page, 'filter-type-footwear', false);
    await expectResults(page, 20);
    await expect(badge(page)).toHaveText('1');
  });

  test('[TC-CAT-BADGE-008] Al agregar no se muestra alerta ni cambia el texto del botón @P2', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss().catch(() => {});
    });
    const urlBefore = page.url();
    await page.getByTestId('add-to-cart-22').click();
    await expect(badge(page)).toHaveText('1');
    expect(dialogs).toEqual([]);
    expect(page.url()).toBe(urlBefore);
    await expect(page.getByTestId('add-to-cart-22')).toHaveText(/^\s*Add to Cart\s*$/);
  });

  test.describe('viewport móvil', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('[TC-CAT-BADGE-009] El badge es visible y correcto en viewport móvil @P2', async ({ page }) => {
      await seedStorage(page, { cart: [{ id: 1, qty: 1 }, { id: 2, qty: 3 }] });
      await openCategory(page, '/womens-wear.php', 20);
      await expect(badge(page)).toBeVisible();
      await expect(badge(page)).toHaveText('2');
    });
  });

  test('[TC-CAT-BADGE-010] Otra pestaña muestra el badge actualizado solo tras recargar @P2', async ({ page, context }) => {
    await seedStorage(page, { cart: [{ id: 21, qty: 1 }] });
    const tabA = page;
    await openCategory(tabA, '/mens-wear.php', 20);
    await expect(badge(tabA)).toHaveText('1');
    const tabB = await context.newPage();
    await openCategory(tabB, '/kids-wear.php', 20);
    await tabB.getByTestId('add-to-cart-41').click();
    await expect(badge(tabB)).toHaveText('2');
    await expect(badge(tabA)).toHaveText('1');
    await tabA.reload();
    await expect(badge(tabA)).toHaveText('2');
  });

  test('[TC-CAT-BADGE-012] Carrito corrupto en localStorage no impide usar el catálogo @P3', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await seedStorage(page, { cart: 'not-json' });
    await openCategory(page, '/womens-wear.php', 20);
    await expect(badge(page)).toHaveText('0');
    expect(errors.some((e) => /JSON|Unexpected token|not valid/i.test(e)), `console errors: ${errors.join(' | ')}`).toBe(true);
  });
});
