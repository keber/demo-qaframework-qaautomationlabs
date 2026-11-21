/**
 * page-objects/LoginPage.ts - /index.php (module AUTH, submodule LOGIN)
 *
 * A login with the real demo password happens only in *.login.spec.ts files, which run
 * in the opt-in "login-flow" project (no trace, video or screenshot). Even there the
 * password is set through evaluate(), never fill(), so its value never reaches a trace.
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly toggle: Locator;
  readonly rememberMe: Locator;
  readonly submit: Locator;
  readonly autofill: Locator;
  readonly demoCredentials: Locator;
  readonly registerLink: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('login-form');
    this.email = page.getByTestId('login-email-input');
    this.password = page.getByTestId('login-password-input');
    this.toggle = page.getByTestId('login-password-toggle');
    this.rememberMe = page.getByTestId('login-remember-me');
    this.submit = page.getByTestId('login-submit-btn');
    this.autofill = page.getByTestId('login-autofill-demo');
    this.demoCredentials = page.getByTestId('login-demo-credentials');
    this.registerLink = page.getByTestId('register-link');
    this.emailError = page.getByTestId('login-email-error');
    this.passwordError = page.getByTestId('login-password-error');
    this.errorMessage = page.getByTestId('login-error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.QA_LOGIN_PATH ?? '/index.php');
    await expect(this.email).toBeVisible();
  }

  /** Non-secret password value (wrong or synthetic passwords only). */
  async fillPassword(value: string): Promise<void> {
    await this.password.fill(value);
  }

  /** Secret password value: set through evaluate() so it never appears in a trace. */
  async fillSecretPassword(value: string): Promise<void> {
    await this.password.waitFor({ state: 'visible' });
    await this.page.evaluate(
      ([pwd]) => {
        const input = document.querySelector('[data-testid="login-password-input"]') as HTMLInputElement | null;
        if (!input) throw new Error('[LoginPage] password input not found');
        input.value = pwd;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      [value] as const
    );
  }

  /** Full login with the given credentials; waits for /shop.php. */
  async loginWithSecret(email: string, password: string, opts: { rememberMe?: boolean } = {}): Promise<void> {
    await this.email.fill(email);
    if (opts.rememberMe !== undefined) {
      if (opts.rememberMe) await this.rememberMe.check();
      else await this.rememberMe.uncheck();
    }
    await this.fillSecretPassword(password);
    await this.submit.click();
    await expect(this.page).toHaveURL(/\/shop\.php$/);
  }

  /** Visible error locators among the three login error slots. */
  async visibleErrors(): Promise<string[]> {
    const visible: string[] = [];
    for (const [name, loc] of [
      ['login-email-error', this.emailError],
      ['login-password-error', this.passwordError],
      ['login-error-message', this.errorMessage],
    ] as const) {
      if (await loc.isVisible()) visible.push(name);
    }
    return visible;
  }
}

/** Clicks the header logout button and waits for /index.php. */
export async function logout(page: Page): Promise<void> {
  await page.getByTestId('header-logout-btn').click();
  await expect(page).toHaveURL(/\/index\.php$/);
}
