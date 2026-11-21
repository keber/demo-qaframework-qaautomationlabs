// INSPECTION: 2026-11-20 (from qa/01-specifications/module-auth/submodule-login/00-inventory.md)
// Login form: login-form (div, not <form>), login-email-input, login-password-input,
// login-password-toggle, login-remember-me, login-submit-btn, login-autofill-demo,
// login-demo-credentials, register-link. Errors: login-email-error, login-password-error,
// login-error-message. Success: /shop.php + localStorage.isLoggedIn = "true". No XHR.
//
// This file types the real demo password, so it runs ONLY in the opt-in "login-flow"
// project (no trace / video / screenshot): QA_RUN_LOGIN_FLOW=1 or --project login-flow.
// The password is set through evaluate() (LoginPage.fillSecretPassword) and is never
// asserted by value, so it cannot appear in an error message either.

import { test, expect } from '@playwright/test';
import { LoginPage, logout } from '../../page-objects/LoginPage';
import { InfraError } from '../../fixtures/defects';
import { EXEC_IDX, demoCredentials, pathOf, readStorage, seedStorage } from '../../fixtures/shop-helpers';

test.describe('AUTH - Inicio de sesión', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
  });

  test('[TC-AUTH-LOGIN-001] Login exitoso con la cuenta demo redirige a la tienda @P0', async ({ page }) => {
    const { email, password } = demoCredentials();
    await test.step('Abrir /index.php', async () => {
      await login.goto();
    });
    await test.step('Ingresar credenciales demo y hacer click en Login', async () => {
      await login.email.fill(email);
      await expect(login.email).toHaveValue(email);
      await login.fillSecretPassword(password);
      await expect(login.password).toHaveAttribute('type', 'password');
      await login.submit.click();
      await expect(page).toHaveURL(/\/shop\.php$/);
    });
    await test.step('Verificar breadcrumb, logout e isLoggedIn', async () => {
      await expect(page.getByTestId('breadcrumb-current')).toHaveText(/Shop/);
      await expect(page.getByTestId('header-logout-btn')).toBeVisible();
      expect(await readStorage(page, 'isLoggedIn')).toBe('true');
    });
  });

  test('[TC-AUTH-LOGIN-002] Contraseña incorrecta muestra mensaje genérico y no inicia sesión @P0', async ({ page }) => {
    const { email } = demoCredentials();
    await login.goto();
    await login.email.fill(email);
    await login.fillPassword('wrongpass');
    await login.submit.click();
    await expect(login.errorMessage).toHaveText('Invalid email or password!');
    expect(pathOf(page)).toBe('/index.php');
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
  });

  test('[TC-AUTH-LOGIN-003] Email no registrado muestra el mismo mensaje genérico @P1', async ({ page }) => {
    const { password } = demoCredentials();
    await login.goto();
    await login.email.fill(`qa.noexiste.${EXEC_IDX}@example.test`);
    await login.fillSecretPassword(password);
    await login.submit.click();
    await expect(login.errorMessage).toHaveText('Invalid email or password!');
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-004] Email vacío muestra error obligatorio @P1', async ({ page }) => {
    await login.goto();
    await login.fillPassword('abcd');
    await login.submit.click();
    await expect(login.emailError).toHaveText('Please enter your email.');
    await expect(login.passwordError).toBeHidden();
    await expect(login.errorMessage).toBeHidden();
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-005] Contraseña vacía muestra error obligatorio @P1', async ({ page }) => {
    const { email } = demoCredentials();
    await login.goto();
    await login.email.fill(email);
    await login.submit.click();
    await expect(login.passwordError).toHaveText('Please enter your password.');
    await expect(login.emailError).toBeHidden();
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-006] Ambos campos vacíos muestran solo el error de email @P2', async ({ page }) => {
    await login.goto();
    await login.submit.click();
    await expect(login.emailError).toHaveText('Please enter your email.');
    expect(await login.visibleErrors()).toEqual(['login-email-error']);
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-007] Email con formato inválido es rechazado (parametrizado) @P1', async ({ page }) => {
    await login.goto();
    for (const value of ['abc', 'abc@x', 'a b@x.com']) {
      await test.step(`Email "${value}"`, async () => {
        await login.email.fill(value);
        await login.fillPassword('abcd');
        await login.submit.click();
        await expect(login.emailError).toHaveText('Please enter a valid email address.');
        expect(pathOf(page)).toBe('/index.php');
      });
    }
  });

  test('[TC-AUTH-LOGIN-008] Contraseña de menos de 4 caracteres es rechazada (parametrizado) @P1', async ({ page }) => {
    const { email } = demoCredentials();
    await login.goto();
    for (const value of ['abc', ' ab ']) {
      await test.step(`Password "${value}"`, async () => {
        await login.email.fill(email);
        await login.fillPassword(value);
        await login.submit.click();
        await expect(login.passwordError).toHaveText('Password must be at least 4 characters long.');
        expect(pathOf(page)).toBe('/index.php');
      });
    }
  });

  test('[TC-AUTH-LOGIN-009] Email con mayúsculas distintas es rechazado @P3', async ({ page }) => {
    const { email, password } = demoCredentials();
    if (email.toUpperCase() === email) {
      throw new InfraError('test-data', 'QA_USER_EMAIL has no lowercase letters to change case');
    }
    await login.goto();
    await login.email.fill(email.toUpperCase());
    await login.fillSecretPassword(password);
    await login.submit.click();
    await expect(login.errorMessage).toHaveText('Invalid email or password!');
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-010] Espacios alrededor de las credenciales se ignoran @P2', async ({ page }) => {
    const { email, password } = demoCredentials();
    await login.goto();
    await login.email.fill(`  ${email}  `);
    await login.fillSecretPassword(`  ${password}  `);
    await login.submit.click();
    await expect(page).toHaveURL(/\/shop\.php$/);
    expect(await readStorage(page, 'isLoggedIn')).toBe('true');
  });

  test('[TC-AUTH-LOGIN-011] Campos con solo espacios se tratan como vacíos @P2', async ({ page }) => {
    await login.goto();
    await login.email.fill('   ');
    await login.fillPassword('   ');
    await login.submit.click();
    await expect(login.emailError).toHaveText('Please enter your email.');
    expect(pathOf(page)).toBe('/index.php');
  });

  test('[TC-AUTH-LOGIN-012] Los mensajes de error se ocultan al escribir @P2', async () => {
    await login.goto();
    await login.submit.click();
    await expect(login.emailError).toHaveText('Please enter your email.');
    await login.email.pressSequentially('a');
    await expect(login.emailError).toBeHidden();
    await expect(login.passwordError).toBeHidden();
    await expect(login.errorMessage).toBeHidden();
  });

  test('[TC-AUTH-LOGIN-013] Mostrar y ocultar la contraseña @P2', async () => {
    await login.goto();
    await login.fillPassword('abcd');
    await expect(login.password).toHaveAttribute('type', 'password');
    await login.toggle.click();
    await expect(login.password).toHaveAttribute('type', 'text');
    await expect(login.toggle).toHaveAttribute('title', 'Hide password');
    await login.toggle.click();
    await expect(login.password).toHaveAttribute('type', 'password');
    await expect(login.toggle).toHaveAttribute('title', 'Show password');
    await expect(login.password).toHaveValue('abcd');
  });

  test('[TC-AUTH-LOGIN-014] Autocompletar credenciales demo @P2', async ({ page }) => {
    const { email, password } = demoCredentials();
    await login.goto();
    await login.email.fill('abc');
    await login.submit.click();
    // RN-AUTH-003: validation stops at the first failing check in the order
    // (1) empty email, (2) empty password, (3) email format. With email "abc" and an
    // empty password, check (2) fires first, so the visible error is the password one.
    await expect(login.passwordError).toHaveText('Please enter your password.');
    await expect(login.emailError).toBeHidden();
    await login.autofill.click();
    await expect(login.email).toHaveValue(email);
    const autofilledMatches = await login.password.evaluate((el, pwd) => (el as HTMLInputElement).value === pwd, password);
    expect(autofilledMatches, 'autofilled password equals QA_USER_PASSWORD').toBe(true);
    expect(await login.visibleErrors()).toEqual([]);
    expect(pathOf(page)).toBe('/index.php');
    await login.submit.click();
    await expect(page).toHaveURL(/\/shop\.php$/);
  });

  test('[TC-AUTH-LOGIN-015] "Remember me" guarda y precarga el email @P1', async ({ page }) => {
    const { email, password } = demoCredentials();
    await login.goto();
    await expect(login.rememberMe).not.toBeChecked();
    await login.loginWithSecret(email, password, { rememberMe: true });
    expect(await readStorage(page, 'rememberedEmail')).toBe(email);
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await expect(login.email).toHaveValue(email);
    await expect(login.rememberMe).toBeChecked();
    await expect(login.password).toHaveValue('');
  });

  test('[TC-AUTH-LOGIN-016] Login sin "Remember me" elimina el email recordado @P2', async ({ page }) => {
    const { email, password } = demoCredentials();
    await seedStorage(page, { rememberedEmail: email });
    await login.goto();
    await expect(login.email).toHaveValue(email);
    await expect(login.rememberMe).toBeChecked();
    await login.rememberMe.uncheck();
    await expect(login.rememberMe).not.toBeChecked();
    await login.loginWithSecret(email, password);
    await logout(page);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
    await expect(login.email).toHaveValue('');
    await expect(login.rememberMe).not.toBeChecked();
    expect(await readStorage(page, 'rememberedEmail')).toBeNull();
  });

  test('[TC-AUTH-LOGIN-017] Login con usuario registrado en el navegador @P1', async ({ page }) => {
    const seededEmail = `qa.auth.${EXEC_IDX}@example.test`;
    const seededPassword = `Qa-${EXEC_IDX}-${Math.random().toString(36).slice(2, 10)}`;
    await seedStorage(page, { users: [{ email: seededEmail, password: seededPassword }] });
    await login.goto();
    await test.step('Contraseña distinta es rechazada', async () => {
      await login.email.fill(seededEmail);
      await login.fillPassword(`${seededPassword}-x`);
      await login.submit.click();
      await expect(login.errorMessage).toHaveText('Invalid email or password!');
      expect(pathOf(page)).toBe('/index.php');
    });
    await test.step('Contraseña sembrada inicia sesión', async () => {
      await login.email.fill(seededEmail);
      await login.fillSecretPassword(seededPassword);
      await login.submit.click();
      await expect(page).toHaveURL(/\/shop\.php$/);
      expect(await readStorage(page, 'isLoggedIn')).toBe('true');
    });
  });

  test('[TC-AUTH-LOGIN-018] Estructura de la página de login @P2', async ({ page }) => {
    await login.goto();
    await expect(page).toHaveTitle(/Sign In/);
    await expect(login.email).toHaveAttribute('placeholder', 'Email');
    await expect(login.password).toHaveAttribute('placeholder', 'Password');
    await expect(login.password).toHaveAttribute('type', 'password');
    for (const loc of [login.rememberMe, login.submit, login.autofill, login.demoCredentials, login.registerLink]) {
      await expect(loc).toBeVisible();
    }
    await expect(login.rememberMe).not.toBeChecked();
    await expect(login.submit).toHaveText(/^\s*Login\s*$/);
    expect(await login.visibleErrors()).toEqual([]);
    await expect(page.getByTestId('header-logout-btn')).toBeHidden();
    await expect(page.getByTestId('header-cart-link')).toBeHidden();
  });

  test('[TC-AUTH-LOGIN-019] Enlace "Register Here" lleva al registro @P3', async ({ page }) => {
    await login.goto();
    await login.registerLink.click();
    await expect(page).toHaveURL(/\/register\.php$/);
  });
});

test.describe('AUTH - Sesión (flujos con login real)', () => {
  test('[TC-AUTH-SES-012] El logout conserva el email recordado @P3', async ({ page }) => {
    const { email, password } = demoCredentials();
    const login = new LoginPage(page);
    await login.goto();
    await login.loginWithSecret(email, password, { rememberMe: true });
    await logout(page);
    await expect(login.email).toHaveValue(email);
    await expect(login.rememberMe).toBeChecked();
    expect(await readStorage(page, 'rememberedEmail')).toBe(email);
    expect(await readStorage(page, 'isLoggedIn')).toBeNull();
  });
});
