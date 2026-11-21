/**
 * page-objects/CheckoutPage.ts - /checkout.php, /confirm.php, /thanks.php (module CART, submodule CHK)
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { EXEC_IDX } from '../fixtures/shop-helpers';

export type CheckoutField =
  | 'firstname' | 'middlename' | 'lastname' | 'email' | 'phone'
  | 'address' | 'state' | 'city' | 'pincode';

export const CHECKOUT_FIELDS: CheckoutField[] = [
  'firstname', 'middlename', 'lastname', 'email', 'phone', 'address', 'state', 'city', 'pincode',
];

/** Mandatory fields in validation order with the exact message of RN-CART-013. */
export const REQUIRED_FIELDS: { field: CheckoutField; label: string; message: string }[] = [
  { field: 'firstname', label: 'First Name', message: 'Please enter your first name.' },
  { field: 'lastname', label: 'Last Name', message: 'Please enter your last name.' },
  { field: 'email', label: 'E-mail', message: 'Please enter your email.' },
  { field: 'phone', label: 'Mobile No.', message: 'Please enter your phone number.' },
  { field: 'address', label: 'Address', message: 'Please enter your address.' },
  { field: 'state', label: 'State', message: 'Please enter your state.' },
  { field: 'city', label: 'City', message: 'Please enter your city.' },
  { field: 'pincode', label: 'Pin Code', message: 'Please enter your pincode.' },
];

/** Valid fictitious checkout data (04-test-data.md). */
export function validCheckoutData(): Record<CheckoutField, string> {
  return {
    firstname: 'Prueba',
    middlename: 'Media',
    lastname: `QA-${EXEC_IDX}`,
    email: `qa.test+${EXEC_IDX}@example.com`,
    phone: '9876543210',
    address: 'Calle Falsa 123',
    state: 'Test State',
    city: 'Test City',
    pincode: '12345',
  };
}

export class CheckoutPage {
  readonly page: Page;
  readonly form: Locator;
  readonly continueBtn: Locator;
  readonly orderTotal: Locator;
  readonly goBack: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('checkout-form');
    this.continueBtn = page.getByTestId('continue-btn');
    this.orderTotal = page.getByTestId('order-total');
    this.goBack = page.getByTestId('go-back-btn');
  }

  input(field: CheckoutField): Locator {
    return this.page.getByTestId(`checkout-${field}-input`);
  }

  error(field: CheckoutField): Locator {
    return this.page.getByTestId(`checkout-${field}-error`);
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout.php');
    await expect(this.form).toBeVisible();
  }

  async fill(data: Partial<Record<CheckoutField, string>>): Promise<void> {
    for (const field of CHECKOUT_FIELDS) {
      const value = data[field];
      if (value !== undefined) await this.input(field).fill(value);
    }
  }

  /** Names of the checkout-*-error elements currently visible. */
  async visibleErrors(): Promise<CheckoutField[]> {
    const visible: CheckoutField[] = [];
    for (const { field } of REQUIRED_FIELDS) {
      if (await this.error(field).isVisible()) visible.push(field);
    }
    return visible;
  }
}
