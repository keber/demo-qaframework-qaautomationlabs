# Escenarios de prueba - Carrito y checkout: Gestión del carrito

**Código de módulo**: CART
**Código de submódulo**: GEST
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|-----------|----------|----------------|----------|
| P0 | 5 | 5 | 0 |
| P1 | 7 | 7 | 0 |
| P2 | 5 | 5 | 0 |
| P3 | 1 | 1 | 0 |
| **Total** | **18** | **18** | **0** |

| Tipo | Cantidad |
|------|----------|
| Functional | 13 |
| Negative | 3 |
| Security | 1 |
| Regression | 1 |

Origen: los 18 TCs son `UI-OBSERVED` (comportamiento ejecutado en la UI el 2026-11-20).

Cobertura obligatoria: acceso sin sesión (TC-017); camino feliz (TC-001, TC-005, TC-016); formato
inválido (TC-008 a TC-010); transiciones de estado (TC-012 a TC-014). No aplican: rol sin permiso
(rol único), duplicado (agregar un existente incrementa la cantidad, TC-002), exportación,
paginación y búsqueda.

---

### TC-CART-GEST-001: Agregar un producto nuevo al carrito desde una página de categoría

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada con `QA_USER_EMAIL` / `QA_USER_PASSWORD`; carrito vacío.

**Steps**:
1. Navegar a `mens-wear.php`.
2. Clic en `add-to-cart-21`.

**Expected result**: `header-cart-count` muestra "1" y `localStorage.cart` es `[{"id":21,"qty":1}]`. No aparece diálogo ni alerta.

**Notes**: RN-CART-001.

---

### TC-CART-GEST-002: Agregar un producto que ya está en el carrito incrementa su cantidad

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío.

**Steps**:
1. En `mens-wear.php`, clic dos veces en `add-to-cart-21`.
2. Navegar a `cart.php`.

**Expected result**: `header-cart-count` = "1" tras ambos clics; en `cart.php` existe una sola fila `cart-row-21` con `cart-qty-21` = 2 y `cart-item-total-21` = "$300".

**Notes**: RN-CART-002. El contador cuenta productos distintos (ANOM-CART-08).

---

### TC-CART-GEST-003: Agregar un producto desde la página de detalle

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío.

**Steps**:
1. Navegar a `product.php?id=1`.
2. Clic en `add-to-cart-1`.
3. Navegar a `cart.php`.

**Expected result**: `header-cart-count` = "1"; existe `cart-row-1` con `cart-item-price-1` = "$100" y cantidad 1.

---

### TC-CART-GEST-004: Productos de distintas categorías se acumulan en el mismo carrito

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío.

**Steps**:
1. En `mens-wear.php`, clic dos veces en `add-to-cart-21` y una vez en `add-to-cart-22`.
2. En `electronics.php`, clic en `add-to-cart-61`.
3. En `product.php?id=1`, clic en `add-to-cart-1`.
4. Navegar a `cart.php`.

**Expected result**: 4 filas en orden de inserción (`cart-row-21`, `-22`, `-61`, `-1`); `header-cart-count` = "4"; `cart-total` = "Total: $1050".

**Notes**: RN-CART-001, RN-CART-007, RN-CART-012.

---

### TC-CART-GEST-005: La tabla del carrito muestra columnas, precio y subtotal por línea

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]`.

**Steps**:
1. Navegar a `cart.php`.

**Expected result**: El título de la página contiene "Cart"; `breadcrumb-current` = "Cart"; encabezados de `cart-table` = Products, Price, Quantity, Total, Remove; `cart-item-name-21` contiene "Black T-Shirt", `cart-item-price-21` = "$150", `cart-qty-21` = "2", `cart-item-total-21` = "$300"; `cart-item-total-22` = "$500"; `cart-total` = "Total: $800"; `proceed-to-checkout-btn` visible.

**Notes**: RN-CART-003, RN-CART-007.

---

### TC-CART-GEST-006: Actualizar la cantidad recalcula subtotal y total

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]` en `cart.php`.

**Steps**:
1. Escribir `3` en `cart-qty-22` y presionar Tab.

**Expected result**: `cart-item-total-22` = "$1500"; `cart-total` = "Total: $1800"; `header-cart-count` sigue en "2".

**Notes**: RN-CART-004. El recálculo ocurre en el evento `change`, no mientras se escribe.

---

### TC-CART-GEST-007: La cantidad modificada persiste al recargar la página

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con id 22 en `cart.php`.

**Steps**:
1. Cambiar `cart-qty-22` a `2` y presionar Tab.
2. Recargar `cart.php`.

**Expected result**: Tras recargar, `cart-qty-22` = "2" y `cart-item-total-22` = "$1000".

---

### TC-CART-GEST-008: Una cantidad negativa se normaliza a 1

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con id 22 en `cart.php`.

**Steps**:
1. Escribir `-2` en `cart-qty-22` y presionar Tab.

