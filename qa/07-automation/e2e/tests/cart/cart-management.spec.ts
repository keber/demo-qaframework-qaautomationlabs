// INSPECTION: 2026-11-20 (from qa/01-specifications/module-cart/submodule-cart-management/00-inventory.md)
// cart.php renders localStorage.cart client-side: cart-table, cart-row-{id}, cart-item-name/price/total-{id},
// cart-qty-{id} (number, min=1, recalculates on 'change'), cart-remove-{id}, cart-total ("Total: $N"),
// proceed-to-checkout-btn (d-none when empty), cart-empty-message, start-shopping-btn, go-back-btn.
// Reference prices: 1 Women Black T-Shirt $100, 21 Men Black T-Shirt $150, 22 White T-Shirt $500, 61 $150.
// TC-CART-GEST-018 (two logged-in contexts, re-login) lives in cart-management.login.spec.ts.

import { test, expect } from '@playwright/test';
import { expectOpenDefect } from '../../fixtures/defects';
import {
  BASE_CART, NO_SESSION, badge, expectRedirectToLogin, norm, openCategory, readCart, seedStorage,
} from '../../fixtures/shop-helpers';

async function openCart(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/cart.php');
  await expect(page.getByTestId('cart-table')).toBeVisible();
}

async function setQty(page: import('@playwright/test').Page, id: number, value: string): Promise<void> {
  const input = page.getByTestId(`cart-qty-${id}`);
  await input.fill(value);
  await input.press('Tab');
}

test.describe('CART - Gestión del carrito (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-CART-GEST-017] Visitante sin sesión es redirigido al login @P1', async ({ page }) => {
    await page.goto('/cart.php');
    await expectRedirectToLogin(page);
  });
});

