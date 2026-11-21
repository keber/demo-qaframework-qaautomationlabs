# Escenarios de prueba - Carrito y checkout: Checkout y confirmación de orden

**Código de módulo**: CART
**Código de submódulo**: CHK
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|-----------|----------|----------------|----------|
| P0 | 4 | 4 | 0 |
| P1 | 6 | 6 | 0 |
| P2 | 6 | 6 | 0 |
| P3 | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

| Tipo | Cantidad |
|------|----------|
| Functional | 8 |
| Negative | 11 |
| Security | 1 |

Origen: los 20 TCs son `UI-OBSERVED` (comportamiento ejecutado en la UI el 2026-11-20).

Cobertura obligatoria: acceso sin sesión (TC-020); camino feliz (TC-012, TC-019); campo obligatorio
faltante (TC-002 a TC-004); formato inválido (TC-006 a TC-010); transiciones de estado (TC-012,
TC-016 a TC-019). No aplican: rol sin permiso (rol único), duplicado (no hay entidad con clave
única), exportación, paginación y búsqueda.

Datos de facturación: los de `04-test-data.md` ("datos válidos"), siempre ficticios.

---

### TC-CART-CHK-001: El checkout muestra el resumen del carrito y el total

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
1. Navegar a `checkout.php`.

**Expected result**: Título contiene "Checkout"; `breadcrumb-current` = "Checkout"; `order-total` = "$800"; `checkout-cart-row-21` muestra "Black T-Shirt", "$150", "2", "$300" y `checkout-cart-row-22` muestra "White T-Shirt", "$500", "1", "$500"; los 9 campos del formulario están vacíos.

**Notes**: RN-CART-023.

---

### TC-CART-CHK-002: Enviar el formulario vacío muestra solo el error del primer campo

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Clic en `continue-btn` sin completar ningún campo.

**Expected result**: `checkout-firstname-error` = "Please enter your first name." es el único error visible; la URL sigue en `checkout.php`.

**Notes**: RN-CART-014.

---

### TC-CART-CHK-003: Cada campo obligatorio vacío muestra su mensaje

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Parametrizado por campo obligatorio (First Name, Last Name, E-mail, Mobile No., Address, State, City, Pin Code): completar todos los campos con datos válidos excepto el campo bajo prueba.
2. Clic en `continue-btn`.

**Expected result**: Se muestra solo el error del campo vacío con el texto exacto de RN-CART-013 (por ejemplo `checkout-city-error` = "Please enter your city.") y la URL sigue en `checkout.php`.

**Notes**: RN-CART-013. Observado completando los campos uno a uno en orden.

---

### TC-CART-CHK-004: First Name con solo espacios se considera vacío

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Completar datos válidos y escribir `   ` (3 espacios) en `checkout-firstname-input`.
2. Clic en `continue-btn`.

**Expected result**: `checkout-firstname-error` = "Please enter your first name."; sin navegación.

---

### TC-CART-CHK-005: Los errores se ocultan al escribir en un campo

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- En `checkout.php` con `checkout-firstname-error` visible (tras TC-002).

**Steps**:
1. Escribir `Prueba` en `checkout-firstname-input`.

**Expected result**: Ningún elemento `checkout-*-error` queda visible.

**Notes**: RN-CART-015.

---

### TC-CART-CHK-006: Email con formato inválido muestra el mensaje propio

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Completar datos válidos con E-mail `abc@x`.
2. Clic en `continue-btn`.

**Expected result**: `checkout-email-error` = "Please enter a valid email address."; sin navegación.

**Notes**: RN-CART-016.

---

### TC-CART-CHK-007: Email sin "@" o con espacios es bloqueado por la validación nativa

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Parametrizado con `abc` y `a b@x.com`: completar datos válidos con ese E-mail.
2. Clic en `continue-btn`.

**Expected result**: La URL sigue en `checkout.php`; `checkout-email-input` tiene `validity.valid = false`; no se muestra mensaje propio.

**Notes**: RN-CART-016. Asertar sobre `validity` y no sobre el texto del globo nativo, que depende del navegador e idioma.

---

### TC-CART-CHK-008: Teléfono con longitud distinta de 10 es rechazado

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Parametrizado con `123456789` (9) y `12345678901` (11): completar datos válidos con ese teléfono.
2. Clic en `continue-btn`.

**Expected result**: `checkout-phone-error` = "Phone Number Should be 10 digit long."; sin navegación.

**Notes**: RN-CART-017.

---

### TC-CART-CHK-009: El teléfono no admite letras

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- En `checkout.php`.

**Steps**:
1. Escribir `abc` tecla a tecla en `checkout-phone-input`.

**Expected result**: El valor del campo queda vacío.

**Notes**: RN-CART-017. `0000000000` es aceptado (ANOM-CART-06, recomendación; no es TC negativo porque ninguna regla lo prohíbe).

---

### TC-CART-CHK-010: Pin Code 0 o negativo es bloqueado por la validación nativa

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Parametrizado con `0` y `-5`: completar datos válidos con ese Pin Code.
2. Clic en `continue-btn`.

**Expected result**: La URL sigue en `checkout.php`; `checkout-pincode-input` tiene `validity.valid = false`.

**Notes**: RN-CART-018.

---

### TC-CART-CHK-011: Middle Name es opcional

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito con productos; en `checkout.php`.

