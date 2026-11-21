# Escenarios de prueba - Autenticación: Sesión y cierre de sesión

**Código de módulo**: AUTH  
**Código de submódulo**: SES  
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizable | Manual |
|-----------|----------|---------------|--------|
| P0 | 4 | 4 | 0 |
| P1 | 4 | 4 | 0 |
| P2 | 3 | 3 | 0 |
| P3 | 1 | 1 | 0 |
| **Total** | **12** | **12** | **0** |

| Tipo | Cantidad |
|------|----------|
| Functional | 6 |
| Security | 6 |

Todos los TCs tienen origen `UI-OBSERVED`. TC-AUTH-SES-010 y TC-AUTH-SES-011 exponen incumplimientos de RN-AUTH-015 (ANOM-AUTH-01 y ANOM-AUTH-02): al automatizarlos se usará `test.fail()` solo cuando exista el archivo `DEF-*` correspondiente en `qa/06-defects/open/`.

---

### TC-AUTH-SES-001: Acceso a la tienda sin sesión redirige al login

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto de navegador nuevo, sin `isLoggedIn`.

**Steps**:
1. Navegar a `/shop.php`.

**Expected result**: La URL final es `/index.php` y `login-email-input` es visible.

**Notes**: RN-AUTH-015, FL-AUTH-004.

---

### TC-AUTH-SES-002: Acceso a categorías y carrito sin sesión redirige al login (parametrizado)

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto nuevo, sin `isLoggedIn`.

**Steps**:
1. Para cada ruta de [`/mens-wear.php`, `/womens-wear.php`, `/kids-wear.php`, `/electronics.php`, `/cart.php`], navegar a la ruta.

**Expected result**: En cada caso la URL final es `/index.php`.

**Notes**: RN-AUTH-015.

---

### TC-AUTH-SES-003: Tras el login el encabezado muestra logout y carrito

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Login exitoso con la cuenta demo, en `/shop.php`, carrito vacío.

**Steps**:
1. Observar el encabezado.

**Expected result**: `header-logout-btn` (title "Logout") y `header-cart-link` son visibles; `header-cart-count` muestra "0".

**Notes**: RN-AUTH-017.

---

### TC-AUTH-SES-004: Logout cierra la sesión y redirige al login

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión activa en `/shop.php`.

**Steps**:
1. Clic en `header-logout-btn`.

**Expected result**: La URL pasa a `/index.php`; `localStorage.isLoggedIn` no existe; `header-logout-btn` no es visible.

**Notes**: RN-AUTH-016, FL-AUTH-005.

---

### TC-AUTH-SES-005: Tras el logout las páginas protegidas redirigen al login

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Logout realizado (TC-AUTH-SES-004).

**Steps**:
1. Navegar directamente a `/cart.php`.
2. Navegar directamente a `/shop.php`.

**Expected result**: En ambos casos la URL final es `/index.php`.

**Notes**: RN-AUTH-016.

---

### TC-AUTH-SES-006: El botón "Atrás" tras el logout no restaura el acceso

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión activa; navegación `/index.php` -> login -> `/shop.php`.

**Steps**:
1. Clic en `header-logout-btn`.
2. Ejecutar "Atrás" del navegador.

**Expected result**: La URL final es `/index.php`; no se muestra contenido de la tienda.

**Notes**: RN-AUTH-016.

---

### TC-AUTH-SES-007: La sesión se comparte entre pestañas del mismo contexto

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Login exitoso en la pestaña A.

**Steps**:
1. Abrir una pestaña B en el mismo contexto.
2. Navegar en B a `/electronics.php`.

**Expected result**: La pestaña B permanece en `/electronics.php` sin redirección al login.

**Notes**: RN-AUTH-018.

---

### TC-AUTH-SES-008: Un contexto de navegador nuevo no hereda la sesión

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Login exitoso en el contexto 1.

**Steps**:
1. Crear un contexto 2 nuevo (sin `storageState`).
2. Navegar en el contexto 2 a `/shop.php`.

**Expected result**: El contexto 2 termina en `/index.php`.

**Notes**: RN-AUTH-018.

---

### TC-AUTH-SES-009: La pérdida de `isLoggedIn` durante la sesión obliga a reautenticarse

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión activa en `/shop.php`.

**Steps**:
1. Eliminar `localStorage.isLoggedIn` (simula logout en otra pestaña o limpieza de datos).
2. Navegar a `/kids-wear.php`.

**Expected result**: La URL final es `/index.php`.

**Notes**: RN-AUTH-018, FL-AUTH-006.

---

### TC-AUTH-SES-010: Un indicador de sesión no emitido por el login no concede acceso

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto nuevo, sin login. `localStorage.isLoggedIn = "false"` escrito en el origen.

**Steps**:
1. Navegar a `/shop.php`.

**Expected result** (según RN-AUTH-015): Redirección a `/index.php`.

**Notes**: Comportamiento actual observado: la página `/shop.php` se muestra (el guard solo comprueba que la clave no esté vacía). Incumple RN-AUTH-015, ver ANOM-AUTH-01 (candidato a DEF).

---

### TC-AUTH-SES-011: El servidor no entrega contenido protegido sin sesión

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Partial |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Cliente sin sesión (petición HTTP sin storage, o contexto con JavaScript deshabilitado).

**Steps**:
1. Ejecutar GET a `/shop.php` (por ejemplo con `request.get` de Playwright).
2. Alternativa manual: abrir `/shop.php` con JavaScript deshabilitado.

**Expected result** (según RN-AUTH-015): La respuesta no contiene contenido protegido (sin `data-testid="category-card-men"` ni `header-logout-btn` utilizable) o es una redirección/401.

**Notes**: Comportamiento actual observado: HTTP 200 con el HTML completo; sin JavaScript se ven las 4 tarjetas de categoría. Incumple RN-AUTH-015, ver ANOM-AUTH-02 (candidato a DEF). "Partial": la verificación con JavaScript deshabilitado es manual o requiere un contexto dedicado.

---

### TC-AUTH-SES-012: El logout conserva el email recordado

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Login exitoso con "Remember me" marcado, en `/shop.php`.

**Steps**:
1. Clic en `header-logout-btn`.

**Expected result**: En `/index.php` el email aparece precargado y `login-remember-me` marcado; `localStorage.rememberedEmail` sigue existiendo y `isLoggedIn` no.

**Notes**: RN-AUTH-010, RN-AUTH-016.
