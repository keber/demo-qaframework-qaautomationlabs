# Escenarios de prueba - Catálogo: Listado por categoría

**Código de módulo**: CAT
**Código de submódulo**: LIST
**Última actualización**: 2026-11-20

## Resumen

| Prioridad | Cantidad | Automatizables | Manuales |
|----------|-------|-----------|--------|
| P0 | 2 | 2 | 0 |
| P1 | 10 | 10 | 0 |
| P2 | 8 | 8 | 0 |
| P3 | 0 | 0 | 0 |
| **Total** | **20** | **20** | **0** |

Precondición común (salvo TC-CAT-LIST-001): sesión iniciada con `QA_USER_EMAIL` / `QA_USER_PASSWORD`
(`<PLACEHOLDER>`). Para marcar filtros usar `check({ force: true })` o clic en el label.

---

### TC-CAT-LIST-001: Usuario sin sesión es redirigido al login al abrir una categoría

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
1. Navegar a `/mens-wear.php` (parametrizar con las 4 categorías).

**Expected result**: La URL final es `/index.php`; no se ven tarjetas `product-card-*`.

**Notes**: RN-CAT-001.

---

### TC-CAT-LIST-002: Cada categoría lista solo sus productos con el total correcto

| Campo | Valor |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada.

**Steps**:
1. Navegar a la categoría (Men, Women, Kids, Electronics).
2. Contar `product-card-*` y leer `results-count`.
3. Leer todos los `product-category-*`.

**Expected result**: Men 20 (ids 21-40), Women 20 (ids 1-20), Kids 20 (ids 41-60), Electronics 25 (ids 61-85); `results-count` = "{N} products"; todas las líneas de categoría empiezan con la categoría de la página.

**Notes**: RN-CAT-010, RN-CAT-012. Calcular el esperado desde `window.PRODUCTS` (ver 04-test-data).

---

### TC-CAT-LIST-003: La tarjeta de producto muestra nombre, precio, categoría, meta y botón

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Leer `product-name-21`, `product-price-21`, `product-category-21`, `product-meta-21`, `add-to-cart-21`.

**Expected result**: "Black T-Shirt", "$150", "Men - Formal", "Size: S | Color: Black", botón con texto "Add to Cart"; el nombre tiene `href="product.php?id=21"`.

**Notes**: RN-CAT-011. En Electronics la meta es "Model: {marca}" sin `data-testid` (H-CAT-09).

---

### TC-CAT-LIST-004: Todas las imágenes de producto cargan y tienen texto alternativo

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- Sesión iniciada.

**Steps**:
1. En cada categoría, evaluar para cada `product-image-*`: `complete && naturalWidth > 0` y el atributo `alt`.

**Expected result**: 0 imágenes rotas; `alt` igual al nombre del producto.

**Notes**: RN-CAT-011.

---

### TC-CAT-LIST-005: Filtrar por un tipo muestra solo productos de ese tipo

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Marcar `filter-type-footwear`.

**Expected result**: `results-count` = "10 products"; se muestran los ids 31-40 y todos los `product-category-*` dicen "Men - Footwear".

**Notes**: RN-CAT-014.

---

### TC-CAT-LIST-006: Dos rangos de precio se combinan con OR

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Marcar `filter-price-0-100`.
2. Marcar `filter-price-101-200`.

**Expected result**: Paso 1: "2 products" (ambos $100). Paso 2: "5 products", todos con precio entre $0 y $200.

**Notes**: RN-CAT-013.

---

### TC-CAT-LIST-007: Filtros de grupos distintos se combinan con AND

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Marcar `filter-type-footwear`.
2. Marcar `filter-color-white`.

**Expected result**: "4 products": White Sports Shoes (2), White Sport Shoes, White Canvas Shoes; todos con "Color: White" y tipo Footwear.

**Notes**: RN-CAT-014.

---

### TC-CAT-LIST-008: Combinación sin coincidencias muestra "No products found"

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Marcar `filter-type-footwear`, `filter-color-white` y `filter-size-s`.

**Expected result**: `no-products-message` visible con el texto "No products found"; `results-count` = "0 products"; no hay `product-card-*`.

**Notes**: RN-CAT-016.

---