**Steps**:
1. Completar todos los campos obligatorios con datos válidos y dejar `checkout-middlename-input` vacío.
2. Clic en `continue-btn`.

**Expected result**: Se navega a `confirm.php`; `confirm-middlename` está en blanco (texto recortado vacío).

**Notes**: RN-CART-013, RN-CART-019.

---

### TC-CART-CHK-012: Checkout exitoso muestra la confirmación con los datos ingresados

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]`; en `checkout.php`.

**Steps**:
1. Completar los 9 campos con los datos válidos de `04-test-data.md`.
2. Clic en `continue-btn`.

**Expected result**: URL `confirm.php`; título contiene "Order Confirmation"; `breadcrumb-current` = "Confirm Details"; cada `confirm-*` (recortado) coincide con el valor ingresado (State en `confirm-state`); `localStorage.user` contiene las claves `firstname, middlename, lastname, email, phone, address, states, city, pincode`.

**Notes**: RN-CART-019, RN-CART-020, RN-CART-021. Los valores se muestran con un espacio inicial.

---

### TC-CART-CHK-013: La confirmación muestra el mismo resumen y total que el carrito

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Llegada a `confirm.php` por TC-012 con carrito `[{21,2},{22,1}]`.

**Steps**:
1. Leer `order-total` y las filas `confirm-cart-row-{id}`.

**Expected result**: `order-total` = "$800"; `confirm-cart-row-21` = "Black T-Shirt", "$150", "2", "$300"; `confirm-cart-row-22` = "White T-Shirt", "$500", "1", "$500".

**Notes**: RN-CART-023.

---

### TC-CART-CHK-014: "Go To Back" desde la confirmación vuelve al checkout

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- En `confirm.php` tras un checkout exitoso.

**Steps**:
1. Clic en `go-back-btn`.

**Expected result**: Se navega a `checkout.php` y el resumen del carrito se mantiene.

**Notes**: RN-CART-022. El formulario aparece vacío (ANOM-CART-07, recomendación); no asertar el precargado.

---

### TC-CART-CHK-015: "Go To Back" desde el checkout vuelve al carrito sin cambios

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito `[{21,2},{22,1}]`; en `checkout.php`.

**Steps**:
1. Clic en `go-back-btn`.

**Expected result**: Se navega a `cart.php` con las mismas 2 filas y "Total: $800".

**Notes**: FL-CART-006. `href="cart.php"` verificado en el HTML.

---

### TC-CART-CHK-016: No se puede completar una orden con el carrito vacío

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; `localStorage.cart` vacío.

**Steps**:
1. Navegar directamente a `checkout.php`.
2. Completar datos válidos y clic en `continue-btn`.

**Expected result**: El checkout se impide (no se navega a `confirm.php` ni se puede llegar a la orden exitosa) (spec RN-CART-025).

**Notes**: **Comportamiento observado**: `order-total` = "$0", sin filas; "Continue" navega a `confirm.php` y "Place Order" muestra la orden como exitosa (ANOM-CART-02, candidato a DEF). Automatizar con la aserción del spec y `test.fail()` una vez exista el archivo DEF.

---

### TC-CART-CHK-017: confirm.php no es accesible sin un checkout completado

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; sin `localStorage.user`.

**Steps**:
1. Navegar directamente a `confirm.php`.

**Expected result**: Redirección a `checkout.php` (spec RN-CART-026); nunca se muestra el texto "undefined".

**Notes**: **Comportamiento observado**: se muestra `confirm.php` con "undefined" en los 9 datos y "$0" (ANOM-CART-03, candidato a DEF).

---

### TC-CART-CHK-018: thanks.php no anuncia una orden que no se realizó

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío y sin `localStorage.user`.

**Steps**:
1. Navegar directamente a `thanks.php`.

**Expected result**: No se muestra `order-success-message` "Your order has been placed successfully." (spec RN-CART-026).

**Notes**: **Comportamiento observado**: se muestra "🎉 Thank You for Your Order!" (ANOM-CART-03, candidato a DEF). Además, una visita a `thanks.php` con carrito lleno lo vacía sin pasar por el checkout (deducido del código).

---

### TC-CART-CHK-019: Realizar la orden muestra el éxito y vacía el carrito

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- En `confirm.php` tras un checkout exitoso con carrito `[{21,2},{22,1}]`.

**Steps**:
1. Clic en `place-order-btn`.
2. Clic en `shop-again-btn`.

**Expected result**: Paso 1: URL `thanks.php`, título contiene "Thank You", `breadcrumb-current` = "Thanks", `order-success-title` contiene "Thank You for Your Order!", `order-success-message` = "Your order has been placed successfully."; `localStorage.cart` y `localStorage.user` son `null`. Paso 2: URL `shop.php` y `header-cart-count` = "0".

**Notes**: RN-CART-024. La orden no genera petición al servidor (solo `GET /thanks.php`).

---

### TC-CART-CHK-020: Las páginas del checkout redirigen al login sin sesión

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar al automatizar) |

**Preconditions**:
- Contexto de navegador nuevo sin `isLoggedIn`.

**Steps**:
1. Parametrizado: navegar directamente a `checkout.php`, `confirm.php` y `thanks.php`.

**Expected result**: En los tres casos el navegador termina en `index.php`.

**Notes**: RN-CART-027. El servidor responde HTTP 200; la protección es solo JavaScript.
