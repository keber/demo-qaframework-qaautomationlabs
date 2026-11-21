// INSPECTION: 2026-11-20 (from qa/01-specifications/module-catalog/submodule-product-detail/00-inventory.md)
// product.php?id={id}: product-detail, product-detail-image, product-detail-name, product-detail-price,
// add-to-cart-{id}, breadcrumb ("Home Product Details"), go-back-btn -> shop.php.
// Unknown / invalid id: only "Product not found" (HTTP 200). HTML chars in id: HTTP 403 (WAF).
// Known harmless JS error: $(...).owlCarousel is not a function (H-CAT-02).

import { test, expect } from '@playwright/test';
import { NO_SESSION, badge, expectRedirectToLogin, norm, readCart, seedStorage } from '../../fixtures/shop-helpers';

test.describe('CAT - Detalle de producto (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-CAT-DETAIL-001] Usuario sin sesión es redirigido al login al abrir un detalle @P0', async ({ page }) => {
    await page.goto('/product.php?id=21');
    await expectRedirectToLogin(page);
    await expect(page.getByTestId('product-detail')).toBeHidden();
  });
});

test.describe('CAT - Detalle de producto', () => {
  test('[TC-CAT-DETAIL-002] El detalle muestra nombre, precio e imagen consistentes con el listado @P1', async ({ page }) => {
    await page.goto('/electronics.php');
    await expect(page.getByTestId('results-count')).toHaveText('25 products');
    const listName = (await page.getByTestId('product-name-70').innerText()).trim();
    const listPrice = (await page.getByTestId('product-price-70').innerText()).trim();
    const listSrc = (await page.getByTestId('product-image-70').getAttribute('src')) ?? '';
    expect(listName).toBe('LG UHD AI TV');
    expect(listPrice).toBe('$180');
    expect(listSrc).toContain('products/Electronics/e-10.jpg');

    await page.getByTestId('product-name-70').click();
    await expect(page).toHaveURL(/\/product\.php\?id=70$/);
    await expect(page.getByTestId('product-detail-name')).toHaveText(listName);
    await expect(page.getByTestId('product-detail-price')).toHaveText(listPrice);
    const detailImg = page.getByTestId('product-detail-image');
    await expect(detailImg).toHaveAttribute('src', listSrc);
    await expect
      .poll(() => detailImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
  });

  test('[TC-CAT-DETAIL-003] Breadcrumb del detalle muestra "Home" y "Product Details" @P2', async ({ page }) => {
    await page.goto('/product.php?id=23');
    await expect(page.getByTestId('product-detail-name')).toHaveText('Green Shirt');
    expect(norm(await page.getByTestId('breadcrumb').innerText())).toBe('Home Product Details');
  });

  test('[TC-CAT-DETAIL-004] "Go To Back" del detalle navega a shop.php @P1', async ({ page }) => {
    await page.goto('/product.php?id=70');
    await expect(page.getByTestId('product-detail-name')).toBeVisible();
    await page.getByTestId('go-back-btn').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
  });

  test('[TC-CAT-DETAIL-005] "Add to Cart" en el detalle actualiza el badge sin salir de la página @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/product.php?id=23');
    await expect(badge(page)).toHaveText('0');
    await page.getByTestId('add-to-cart-23').click();
    await expect(badge(page)).toHaveText('1');
    await expect(page).toHaveURL(/\/product\.php\?id=23$/);
    expect(await readCart(page)).toEqual(expect.arrayContaining([{ id: 23, qty: 1 }]));
  });

  test('[TC-CAT-DETAIL-006] Producto inexistente muestra "Product not found" @P1', async ({ page }) => {
    const response = await page.goto('/product.php?id=99999');
    expect(response?.status()).toBe(200);
    await expect(page.getByTestId('product-detail')).toContainText('Product not found');
    await expect(page.getByTestId('product-detail-name')).toHaveCount(0);
    await expect(page.getByTestId('product-detail-price')).toHaveCount(0);
    await expect(page.locator('[data-testid^="add-to-cart-"]')).toHaveCount(0);
  });

  test('[TC-CAT-DETAIL-007] id no numérico o ausente muestra "Product not found" @P2', async ({ page }) => {
    for (const path of ['/product.php?id=abc', '/product.php']) {
      await test.step(path, async () => {
        await page.goto(path);
        await expect(page.getByTestId('product-detail')).toContainText('Product not found');
      });
    }
  });

  test('[TC-CAT-DETAIL-008] id con caracteres HTML es rechazado sin renderizar contenido @P2', async ({ request, page }) => {
    const response = await request.get('/product.php?id=%3Cscript%3E');
    const status = response.status();
    const body = await response.text();
    let reflectedAsHtml = false;
    if (status < 400) {
      // Accepted by the server: the value must not appear as markup in the rendered detail.
      await page.goto('/product.php?id=%3Cscript%3E');
      reflectedAsHtml = (await page.getByTestId('product-detail').locator('script').count()) > 0;
    }
    expect(reflectedAsHtml, `parameter reflected as HTML (status ${status})`).toBe(false);
    expect(body.includes('id=<script>')).toBe(false);
  });
});
