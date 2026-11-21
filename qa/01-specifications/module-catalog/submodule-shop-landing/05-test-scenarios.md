# Escenarios de prueba - Catálogo: Inicio de tienda y navegación

**Código de módulo**: CAT
**Código de submódulo**: SHOP
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|----------|-------|-----------|--------|
| P0 | 2 | 2 | 0 |
| P1 | 5 | 5 | 0 |
| P2 | 2 | 2 | 0 |
| P3 | 1 | 1 | 0 |
| **Total** | **10** | **10** | **0** |

---

### TC-CAT-SHOP-001: Usuario sin sesión es redirigido al login al abrir shop.php

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto de navegador sin `storageState` ni `localStorage`.

**Steps**:
1. Navegar a `/shop.php`.
2. Esperar la carga completa.

**Expected result**: La URL final es `/index.php` y se ve `login-form`.

**Notes**: RN-CAT-001. Repetir con `mens-wear.php` y `electronics.php` (parametrizable).

---

### TC-CAT-SHOP-002: Usuario con sesión ve las 4 tarjetas de categoría

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada con `QA_USER_EMAIL` / `QA_USER_PASSWORD`.

**Steps**:
1. Navegar a `/shop.php`.
2. Leer `category-title-men`, `category-title-women`, `category-title-kids`, `category-title-electronics`.

**Expected result**: Los 4 títulos son visibles con los textos "Men Fashion", "Women Fashion", "Kids Fashion" y "Electronics"; cada tarjeta tiene su botón "Shop Now".

**Notes**: RN-CAT-002.

---

### TC-CAT-SHOP-003: "Shop Now" de cada categoría navega a su página

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/shop.php`.

**Steps**:
1. Clic en `shop-now-mens-wear`; verificar URL y breadcrumb.
2. Volver a `/shop.php` y repetir con `shop-now-womens-wear`, `shop-now-kids-wear`, `shop-now-electronics`.

**Expected result**: URLs `mens-wear.php`, `womens-wear.php`, `kids-wear.php`, `electronics.php`; `breadcrumb-current` muestra "Mens Wear", "Womens Wear", "Kids Wear", "Electronics" respectivamente.

**Notes**: RN-CAT-003. Parametrizar por categoría.

---

### TC-CAT-SHOP-004: El logo de la cabecera vuelve a shop.php desde una categoría

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/mens-wear.php`.

**Steps**:
1. Clic en `header-logo-link`.

**Expected result**: La URL es `/shop.php` y se ven las 4 tarjetas de categoría.

**Notes**: RN-CAT-004.

---

### TC-CAT-SHOP-005: El enlace "Shop" de la navegación vuelve a shop.php y está marcado como activo

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; viewport de escritorio de al menos 1350 px de ancho; en `/kids-wear.php`.

**Steps**:
1. Verificar que `nav-shop` tiene la clase `active`.
2. Clic en `nav-shop`.

**Expected result**: La URL es `/shop.php`.

**Notes**: RN-CAT-004. Bajo 1350 px el menú está colapsado detrás de un botón hamburguesa sin `data-testid`.

---

### TC-CAT-SHOP-006: Breadcrumb de shop.php muestra "Home" y "Shop"

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/shop.php`.

**Steps**:
1. Leer el texto de `breadcrumb`.
2. Clic en `breadcrumb-home`.

**Expected result**: El texto contiene "Home" y "Shop"; tras el clic la página sigue en `/shop.php` (el enlace es `#`).

**Notes**: RN-CAT-005.

---

### TC-CAT-SHOP-007: El badge del carrito es visible en shop.php y refleja el carrito vacío

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; `localStorage.cart` ausente o `[]`.

**Steps**:
1. Navegar a `/shop.php`.
2. Leer `header-cart-count`.

**Expected result**: El badge es visible y muestra "0".

**Notes**: RN-CAT-040. Comportamiento detallado en submódulo BADGE.

---

### TC-CAT-SHOP-008: El enlace del carrito en la cabecera navega a cart.php

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Integration |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/shop.php`.

**Steps**:
1. Clic en `header-cart-link`.

**Expected result**: La URL es `/cart.php`; el contenido del carrito se valida en el módulo CART.

**Notes**: Frontera con el módulo CART.

---

### TC-CAT-SHOP-009: Logout desde el catálogo impide volver a shop.php

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/mens-wear.php`.

**Steps**:
1. Clic en `header-logout-btn`.
2. Navegar directamente a `/mens-wear.php`.

**Expected result**: Tras el paso 1 la URL es `/index.php`; tras el paso 2 se redirige nuevamente a `/index.php`.

**Notes**: RN-CAT-001. El logout en sí pertenece al módulo AUTH; aquí se valida el efecto sobre el catálogo.

---

### TC-CAT-SHOP-010: La búsqueda de la cabecera envía al sitio externo y no filtra el catálogo

| Campo | Valor |
|-------|-------|
| Priority | P3 |
| Type | Integration |
| Origin | UI-OBSERVED |
| Automation | Partial |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; en `/shop.php`.

**Steps**:
1. Verificar que el formulario que contiene `header-search` tiene `action="https://qaautomationlabs.com/"` y `method="get"`.

**Expected result**: El destino de la búsqueda de cabecera es el sitio externo; no existe `search-input` en `shop.php`.

**Notes**: RN-CAT-006. Se verificó el atributo `action`; no se envió el formulario para no depender de un sitio externo. Automatizar solo la verificación del atributo.
