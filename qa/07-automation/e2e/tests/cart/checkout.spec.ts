// INSPECTION: 2026-11-20 (from qa/01-specifications/module-cart/submodule-checkout/00-inventory.md)
// checkout.php: checkout-form, checkout-{firstname|middlename|lastname|email|phone|address|state|city|pincode}-input,
//   checkout-*-error, order-total ("$800"), continue-btn, checkout-cart-row-{id}, go-back-btn -> cart.php.
// confirm.php: confirm-{field} (leading space, trim), order-total, place-order-btn -> thanks.php,
//   confirm-cart-row-{id}, go-back-btn -> checkout.php.
// thanks.php: order-success-title, order-success-message, shop-again-btn; clears cart and user.
// Validation messages: see REQUIRED_FIELDS in page-objects/CheckoutPage.ts.

import { test, expect } from '@playwright/test';
import { expectOpenDefect } from '../../fixtures/defects';
import { BASE_CART, NO_SESSION, badge, expectRedirectToLogin, norm, observeRedirect, readStorage, seedStorage } from '../../fixtures/shop-helpers';
import { CHECKOUT_FIELDS, CheckoutPage, REQUIRED_FIELDS, validCheckoutData } from '../../page-objects/CheckoutPage';

async function cellTexts(page: import('@playwright/test').Page, prefix: string, id: number): Promise<string[]> {
  const parts = ['name', 'price', 'qty', 'total'];
  const out: string[] = [];
  for (const part of parts) out.push(norm(await page.getByTestId(`${prefix}-item-${part}-${id}`).innerText()));
  return out;
}

test.describe('CART - Checkout y confirmación (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-CART-CHK-020] Las páginas del checkout redirigen al login sin sesión @P1', async ({ page }) => {
    for (const path of ['/checkout.php', '/confirm.php', '/thanks.php']) {
      await test.step(path, async () => {
        await page.goto(path);
        await expectRedirectToLogin(page);
      });
    }
  });
});

