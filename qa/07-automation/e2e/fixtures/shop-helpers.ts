/**
 * fixtures/shop-helpers.ts
 *
 * Project-owned helpers for the QA Automation Labs Shop.
 *
 * Session, cart and checkout data are 100% client-side (localStorage of the origin):
 *   isLoggedIn = "true"  - session flag written by the login
 *   cart       = [{ id, qty }]
 *   user       = checkout data written by checkout.php
 * There is no server session and no network call, so every browser context is isolated.
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { InfraError } from './defects';

/** Empty storageState for "no session" tests (fresh context, empty localStorage). */
export const NO_SESSION = { cookies: [], origins: [] };

/** Same-origin static resource used to write localStorage before visiting a page. No app script runs on it. */
const STAGING_PATH = '/js/products.js';

export type CartLine = { id: number; qty: number };

export const BASE_CART: CartLine[] = [
  { id: 21, qty: 2 },
  { id: 22, qty: 1 },
];

/** Execution index (minutes since epoch, mod 100000): unique suffix for generated data. */
export const EXEC_IDX = Math.floor(Date.now() / 60_000) % 100_000;

/**
 * Writes localStorage keys of the origin before the test navigates to the page under test.
 * A value of `null` removes the key; a string is stored as is; anything else is JSON-encoded.
 */
export async function seedStorage(page: Page, values: Record<string, unknown>): Promise<void> {
  const response = await page.goto(STAGING_PATH);
  if (!response || response.status() >= 400) {
    throw new InfraError('app-unavailable', `staging resource ${STAGING_PATH} answered ${response?.status()}`);
  }
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      if (value === null) localStorage.removeItem(key);
      else if (typeof value === 'string') localStorage.setItem(key, value);
      else localStorage.setItem(key, JSON.stringify(value));
    }
  }, values);
}

export async function readStorage(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

export async function readCart(page: Page): Promise<unknown> {
  const raw = await readStorage(page, 'cart');
  return raw === null ? null : JSON.parse(raw);
}

export function badge(page: Page): Locator {
  return page.getByTestId('header-cart-count');
}

/** Path part of the current URL (e.g. "/shop.php"). */
export function pathOf(page: Page): string {
  return new URL(page.url()).pathname;
}

/** Waits for the client-side session guard to send the browser to /index.php. */
export async function expectRedirectToLogin(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/index\.php$/);
}

/**
 * Observes whether the client-side guard redirects to /index.php within `timeoutMs`.
 * Used only before an open-defect assertion, where waiting for an expected redirect
 * must not fail the test by itself.
 */
export async function observeRedirect(page: Page, pattern: RegExp, timeoutMs = 5_000): Promise<boolean> {
  await page.waitForLoadState('load');
  return page
    .waitForURL(pattern, { timeout: timeoutMs })
    .then(() => true)
    .catch(() => false);
}

/** Clicks the label of a Bootstrap custom-control checkbox (the label intercepts pointer events). */
export async function toggleFilter(page: Page, testId: string, checked: boolean): Promise<void> {
  const input = page.getByTestId(testId);
  const id = await input.getAttribute('id');
  if (!id) throw new InfraError('selector-drift', `filter ${testId} has no id attribute for its label`);
  await page.locator(`label[for="${id}"]`).click();
  if (checked) await expect(input).toBeChecked();
  else await expect(input).not.toBeChecked();
}

/** Ids of the product cards currently rendered, in display order. */
export async function productIds(page: Page): Promise<number[]> {
  const testIds = await page.locator('[data-testid^="product-card-"]').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-testid') ?? '')
  );
  return testIds.map((t) => Number(t.replace('product-card-', '')));
}

export async function productNames(page: Page): Promise<string[]> {
  return page.locator('[data-testid^="product-name-"]').allInnerTexts().then((a) => a.map((s) => s.trim()));
}

export async function productPrices(page: Page): Promise<number[]> {
  const texts = await page.locator('[data-testid^="product-price-"]').allInnerTexts();
  return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
}

/** Waits until the category listing shows `n` products in its counter. */
export async function expectResults(page: Page, n: number): Promise<void> {
  await expect(page.getByTestId('results-count')).toHaveText(n === 1 ? '1 product' : `${n} products`);
}

/** Opens a category page and waits for its full listing. */
export async function openCategory(page: Page, path: string, expected: number): Promise<void> {
  await page.goto(path);
  await expectResults(page, expected);
}

/** Collapses whitespace (breadcrumbs and cells contain line breaks and indentation). */
export function norm(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

/** Credentials of the demo account from the environment. Never logged or asserted by value. */
export function demoCredentials(): { email: string; password: string } {
  const email = process.env.QA_USER_EMAIL;
  const password = process.env.QA_USER_PASSWORD;
  if (!email || !password) {
    throw new InfraError('test-data', 'QA_USER_EMAIL / QA_USER_PASSWORD are not set in the environment');
  }
  return { email, password };
}
