# Escenarios de prueba - Autenticación: Inicio de sesión

**Código de módulo**: AUTH  
**Código de submódulo**: LOGIN  
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizable | Manual |
|-----------|----------|---------------|--------|
| P0 | 2 | 2 | 0 |
| P1 | 7 | 7 | 0 |
| P2 | 8 | 8 | 0 |
| P3 | 2 | 2 | 0 |
| **Total** | **19** | **19** | **0** |

| Tipo | Cantidad |
|------|----------|
| Functional | 10 |
| Negative | 9 |

Todos los TCs tienen origen `UI-OBSERVED` (comportamiento ejecutado en la sesión de exploración del 2026-11-20).

Cobertura obligatoria: acceso sin sesión y protección de páginas se cubren en `submodule-session`; no hay roles sin permiso (rol único); no aplica duplicados, exportación ni paginación en este submódulo.

---

### TC-AUTH-LOGIN-001: Login exitoso con la cuenta demo redirige a la tienda

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto de navegador limpio, en `/index.php`.

**Steps**:
1. Completar `login-email-input` con `QA_USER_EMAIL`.
2. Completar `login-password-input` con `QA_USER_PASSWORD`.
3. Clic en `login-submit-btn`.

**Expected result**: La URL pasa a `/shop.php`; `breadcrumb-current` muestra "Shop"; `header-logout-btn` es visible; `localStorage.isLoggedIn` es `"true"`.

**Notes**: RN-AUTH-006, FL-AUTH-001.

---

### TC-AUTH-LOGIN-002: Contraseña incorrecta muestra mensaje genérico y no inicia sesión

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto limpio, en `/index.php`.

**Steps**:
1. Email `QA_USER_EMAIL`, contraseña `wrongpass`.
2. Clic en `login-submit-btn`.

**Expected result**: Se permanece en `/index.php`; `login-error-message` muestra "Invalid email or password!"; no existe `localStorage.isLoggedIn`.

**Notes**: RN-AUTH-007.

---

### TC-AUTH-LOGIN-003: Email no registrado muestra el mismo mensaje genérico

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto limpio, en `/index.php`.

**Steps**:
1. Email `qa.noexiste.${EXEC_IDX}@example.test`, contraseña `QA_USER_PASSWORD`.
2. Clic en `login-submit-btn`.

**Expected result**: `login-error-message` muestra "Invalid email or password!" (idéntico a TC-AUTH-LOGIN-002, sin revelar qué dato falló); URL `/index.php`.

**Notes**: RN-AUTH-007.

---

### TC-AUTH-LOGIN-004: Email vacío muestra error obligatorio

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Dejar el email vacío y escribir `abcd` en contraseña.
2. Clic en `login-submit-btn`.

**Expected result**: `login-email-error` muestra "Please enter your email."; `login-password-error` y `login-error-message` no son visibles; URL `/index.php`.

**Notes**: RN-AUTH-001.

---

### TC-AUTH-LOGIN-005: Contraseña vacía muestra error obligatorio

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Email `QA_USER_EMAIL`, contraseña vacía.
2. Clic en `login-submit-btn`.

**Expected result**: `login-password-error` muestra "Please enter your password."; `login-email-error` no visible; URL `/index.php`.

**Notes**: RN-AUTH-002.

---

### TC-AUTH-LOGIN-006: Ambos campos vacíos muestran solo el error de email

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Dejar email y contraseña vacíos.
2. Clic en `login-submit-btn`.

**Expected result**: Solo `login-email-error` es visible, con "Please enter your email."; `login-password-error` no visible.

**Notes**: RN-AUTH-003 (orden de validación, un error a la vez).

---

### TC-AUTH-LOGIN-007: Email con formato inválido es rechazado (parametrizado)

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Para cada email de [`abc`, `abc@x`, `a b@x.com`], con contraseña `abcd`:
2. Completar los campos y hacer clic en `login-submit-btn`.

**Expected result**: En cada caso `login-email-error` muestra "Please enter a valid email address." y la URL sigue en `/index.php`.

**Notes**: RN-AUTH-004.

---

### TC-AUTH-LOGIN-008: Contraseña de menos de 4 caracteres es rechazada (parametrizado)

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Para cada contraseña de [`abc`, ` ab ` (con espacios)], con email `QA_USER_EMAIL`:
2. Clic en `login-submit-btn`.

**Expected result**: `login-password-error` muestra "Password must be at least 4 characters long."; no hay redirección.

**Notes**: RN-AUTH-005 (longitud medida tras `trim`).

---

### TC-AUTH-LOGIN-009: Email con mayúsculas distintas es rechazado

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Email `QA_USER_EMAIL` convertido a mayúsculas, contraseña `QA_USER_PASSWORD`.
2. Clic en `login-submit-btn`.

**Expected result**: `login-error-message` muestra "Invalid email or password!"; URL `/index.php`.

**Notes**: RN-AUTH-006 (comparación exacta). Ver ANOM-AUTH-07 (recomendación de normalizar el email).