test.describe('CART - Checkout y confirmación', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkout = new CheckoutPage(page);
  });

  async function openWithBaseCart(page: import('@playwright/test').Page): Promise<void> {
    await seedStorage(page, { cart: BASE_CART });
    await checkout.goto();
    await expect(checkout.orderTotal).toHaveText('$800');
  }

  test('[TC-CART-CHK-001] El checkout muestra el resumen del carrito y el total @P0', async ({ page }) => {
    await openWithBaseCart(page);
    await expect(page).toHaveTitle(/Checkout/);
    await expect(page.getByTestId('breadcrumb-current')).toHaveText('Checkout');
    expect(await cellTexts(page, 'checkout', 21)).toEqual(['Black T-Shirt', '$150', '2', '$300']);
    expect(await cellTexts(page, 'checkout', 22)).toEqual(['White T-Shirt', '$500', '1', '$500']);
    for (const field of CHECKOUT_FIELDS) {
      await expect(checkout.input(field), `${field} empty`).toHaveValue('');
    }
  });

  test('[TC-CART-CHK-002] Enviar el formulario vacío muestra solo el error del primer campo @P1', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.continueBtn.click();
    await expect(checkout.error('firstname')).toHaveText('Please enter your first name.');
    expect(await checkout.visibleErrors()).toEqual(['firstname']);
    await expect(page).toHaveURL(/\/checkout\.php$/);
  });

  test('[TC-CART-CHK-003] Cada campo obligatorio vacío muestra su mensaje (parametrizado) @P0', async ({ page }) => {
    for (const { field, label, message } of REQUIRED_FIELDS) {
      await test.step(`Campo vacío: ${label}`, async () => {
        await openWithBaseCart(page);
        await checkout.fill({ ...validCheckoutData(), [field]: '' });
        await checkout.continueBtn.click();
        await expect(checkout.error(field)).toHaveText(message);
        expect(await checkout.visibleErrors()).toEqual([field]);
        await expect(page).toHaveURL(/\/checkout\.php$/);
      });
    }
  });

  test('[TC-CART-CHK-004] First Name con solo espacios se considera vacío @P2', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill(validCheckoutData());
    expect(await checkout.visibleErrors()).toEqual([]);
    await checkout.input('firstname').fill('   ');
    await checkout.continueBtn.click();
    await expect(checkout.error('firstname')).toHaveText('Please enter your first name.');
    await expect(page).toHaveURL(/\/checkout\.php$/);
  });

  test('[TC-CART-CHK-005] Los errores se ocultan al escribir en un campo @P3', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.continueBtn.click();
    await expect(checkout.error('firstname')).toBeVisible();
    await checkout.input('firstname').pressSequentially('Prueba');
    await expect(checkout.error('firstname')).toBeHidden();
    expect(await checkout.visibleErrors()).toEqual([]);
  });

  test('[TC-CART-CHK-006] Email con formato inválido muestra el mensaje propio @P1', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill({ ...validCheckoutData(), email: 'abc@x' });
    await checkout.continueBtn.click();
    await expect(checkout.error('email')).toHaveText('Please enter a valid email address.');
    await expect(page).toHaveURL(/\/checkout\.php$/);
  });

  test('[TC-CART-CHK-007] Email sin "@" o con espacios es bloqueado por la validación nativa @P2', async ({ page }) => {
    for (const value of ['abc', 'a b@x.com']) {
      await test.step(`Email "${value}"`, async () => {
        await openWithBaseCart(page);
        await checkout.fill({ ...validCheckoutData(), email: value });
        await checkout.continueBtn.click();
        await expect(page).toHaveURL(/\/checkout\.php$/);
        const valid = await checkout.input('email').evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(valid).toBe(false);
        await expect(checkout.error('email')).toBeHidden();
      });
    }
  });

  test('[TC-CART-CHK-008] Teléfono con longitud distinta de 10 es rechazado @P1', async ({ page }) => {
    for (const value of ['123456789', '12345678901']) {
      await test.step(`Teléfono "${value}"`, async () => {
        await openWithBaseCart(page);
        await checkout.fill({ ...validCheckoutData(), phone: value });
        await checkout.continueBtn.click();
        await expect(checkout.error('phone')).toHaveText('Phone Number Should be 10 digit long.');
        await expect(page).toHaveURL(/\/checkout\.php$/);
      });
    }
  });

  test('[TC-CART-CHK-009] El teléfono no admite letras @P3', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.input('phone').pressSequentially('abc');
    await expect(checkout.input('phone')).toHaveValue('');
  });

  test('[TC-CART-CHK-010] Pin Code 0 o negativo es bloqueado por la validación nativa @P2', async ({ page }) => {
    for (const value of ['0', '-5']) {
      await test.step(`Pin Code "${value}"`, async () => {
        await openWithBaseCart(page);
        await checkout.fill({ ...validCheckoutData(), pincode: value });
        await checkout.continueBtn.click();
        await expect(page).toHaveURL(/\/checkout\.php$/);
        const valid = await checkout.input('pincode').evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(valid).toBe(false);
      });
    }
  });

  test('[TC-CART-CHK-011] Middle Name es opcional @P2', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill({ ...validCheckoutData(), middlename: '' });
    await checkout.continueBtn.click();
    await expect(page).toHaveURL(/\/confirm\.php$/);
    expect(norm(await page.getByTestId('confirm-middlename').innerText())).toBe('');
  });

  test('[TC-CART-CHK-012] Checkout exitoso muestra la confirmación con los datos ingresados @P0', async ({ page }) => {
    const data = validCheckoutData();
    await openWithBaseCart(page);
    await checkout.fill(data);
    expect(await checkout.visibleErrors()).toEqual([]);
    await checkout.continueBtn.click();
    await expect(page).toHaveURL(/\/confirm\.php$/);
    await expect(page).toHaveTitle(/Order Confirmation/);
    await expect(page.getByTestId('breadcrumb-current')).toHaveText('Confirm Details');
    for (const field of CHECKOUT_FIELDS) {
      expect(norm(await page.getByTestId(`confirm-${field}`).innerText()), `confirm-${field}`).toBe(data[field]);
    }
    const user = JSON.parse((await readStorage(page, 'user')) ?? '{}');
    expect(Object.keys(user).sort()).toEqual(
      ['firstname', 'middlename', 'lastname', 'email', 'phone', 'address', 'states', 'city', 'pincode'].sort()
    );
  });

  test('[TC-CART-CHK-013] La confirmación muestra el mismo resumen y total que el carrito @P1', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill(validCheckoutData());
    await checkout.continueBtn.click();
    await expect(page).toHaveURL(/\/confirm\.php$/);
    await expect(page.getByTestId('order-total')).toHaveText('$800');
    expect(await cellTexts(page, 'confirm', 21)).toEqual(['Black T-Shirt', '$150', '2', '$300']);
    expect(await cellTexts(page, 'confirm', 22)).toEqual(['White T-Shirt', '$500', '1', '$500']);
  });

  test('[TC-CART-CHK-014] "Go To Back" desde la confirmación vuelve al checkout @P3', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill(validCheckoutData());
    await checkout.continueBtn.click();
    await expect(page).toHaveURL(/\/confirm\.php$/);
    await page.getByTestId('go-back-btn').click();
    await expect(page).toHaveURL(/\/checkout\.php$/);
    await expect(page.locator('[data-testid^="checkout-cart-row-"]')).toHaveCount(2);
    await expect(checkout.orderTotal).toHaveText('$800');
  });

  test('[TC-CART-CHK-015] "Go To Back" desde el checkout vuelve al carrito sin cambios @P3', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.goBack.click();
    await expect(page).toHaveURL(/\/cart\.php$/);
    await expect(page.locator('[data-testid^="cart-row-"]')).toHaveCount(2);
    await expect(page.getByTestId('cart-total')).toHaveText(/Total:\s*\$800/);
  });

  test('[TC-CART-CHK-016] No se puede completar una orden con el carrito vacío @P1', async ({ page }) => {
    // 1. actions and observations
    await seedStorage(page, { cart: null });
    await checkout.goto();
    await expect(badge(page)).toHaveText('0');
    await checkout.fill(validCheckoutData());
    await checkout.continueBtn.click();
    const reachedConfirm = await observeRedirect(page, /\/confirm\.php$/);
    let orderAnnounced = false;
    if (reachedConfirm) {
      await page.getByTestId('place-order-btn').click();
      await page.waitForLoadState('load');
      orderAnnounced = await page
        .getByTestId('order-success-message')
        .filter({ hasText: 'Your order has been placed successfully.' })
        .isVisible();
    }

    // 2. pure assertions (spec RN-CART-025)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-004',
      'an order can be completed with an empty cart (total $0, confirm.php and thanks.php reached) (RN-CART-025)',
      () => {
        expect(reachedConfirm, 'navigated to /confirm.php with an empty cart').toBe(false);
        expect(orderAnnounced, 'order announced as placed').toBe(false);
      }
    );
  });

  test('[TC-CART-CHK-017] confirm.php no es accesible sin un checkout completado @P2', async ({ page }) => {
    // 1. actions and observations
    await seedStorage(page, { user: null });
    await page.goto('/confirm.php');
    const redirected = await observeRedirect(page, /\/checkout\.php$/);
    const finalPath = new URL(page.url()).pathname;
    const bodyText = await page.locator('body').innerText();

    // 2. pure assertions (spec RN-CART-026)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-005',
      'confirm.php is reachable without a completed checkout and shows "undefined" and $0 (RN-CART-026)',
      () => {
        expect(redirected, 'redirect to /checkout.php').toBe(true);
        expect(finalPath).toBe('/checkout.php');
        expect(bodyText).not.toContain('undefined');
      }
    );
  });

  test('[TC-CART-CHK-018] thanks.php no anuncia una orden que no se realizó @P2', async ({ page }) => {
    // 1. actions and observations
    await seedStorage(page, { cart: null, user: null });
    await page.goto('/thanks.php');
    await page.waitForLoadState('load');
    const finalPath = new URL(page.url()).pathname;
    const announced = await page
      .getByTestId('order-success-message')
      .filter({ hasText: 'Your order has been placed successfully.' })
      .isVisible();

    // 2. pure assertions (spec RN-CART-026)
    await expectOpenDefect(
      'DEF-DEMO-FRAMEWORK-005',
      'thanks.php announces a successful order without a completed checkout (RN-CART-026)',
      () => {
        expect(finalPath, 'redirect to the previous step of the flow').not.toBe('/thanks.php');
        expect(announced, 'order announced as placed').toBe(false);
      }
    );
  });

  test('[TC-CART-CHK-019] Realizar la orden muestra el éxito y vacía el carrito @P0', async ({ page }) => {
    await openWithBaseCart(page);
    await checkout.fill(validCheckoutData());
    await checkout.continueBtn.click();
    await expect(page).toHaveURL(/\/confirm\.php$/);
    await page.getByTestId('place-order-btn').click();
    await expect(page).toHaveURL(/\/thanks\.php$/);
    await expect(page).toHaveTitle(/Thank You/);
    await expect(page.getByTestId('breadcrumb-current')).toHaveText('Thanks');
    await expect(page.getByTestId('order-success-title')).toContainText('Thank You for Your Order!');
    await expect(page.getByTestId('order-success-message')).toHaveText('Your order has been placed successfully.');
    expect(await readStorage(page, 'cart')).toBeNull();
    expect(await readStorage(page, 'user')).toBeNull();
    await page.getByTestId('shop-again-btn').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
    await expect(badge(page)).toHaveText('0');
  });
});