**Expected result**: `cart-qty-22` = "1"; `cart-item-total-22` = "$500". No se muestra mensaje de error.

**Notes**: RN-CART-005.

---

### TC-CART-GEST-009: Una cantidad 0 no debe aceptarse

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]` en `cart.php`.

**Steps**:
1. Escribir `0` en `cart-qty-22` y presionar Tab.

**Expected result**: La cantidad mínima se respeta: `cart-qty-22` = "1" y `cart-item-total-22` = "$500" (spec RN-CART-005).

**Notes**: **Comportamiento observado**: la app guarda `qty: 0`, muestra subtotal "$0" y "Total: $300" y la línea permanece en el carrito (ANOM-CART-01, candidato a DEF). Automatizar con la aserción del spec y `test.fail()` una vez exista el archivo DEF.

---

### TC-CART-GEST-010: Cantidad vacía o decimal se normaliza a 1

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con id 22 (qty 3) en `cart.php`.

**Steps**:
1. Parametrizado con los valores `` (vacío) y `1.5`: escribir el valor en `cart-qty-22` y presionar Tab.

**Expected result**: En ambos casos `cart-qty-22` = "1" y `cart-item-total-22` = "$500".

**Notes**: RN-CART-006.

---

### TC-CART-GEST-011: Se acepta una cantidad alta sin límite máximo

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con solo id 22 en `cart.php`.

**Steps**:
1. Escribir `999` en `cart-qty-22` y presionar Tab.

**Expected result**: `cart-item-total-22` = "$499500" y `cart-total` = "Total: $499500".

**Notes**: RN-CART-004. No existe límite de stock en la demo.

---

### TC-CART-GEST-012: Eliminar un producto actualiza tabla, total y contador

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,2},{61,1},{1,1}]` en `cart.php` ("Total: $1550").

**Steps**:
1. Clic en `cart-remove-1`.

**Expected result**: Desaparece `cart-row-1`; quedan 3 filas; `cart-total` = "Total: $1450"; `header-cart-count` = "3". No se pide confirmación.

**Notes**: RN-CART-008.

---

### TC-CART-GEST-013: Eliminar el último producto muestra el estado de carrito vacío

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con solo id 21 en `cart.php`; `proceed-to-checkout-btn` visible.

**Steps**:
1. Clic en `cart-remove-21`.

**Expected result**: `cart-empty-message` = "Your Cart is Empty" visible; `cart-total` = "Total: $0"; `header-cart-count` = "0"; `proceed-to-checkout-btn` oculto.

**Notes**: RN-CART-009.

---

### TC-CART-GEST-014: Carrito vacío al cargar la página

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; `localStorage.cart` inexistente.

**Steps**:
1. Navegar a `cart.php`.

**Expected result**: `cart-empty-message` = "Your Cart is Empty"; `start-shopping-btn` visible; `cart-total` = "Total: $0"; `header-cart-count` = "0"; `proceed-to-checkout-btn` oculto.

**Notes**: RN-CART-009.

---

### TC-CART-GEST-015: Navegación de retorno a la tienda desde el carrito

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío.

**Steps**:
1. En `cart.php`, clic en `start-shopping-btn`.
2. Volver a `cart.php` y clic en `go-back-btn` ("Go To Back").

**Expected result**: Ambos clics navegan a `shop.php`.

---

### TC-CART-GEST-016: "Proceed To Checkout" lleva al checkout con el carrito actual

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]`.

**Steps**:
1. En `cart.php`, clic en `proceed-to-checkout-btn`.

**Expected result**: Se navega a `checkout.php`; `order-total` = "$800"; existen `checkout-cart-row-21` (qty 2, "$300") y `checkout-cart-row-22` (qty 1, "$500").

**Notes**: Enlace con el submódulo CHK (FL-CART-004).

---

### TC-CART-GEST-017: Visitante sin sesión es redirigido al login

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Contexto de navegador nuevo, sin `isLoggedIn` en `localStorage`.

**Steps**:
1. Navegar directamente a `cart.php`.

**Expected result**: El navegador termina en `index.php`.

**Notes**: RN-CART-010. El servidor responde HTTP 200 con el HTML: la protección es solo JavaScript (ver ANOM-AUTH-02).

---

### TC-CART-GEST-018: El carrito es propio del navegador y sobrevive al logout

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Dos contextos de navegador A y B, ambos con sesión de la misma cuenta demo.

**Steps**:
1. En A, agregar `add-to-cart-23`.
2. En B, abrir `cart.php`.
3. En A, clic en `header-logout-btn`, volver a iniciar sesión y abrir `cart.php`.

**Expected result**: En B se ve "Your Cart is Empty" y contador "0". En A, tras logout y nuevo login, `cart-row-23` sigue presente (el logout solo borra `isLoggedIn`).

**Notes**: RN-CART-011. Paso 3 (reaparición tras nuevo login) deducido de `localStorage.cart` conservado después del logout; verificar al automatizar.
