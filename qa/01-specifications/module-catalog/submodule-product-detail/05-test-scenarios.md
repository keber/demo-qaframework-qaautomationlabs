# Escenarios de prueba - Catálogo: Detalle de producto

**Código de módulo**: CAT
**Código de submódulo**: DETAIL
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|----------|-------|-----------|--------|
| P0 | 1 | 1 | 0 |
| P1 | 4 | 4 | 0 |
| P2 | 3 | 3 | 0 |
| P3 | 0 | 0 | 0 |
| **Total** | **8** | **8** | **0** |

---

### TC-CAT-DETAIL-001: Usuario sin sesión es redirigido al login al abrir un detalle

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Contexto sin `storageState`.

**Steps**:
1. Navegar a `/product.php?id=21`.

**Expected result**: La URL final es `/index.php`; `product-detail` no es visible.

**Notes**: RN-CAT-030.

---

### TC-CAT-DETAIL-002: El detalle muestra nombre, precio e imagen consistentes con el listado

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada.

**Steps**:
1. En `/electronics.php`, leer nombre, precio y `src` de imagen del producto 70.
2. Clic en `product-name-70`.
3. Leer `product-detail-name`, `product-detail-price` y `product-detail-image`.

**Expected result**: "LG UHD AI TV", "$180" e imagen `products/Electronics/e-10.jpg` cargada, iguales en listado y detalle.

**Notes**: RN-CAT-031. Parametrizable con un id de ropa (21 o 23).

---

### TC-CAT-DETAIL-003: Breadcrumb del detalle muestra "Home" y "Product Details"

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/product.php?id=23`.

**Steps**:
1. Leer `breadcrumb`.

**Expected result**: Texto "Home Product Details" (espacios normalizados).

**Notes**: RN-CAT-033.

---

### TC-CAT-DETAIL-004: "Go To Back" del detalle navega a shop.php

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/product.php?id=70`.

**Steps**:
1. Clic en `go-back-btn`.

**Expected result**: URL `/shop.php`.

**Notes**: RN-CAT-034.

---

### TC-CAT-DETAIL-005: "Add to Cart" en el detalle actualiza el badge sin salir de la página

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada; carrito vacío; en `/product.php?id=23`.

**Steps**:
1. Leer `header-cart-count`.
2. Clic en `add-to-cart-23`.

**Expected result**: El badge pasa de "0" a "1"; `localStorage.cart` contiene `{ id: 23, qty: 1 }`; la URL sigue siendo `/product.php?id=23`.

**Notes**: RN-CAT-035. Limpiar `localStorage.cart` al final.

---

### TC-CAT-DETAIL-006: Producto inexistente muestra "Product not found"

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada.

**Steps**:
1. Navegar a `/product.php?id=99999` (o un id fuera de rango generado con EXEC_IDX).

**Expected result**: `product-detail` contiene "Product not found"; no existen `product-detail-name`, `product-detail-price` ni `add-to-cart-*`.

**Notes**: RN-CAT-032.

---

### TC-CAT-DETAIL-007: id no numérico o ausente muestra "Product not found"

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada.

**Steps**:
1. Navegar a `/product.php?id=abc`.
2. Navegar a `/product.php`.

**Expected result**: En ambos casos `product-detail` muestra "Product not found".

**Notes**: RN-CAT-032.

---

### TC-CAT-DETAIL-008: id con caracteres HTML es rechazado sin renderizar contenido

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Security |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Ninguna.

**Steps**:
1. Hacer `GET /product.php?id=%3Cscript%3E` (por ejemplo con `request` de Playwright).

**Expected result**: La respuesta no refleja el valor del parámetro como HTML; observado: HTTP 403 "Forbidden".

**Notes**: Verificación defensiva básica de entrada, no prueba de penetración. Cualquier análisis de seguridad adicional debe derivarse al proceso formal de ciberseguridad.
