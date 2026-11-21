# Escenarios de prueba - Catálogo: Badge del carrito y Add to Cart

**Código de módulo**: CAT
**Código de submódulo**: BADGE
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|----------|-------|-----------|--------|
| P0 | 2 | 2 | 0 |
| P1 | 5 | 5 | 0 |
| P2 | 4 | 4 | 0 |
| P3 | 1 | 1 | 0 |
| **Total** | **12** | **12** | **0** |

Precondición común: sesión iniciada con `QA_USER_EMAIL` / `QA_USER_PASSWORD` (`<PLACEHOLDER>`) y
`localStorage.cart` vacío al inicio; limpiar el carrito al terminar cada test.

---

### TC-CAT-BADGE-001: Con carrito vacío el badge muestra 0

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito vacío.

**Steps**:
1. Navegar a `/mens-wear.php`.
2. Leer `header-cart-count`.

**Expected result**: El badge es visible y muestra "0".

**Notes**: RN-CAT-040.

---

### TC-CAT-BADGE-002: Agregar un producto desde el listado incrementa el badge a 1

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito vacío; en `/mens-wear.php`.

**Steps**:
1. Clic en `add-to-cart-21`.

**Expected result**: Badge "1" sin recargar; `localStorage.cart` = `[{"id":21,"qty":1}]`.

**Notes**: RN-CAT-041.

---

### TC-CAT-BADGE-003: Agregar el mismo producto dos veces incrementa qty y no el badge

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito vacío; en `/mens-wear.php`.

**Steps**:
1. Clic en `add-to-cart-21` dos veces.

**Expected result**: Badge "1"; `localStorage.cart` = `[{"id":21,"qty":2}]`.

**Notes**: RN-CAT-042. Si negocio define que el badge debe mostrar unidades (H-CAT-04), cambiar el esperado a "2" y tratar la diferencia como defecto.

---

### TC-CAT-BADGE-004: Agregar productos distintos incrementa el badge por cada línea nueva

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito vacío; en `/mens-wear.php`.

**Steps**:
1. Clic en `add-to-cart-21`.
2. Clic en `add-to-cart-22`.
3. Navegar a `/electronics.php` y hacer clic en `add-to-cart-61`.

**Expected result**: Badge "1", luego "2", luego "3"; el carrito contiene los ids 21, 22 y 61 con `qty: 1`.

**Notes**: RN-CAT-041.

---

### TC-CAT-BADGE-005: El badge se mantiene al navegar entre páginas del catálogo

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito con 3 líneas (TC-CAT-BADGE-004).

**Steps**:
1. Navegar a `/shop.php`, `/kids-wear.php`, `/product.php?id=23` y `/cart.php`, leyendo el badge en cada una.

**Expected result**: El badge muestra "3" en todas las páginas.

**Notes**: RN-CAT-043.

---

### TC-CAT-BADGE-006: El badge se mantiene tras recargar la página

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito con al menos 1 línea; en `/shop.php`.

**Steps**:
1. Recargar la página.

**Expected result**: El badge muestra el mismo valor que antes de recargar.

**Notes**: RN-CAT-043.

---

### TC-CAT-BADGE-007: Agregar desde un listado filtrado agrega el producto correcto

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito vacío; en `/mens-wear.php`.

**Steps**:
1. Marcar `filter-type-footwear`.
2. Clic en `add-to-cart-35`.
3. Desmarcar el filtro.

**Expected result**: Badge "1"; `localStorage.cart` = `[{"id":35,"qty":1}]`; el badge no cambia al desmarcar el filtro.

**Notes**: RN-CAT-044.

---

### TC-CAT-BADGE-008: Al agregar no se muestra alerta ni cambia el texto del botón

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Registrar un manejador de `dialog`.
2. Clic en `add-to-cart-22`.

**Expected result**: No se dispara ningún diálogo; el botón conserva el texto "Add to Cart"; la URL no cambia.

**Notes**: RN-CAT-045. Documenta el comportamiento actual; ver H-CAT-10.

---

### TC-CAT-BADGE-009: El badge es visible y correcto en viewport móvil

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Viewport 390 x 844; sesión iniciada; `localStorage.cart` = `[{"id":1,"qty":1},{"id":2,"qty":3}]`.

**Steps**:
1. Navegar a `/womens-wear.php`.

**Expected result**: `header-cart-count` visible con "2"; se listan 20 productos.

**Notes**: RN-CAT-040. Bajo 1350 px la navegación se colapsa, pero el badge sigue visible.

---

### TC-CAT-BADGE-010: Otra pestaña muestra el badge actualizado solo tras recargar

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito con 1 línea; pestaña A en `/mens-wear.php`.

**Steps**:
1. Abrir pestaña B en el mismo contexto en `/kids-wear.php` y hacer clic en `add-to-cart-41`.
2. Leer el badge en A.
3. Recargar A y leer el badge.

**Expected result**: Paso 1: B muestra "2". Paso 2: A sigue en "1". Paso 3: A muestra "2".

**Notes**: RN-CAT-046, H-CAT-05.

---

### TC-CAT-BADGE-011: El carrito y el badge se conservan tras logout y nuevo login

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Carrito con 2 líneas.

**Steps**:
1. Clic en `header-logout-btn`.
2. Leer `localStorage`.
3. Iniciar sesión otra vez y leer el badge en `/shop.php`.

**Expected result**: Tras el logout `isLoggedIn` no existe y `cart` se conserva; tras el login el badge muestra "2".

**Notes**: RN-CAT-047, H-CAT-06. Si negocio define que el logout debe vaciar el carrito, este TC pasa a validar ese requisito.

---

### TC-CAT-BADGE-012: Carrito corrupto en localStorage no impide usar el catálogo

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; `localStorage.cart` = `"not-json"`.

**Steps**:
1. Navegar a `/womens-wear.php`.

**Expected result**: El badge muestra "0" y se listan 20 productos; se registra un error de consola de JSON inválido.

**Notes**: RN-CAT-048.
