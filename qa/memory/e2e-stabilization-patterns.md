# E2E Stabilization Patterns

> A running log of flakiness patterns found in this project and the techniques used to fix them.
> Load this file when investigating intermittent test failures or refactoring fragile specs.

## Crash-Recovery Pattern

When the application server crashes intermittently (e.g. unhandled error page with a Reload link),
a bare `waitFor` will timeout. Use `Promise.race` to detect the error state and recover:

```typescript
const outcome = await Promise.race([
  targetElement.waitFor({ state: 'visible', timeout: 60_000 }).then(() => 'ready' as const),
  page.getByText('An unhandled error has occurred.').waitFor({ state: 'visible', timeout: 60_000 }).then(() => 'crash' as const),
]).catch(() => 'timeout' as const);

if (outcome === 'crash') {
  await page.getByRole('link', { name: 'Reload' }).click();
  await targetElement.waitFor({ state: 'visible', timeout: 60_000 });
}
```

> Document which spec files use this pattern and under what conditions it fires.

## Strict-Mode Selector Conflicts

`getByText()` and similar matchers can match multiple elements, triggering strict-mode violations.
Scope selectors to the most specific container available.

> Document conflicts found in this project here.
> Example: a pagination counter regex that also matches a card element.
> Fix: use a scoped `locator('.specific-class')` instead of a broad text match.

## Known Flaky Failure Types

Document categories of instability specific to this project. A row per pattern is enough.

| ID | Root cause | Fix | Affected tests |
|---|---|---|---|
| STAB-001 (2026-11-20) | Falso fallo, no flaky: el TC esperaba el error en `login-email-error` con email `abc` y contraseña vacía, pero RN-AUTH-003 valida la contraseña vacía antes que el formato del email, así que el único error visible es `login-password-error` ("Please enter your password."). | Categoría I: aserción alineada con la spec (texto exacto en `login-password-error` + `login-email-error` oculto), no debilitada. Fila del plan precisada. Confirmado 3/3 con la suite oficial. | TC-AUTH-LOGIN-014 (`tests/auth/login.login.spec.ts`) |

> Lección (login): antes de escribir el paso "ver un error de validación", resolver con RN-AUTH-003 qué slot de error dispara la combinación de entradas. Con varios campos inválidos solo se muestra el primero en el orden email vacío -> contraseña vacía -> formato email -> longitud contraseña -> credenciales.

> Examples: framework hydration delays, input binding issues requiring `pressSequentially`,
> elements that are in the DOM but not yet rendered, session expiry during long runs.

## Reference Timeouts

Fill in the timeout values used in this project once they are stabilized.

| Setting | Value | Location |
|---|---|---|
| Default test timeout | - | `playwright.config.ts` |
| `actionTimeout` | - | `playwright.config.ts` |
| `navigationTimeout` | - | `playwright.config.ts` |
| Long-running spec timeout | - | Per-spec `describe.configure` |