test.describe('CART - Gestión del carrito', () => {
  test('[TC-CART-GEST-001] Agregar un producto nuevo al carrito desde una página de categoría @P0', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await expect(badge(page)).toHaveText('0');
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss().catch(() => {});
    });
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    expect(dialogs).toEqual([]);
    expect(await readCart(page)).toEqual([{ id: 21, qty: 1 }]);
  });

  test('[TC-CART-GEST-002] Agregar un producto que ya está en el carrito incrementa su cantidad @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    await page.getByTestId('add-to-cart-21').click();
    await expect.poll(() => readCart(page)).toEqual([{ id: 21, qty: 2 }]);
    await expect(badge(page)).toHaveText('1');
    await openCart(page);
    await expect(page.locator('[data-testid^="cart-row-"]')).toHaveCount(1);
    await expect(page.getByTestId('cart-qty-21')).toHaveValue('2');
    await expect(page.getByTestId('cart-item-total-21')).toHaveText('$300');
  });

  test('[TC-CART-GEST-003] Agregar un producto desde la página de detalle @P2', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/product.php?id=1');
    await page.getByTestId('add-to-cart-1').click();
    await expect(badge(page)).toHaveText('1');
    await openCart(page);
    await expect(page.getByTestId('cart-item-price-1')).toHaveText('$100');
    await expect(page.getByTestId('cart-qty-1')).toHaveValue('1');
  });

  test('[TC-CART-GEST-004] Productos de distintas categorías se acumulan en el mismo carrito @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('add-to-cart-21').click();
    await expect(badge(page)).toHaveText('1');
    await page.getByTestId('add-to-cart-21').click();
    await expect.poll(() => readCart(page)).toEqual([{ id: 21, qty: 2 }]);
    await page.getByTestId('add-to-cart-22').click();
    await expect(badge(page)).toHaveText('2');
    await openCategory(page, '/electronics.php', 25);
    await page.getByTestId('add-to-cart-61').click();
    await expect(badge(page)).toHaveText('3');
    await page.goto('/product.php?id=1');
    await page.getByTestId('add-to-cart-1').click();
    await expect(badge(page)).toHaveText('4');
    await openCart(page);
    const rows = await page
      .locator('[data-testid^="cart-row-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
    expect(rows).toEqual(['cart-row-21', 'cart-row-22', 'cart-row-61', 'cart-row-1']);
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$1050/);
  });

  test('[TC-CART-GEST-005] La tabla del carrito muestra columnas, precio y subtotal por línea @P0', async ({ page }) => {
    await seedStorage(page, { cart: BASE_CART });
    await openCart(page);
    await expect(page).toHaveTitle(/Cart/);
    await expect(page.getByTestId('breadcrumb-current')).toHaveText('Cart');
    const headers = (await page.getByTestId('cart-table').locator('th').allInnerTexts()).map(norm);
    expect(headers).toEqual(['Products', 'Price', 'Quantity', 'Total', 'Remove']);
    await expect(page.getByTestId('cart-item-name-21')).toHaveText(/Black T-Shirt/);
    await expect(page.getByTestId('cart-item-price-21')).toHaveText('$150');
    await expect(page.getByTestId('cart-qty-21')).toHaveValue('2');
    await expect(page.getByTestId('cart-item-total-21')).toHaveText('$300');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$500');
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$800/);
    await expect(page.getByTestId('proceed-to-checkout-btn')).toBeVisible();
  });

  test('[TC-CART-GEST-006] Actualizar la cantidad recalcula subtotal y total @P0', async ({ page }) => {
    await seedStorage(page, { cart: BASE_CART });
    await openCart(page);
    await setQty(page, 22, '3');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$1500');
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$1800/);
    await expect(badge(page)).toHaveText('2');
  });

  test('[TC-CART-GEST-007] La cantidad modificada persiste al recargar la página @P1', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 22, qty: 1 }] });
    await openCart(page);
    await setQty(page, 22, '2');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$1000');
    await page.reload();
    await expect(page.getByTestId('cart-qty-22')).toHaveValue('2');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$1000');
  });

  test('[TC-CART-GEST-008] Una cantidad negativa se normaliza a 1 @P2', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 22, qty: 2 }] });
    await openCart(page);
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss().catch(() => {});
    });
    await setQty(page, 22, '-2');
    await expect(page.getByTestId('cart-qty-22')).toHaveValue('1');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$500');
    expect(dialogs).toEqual([]);
  });

  test('[TC-CART-GEST-009] Una cantidad 0 no debe aceptarse @P1', async ({ page }) => {
    // 1. actions and observations
    await seedStorage(page, { cart: BASE_CART });
    await openCart(page);
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$800/);
    await setQty(page, 22, '0');
    // The 'change' handler re-renders synchronously within the Tab key press.
    const qty = await page.getByTestId('cart-qty-22').inputValue();
    const lineTotal = norm(await page.getByTestId('cart-item-total-22').innerText());
    const total = norm(await page.getByTestId('cart-total').innerText());

    // 2. pure assertions (spec RN-CART-005)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-003',
      'quantity 0 is accepted in the cart (line total $0) instead of being corrected to 1 (RN-CART-005)',
      () => {
        expect(qty).toBe('1');
        expect(lineTotal).toBe('$500');
        expect(total).toMatch(/Total:\s*\$800/);
      }
    );
  });

  test('[TC-CART-GEST-010] Cantidad vacía o decimal se normaliza a 1 @P2', async ({ page }) => {
    for (const value of ['', '1.5']) {
      await test.step(`Cantidad "${value}"`, async () => {
        await seedStorage(page, { cart: [{ id: 22, qty: 3 }] });
        await openCart(page);
        await setQty(page, 22, value);
        await expect(page.getByTestId('cart-qty-22')).toHaveValue('1');
        await expect(page.getByTestId('cart-item-total-22')).toHaveText('$500');
      });
    }
  });

  test('[TC-CART-GEST-011] Se acepta una cantidad alta sin límite máximo @P3', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 22, qty: 1 }] });
    await openCart(page);
    await setQty(page, 22, '999');
    await expect(page.getByTestId('cart-item-total-22')).toHaveText('$499500');
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$499500/);
  });

  test('[TC-CART-GEST-012] Eliminar un producto actualiza tabla, total y contador @P0', async ({ page }) => {
    await seedStorage(page, {
      cart: [{ id: 21, qty: 2 }, { id: 22, qty: 2 }, { id: 61, qty: 1 }, { id: 1, qty: 1 }],
    });
    await openCart(page);
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$1550/);
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss().catch(() => {});
    });
    await page.getByTestId('cart-remove-1').click();
    await expect(page.getByTestId('cart-row-1')).toHaveCount(0);
    expect(dialogs).toEqual([]);
    await expect(page.locator('[data-testid^="cart-row-"]')).toHaveCount(3);
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$1450/);
    await expect(badge(page)).toHaveText('3');
  });

  test('[TC-CART-GEST-013] Eliminar el último producto muestra el estado de carrito vacío @P1', async ({ page }) => {
    await seedStorage(page, { cart: [{ id: 21, qty: 1 }] });
    await openCart(page);
    await expect(page.getByTestId('proceed-to-checkout-btn')).toBeVisible();
    await page.getByTestId('cart-remove-21').click();
    await expect(page.getByTestId('cart-empty-message')).toHaveText('Your Cart is Empty');
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$0/);
    await expect(badge(page)).toHaveText('0');
    await expect(page.getByTestId('proceed-to-checkout-btn')).toBeHidden();
  });

  test('[TC-CART-GEST-014] Carrito vacío al cargar la página @P1', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/cart.php');
    await expect(page.getByTestId('cart-empty-message')).toHaveText('Your Cart is Empty');
    await expect(page.getByTestId('start-shopping-btn')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$0/);
    await expect(badge(page)).toHaveText('0');
    await expect(page.getByTestId('proceed-to-checkout-btn')).toBeHidden();
  });

  test('[TC-CART-GEST-015] Navegación de retorno a la tienda desde el carrito @P2', async ({ page }) => {
    await seedStorage(page, { cart: null });
    await page.goto('/cart.php');
    await page.getByTestId('start-shopping-btn').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
    await page.goto('/cart.php');
    await page.getByTestId('go-back-btn').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
  });

  test('[TC-CART-GEST-016] "Proceed To Checkout" lleva al checkout con el carrito actual @P0', async ({ page }) => {
    await seedStorage(page, { cart: BASE_CART });
    await openCart(page);
    await page.getByTestId('proceed-to-checkout-btn').click();
    await expect(page).toHaveURL(/\/checkout\.php$/);
    await expect(page.getByTestId('order-total')).toHaveText('$800');
    await expect(page.getByTestId('checkout-item-qty-21')).toHaveText('2');
    await expect(page.getByTestId('checkout-item-total-21')).toHaveText('$300');
    await expect(page.getByTestId('checkout-item-qty-22')).toHaveText('1');
    await expect(page.getByTestId('checkout-item-total-22')).toHaveText('$500');
  });
});