---

### TC-AUTH-LOGIN-010: Espacios alrededor de las credenciales se ignoran

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto limpio, en `/index.php`.

**Steps**:
1. Email `"  " + QA_USER_EMAIL + "  "`, contraseña `"  " + QA_USER_PASSWORD + "  "`.
2. Clic en `login-submit-btn`.

**Expected result**: Login exitoso: URL `/shop.php` y `localStorage.isLoggedIn` = `"true"`.

**Notes**: RN-AUTH-008.

---

### TC-AUTH-LOGIN-011: Campos con solo espacios se tratan como vacíos

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Escribir `   ` (3 espacios) en email y en contraseña.
2. Clic en `login-submit-btn`.

**Expected result**: `login-email-error` muestra "Please enter your email.".

**Notes**: RN-AUTH-001, RN-AUTH-008.

---

### TC-AUTH-LOGIN-012: Los mensajes de error se ocultan al escribir

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php` con "Please enter your email." visible (clic en Login con campos vacíos).

**Steps**:
1. Escribir un carácter en `login-email-input`.

**Expected result**: `login-email-error`, `login-password-error` y `login-error-message` quedan ocultos.

**Notes**: RN-AUTH-009.

---

### TC-AUTH-LOGIN-013: Mostrar y ocultar la contraseña

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`, contraseña `abcd` escrita.

**Steps**:
1. Clic en `login-password-toggle`.
2. Clic nuevamente en `login-password-toggle`.

**Expected result**: Tras el paso 1, `login-password-input` tiene `type="text"` y el botón `title="Hide password"`; tras el paso 2, `type="password"` y `title="Show password"`. El valor no cambia.

**Notes**: RN-AUTH-011.

---

### TC-AUTH-LOGIN-014: Autocompletar credenciales demo

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`, email con texto arbitrario y un error de validación visible.

**Steps**:
1. Clic en `login-autofill-demo`.
2. Clic en `login-submit-btn`.

**Expected result**: Tras el paso 1, email = `QA_USER_EMAIL`, contraseña = `QA_USER_PASSWORD`, errores ocultos y la URL sigue en `/index.php` (no envía solo). Tras el paso 2, redirección a `/shop.php`.

**Notes**: RN-AUTH-012.

---

### TC-AUTH-LOGIN-015: "Remember me" guarda y precarga el email

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto limpio, en `/index.php`; `login-remember-me` desmarcado por defecto.

**Steps**:
1. Marcar `login-remember-me`, ingresar credenciales demo y hacer clic en `login-submit-btn`.
2. Volver a `/index.php` (o hacer logout).

**Expected result**: `localStorage.rememberedEmail` = `QA_USER_EMAIL`; en `/index.php` el email aparece precargado, el checkbox marcado y la contraseña vacía.

**Notes**: RN-AUTH-010, FL-AUTH-003.

---

### TC-AUTH-LOGIN-016: Login sin "Remember me" elimina el email recordado

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- `localStorage.rememberedEmail` existente (TC-AUTH-LOGIN-015) y en `/index.php`.

**Steps**:
1. Desmarcar `login-remember-me`.
2. Ingresar credenciales demo y hacer clic en `login-submit-btn`.
3. Volver a `/index.php` en un contexto sin `isLoggedIn`.

**Expected result**: `localStorage.rememberedEmail` no existe; el email no se precarga y el checkbox aparece desmarcado.

**Notes**: RN-AUTH-010.

---

### TC-AUTH-LOGIN-017: Login con usuario registrado en el navegador

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- `localStorage.users` sembrado con `{ email: qa.auth.${EXEC_IDX}@example.test, password: <contraseña generada> }`.

**Steps**:
1. Ingresar ese email con una contraseña distinta y hacer clic en Login.
2. Ingresar ese email con la contraseña correcta y hacer clic en Login.

**Expected result**: Paso 1: "Invalid email or password!" en `/index.php`. Paso 2: redirección a `/shop.php` con `localStorage.isLoggedIn` = `"true"`.

**Notes**: RN-AUTH-006, RN-AUTH-013 (Dependency).

---

### TC-AUTH-LOGIN-018: Estructura de la página de login

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto limpio.

**Steps**:
1. Navegar a `/index.php`.

**Expected result**: El título contiene "Sign In"; son visibles `login-email-input` (placeholder "Email"), `login-password-input` (placeholder "Password", `type=password`), `login-remember-me` (desmarcado), `login-submit-btn` (texto "Login"), `login-autofill-demo`, `login-demo-credentials` y `register-link`; los mensajes de error están ocultos; `header-logout-btn` y `header-cart-link` no son visibles.

**Notes**: Inventario 00-inventory.md.

---

### TC-AUTH-LOGIN-019: Enlace "Register Here" lleva al registro

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/index.php`.

**Steps**:
1. Clic en `register-link`.

**Expected result**: La URL pasa a `/register.php`.

**Notes**: Solo navegación; el registro está fuera de alcance.