### TC-CAT-LIST-009: Desmarcar todos los filtros restaura el listado completo

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php` con `filter-price-0-100` y `filter-price-101-200` marcados.

**Steps**:
1. Desmarcar ambos filtros.

**Expected result**: "20 products" y `no-products-message` ausente.

**Notes**: RN-CAT-012.

---

### TC-CAT-LIST-010: Búsqueda sin distinción de mayúsculas y con recorte de espacios

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Escribir "black" en `search-input`.
2. Reemplazar por "  BLACK  ".

**Expected result**: En ambos casos "8 products" y todos los nombres contienen "Black".

**Notes**: RN-CAT-015.

---

### TC-CAT-LIST-011: La búsqueda se limita a la categoría actual

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Escribir "Frock" (nombre que existe en Women y Kids).
2. Escribir un término inexistente generado con EXEC_IDX (p. ej. "zz-{EXEC_IDX}").

**Expected result**: En ambos casos "0 products" y "No products found".

**Notes**: RN-CAT-015, RN-CAT-016.

---

### TC-CAT-LIST-012: Limpiar la búsqueda restaura el listado

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php` con "pant" en `search-input` ("6 products").

**Steps**:
1. Vaciar `search-input`.

**Expected result**: "20 products".

**Notes**: RN-CAT-015.

---

### TC-CAT-LIST-013: Ordenar por precio ascendente y descendente

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php`.

**Steps**:
1. Seleccionar "Price: Low to High" en `sort-select`.
2. Seleccionar "Price: High to Low".

**Expected result**: Paso 1: la lista de precios es no decreciente (inicia $100, $100, $150). Paso 2: no creciente (inicia $500, $500, $485). El total sigue en 20.

**Notes**: RN-CAT-017. Comparar con la lista completa, no solo con los primeros elementos.

---

### TC-CAT-LIST-014: Ordenar por nombre A-Z, Z-A y volver al orden original

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
1. Seleccionar "Name: A to Z".
2. Seleccionar "Name: Z to A".
3. Seleccionar "Sort by".

**Expected result**: Paso 1: nombres en orden alfabético ascendente (inicia "Black Flotter"). Paso 2: descendente (inicia "White T-Shirt"). Paso 3: orden original por id (inicia "Black T-Shirt", "White T-Shirt", "Green Shirt").

**Notes**: RN-CAT-017.

---

### TC-CAT-LIST-015: Búsqueda, filtro y orden combinados

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
1. Escribir "shoes".
2. Marcar `filter-color-white`.
3. Seleccionar "Price: Low to High".

**Expected result**: "4 products" en el orden White Canvas Shoes ($445), White Sports Shoes ($450), White Sports Shoes ($475), White Sport Shoes ($485).

**Notes**: RN-CAT-014, RN-CAT-015, RN-CAT-017.

---

### TC-CAT-LIST-016: Electronics ofrece filtros de tipo y marca y no de color

| Campo | Valor |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/electronics.php`.

**Steps**:
1. Verificar que existen `filter-type-mobile|laptop|fridge|tv|monitor` y `filter-brand-samsung|lg|panasonic|toshiba|sony`, y que no existe ningún `filter-color-*`.
2. Marcar `filter-brand-sony`.
3. Marcar `filter-type-tv`.

**Expected result**: Paso 2: "5 products", todos con nombre que empieza por "Sony". Paso 3: "1 product" ("Sony Bravia 2 TV").

**Notes**: RN-CAT-019.

---

### TC-CAT-LIST-017: Los rangos de precio incluyen sus límites

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/electronics.php`.

**Steps**:
1. Marcar `filter-price-0-100`.
2. Desmarcar y marcar `filter-price-101-200`.

**Expected result**: Paso 1: "4 products" ($100, $99, $95, $99); el producto de $100 está incluido. Paso 2: ningún precio menor a $101 ni mayor a $200.

**Notes**: RN-CAT-018.

---

### TC-CAT-LIST-018: El contador usa singular con un solo resultado

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/womens-wear.php`.

**Steps**:
1. Escribir "Frock" en `search-input`.

**Expected result**: `results-count` = "1 product".

**Notes**: RN-CAT-012.

---

### TC-CAT-LIST-019: Filtros, búsqueda y orden no persisten al recargar

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/mens-wear.php` con `filter-type-footwear` marcado.

**Steps**:
1. Recargar la página.

**Expected result**: `filter-type-footwear` desmarcado, `search-input` vacío, `sort-select` = "" y "20 products".

**Notes**: RN-CAT-020.

---

### TC-CAT-LIST-020: "Go To Back" y el nombre del producto navegan correctamente

| Campo | Valor |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | (completar tras automatizar) |

**Preconditions**:
- En `/kids-wear.php`.

**Steps**:
1. Clic en `go-back-btn`.
2. Volver a `/mens-wear.php` y hacer clic en `product-name-21`.

**Expected result**: Paso 1: URL `/shop.php`. Paso 2: URL `/product.php?id=21` con `product-detail-name` = "Black T-Shirt".

**Notes**: RN-CAT-021, RN-CAT-022, RN-CAT-023. El enlace "Home" del breadcrumb lleva al login con sesión activa (H-CAT-03); no se crea TC hasta que negocio defina el destino esperado.
