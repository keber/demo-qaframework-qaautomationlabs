# Reglas de negocio - Catálogo: Listado por categoría (LIST)

### RN-CAT-010: Cada página de categoría muestra solo productos de su categoría

- **Type**: Validation
- **Trigger**: Cargar una página de categoría.
- **Behavior**: Se renderizan solo los productos con `category` igual a la página: Men (20), Women (20), Kids (20), Electronics (25). `product-category-{id}` comienza con el nombre de la categoría.
- **Notes**: Observado en las 4 páginas.

### RN-CAT-011: Contenido mínimo de la tarjeta de producto

- **Type**: Validation
- **Trigger**: Render de cada tarjeta.
- **Behavior**: Cada tarjeta muestra imagen cargada (con `alt` = nombre), nombre como enlace a `product.php?id={id}`, precio con formato `$N`, línea de categoría "{Categoría} - {Tipo}" y botón "Add to Cart". En ropa además "Size: X | Color: Y"; en Electronics "Model: {marca}".
- **Notes**: 0 imágenes rotas en las 4 categorías.

### RN-CAT-012: Contador de resultados

- **Type**: Calculation
- **Trigger**: Carga inicial y cada cambio de filtro, búsqueda u orden.
- **Behavior**: `results-count` muestra la cantidad de tarjetas visibles como "N products"; si N = 1, "1 product".

### RN-CAT-013: Filtros dentro de un mismo grupo se combinan con OR

- **Type**: Calculation
- **Trigger**: Marcar 2 o más casillas del mismo grupo (tipo, precio, talla/marca o color).
- **Behavior**: Se muestran los productos que cumplen cualquiera de los valores marcados. Ejemplo observado (Men): "$0 - $100" = 2 productos; "$0 - $100" + "$101 - $200" = 5 productos.

### RN-CAT-014: Filtros de grupos distintos se combinan con AND

- **Type**: Calculation
- **Trigger**: Marcar casillas de 2 o más grupos.
- **Behavior**: Solo se muestran productos que cumplen todos los grupos. Ejemplo observado (Men): Footwear = 10; Footwear + White = 4; Footwear + White + S = 0.

### RN-CAT-015: Búsqueda por nombre, sin distinción de mayúsculas y con recorte de espacios

- **Type**: Validation
- **Trigger**: Escribir en `search-input`.
- **Behavior**: Filtra en cada tecla por `nombre.includes(término)` tras `trim()` y `toLowerCase()`. Busca solo dentro de la categoría actual. Observado (Men): "black" = 8, "  BLACK  " = 8, "pant" = 6, "Frock" = 0.
- **Notes**: No busca por categoría, color ni precio.

### RN-CAT-016: Mensaje cuando no hay resultados

- **Type**: Validation
- **Trigger**: Filtros y/o búsqueda sin coincidencias.
- **Behavior**: Se muestra `no-products-message` y `results-count` = "0 products".
- **Error message**: "No products found"

### RN-CAT-017: Ordenamiento

- **Type**: Calculation
- **Trigger**: Cambiar `sort-select`.
- **Behavior**: "price-asc" ordena por precio ascendente; "price-desc" descendente; "name-asc" A-Z (`localeCompare`); "name-desc" Z-A; "Sort by" (vacío) vuelve al orden original por id. El orden se aplica sobre el conjunto filtrado.

### RN-CAT-018: Rangos de precio inclusivos

- **Type**: Validation
- **Trigger**: Marcar un rango de precio.
- **Behavior**: Incluye productos con `min <= precio <= max`. Un producto de $100 entra en "$0 - $100" y no en "$101 - $200". Observado: Men "$0 - $100" muestra 2 productos de $100; Electronics muestra $100, $99, $95, $99.

### RN-CAT-019: Filtros específicos de Electronics

- **Type**: Validation
- **Trigger**: Cargar `electronics.php`.
- **Behavior**: El filtro de tipo ofrece Mobile, Laptop, Fridge, TV, Monitor; el tercer grupo es "Filter by Brand" (Samsung, LG, Panasonic, Toshiba, Sony); no hay filtro de color. Observado: Sony = 5; Sony + TV = 1 ("Sony Bravia 2 TV").

### RN-CAT-020: El estado de filtros, búsqueda y orden no persiste al recargar

- **Type**: State Machine
- **Trigger**: Recargar la página o navegar fuera y volver.
- **Behavior**: Todas las casillas quedan desmarcadas, la búsqueda vacía, el orden en "Sort by" y se listan todos los productos de la categoría.

### RN-CAT-021: "Go To Back" vuelve a shop.php

- **Type**: Integration
- **Trigger**: Clic en `go-back-btn`.
- **Behavior**: Navega a `shop.php` (enlace fijo, no historial del navegador).

### RN-CAT-022: El nombre del producto enlaza al detalle

- **Type**: Integration
- **Trigger**: Clic en `product-name-{id}`.
- **Behavior**: Navega a `product.php?id={id}` (submódulo DETAIL).

### RN-CAT-023: Breadcrumb de la categoría

- **Type**: Validation
- **Trigger**: Cargar una página de categoría.
- **Behavior**: El breadcrumb muestra "Home" y el nombre de la categoría ("Mens Wear", "Womens Wear", "Kids Wear", "Electronics").
- **Notes**: "Home" lleva a `/` (formulario de login con sesión activa, H-CAT-03).

### RN-CAT-024: Las opciones de filtro dependen de la categoría y del catálogo estático

- **Type**: Dependency
- **Depends on**: Catálogo estático `window.PRODUCTS` (`js/products.js`) y la categoría fija de cada página.
- **Scoping field**: Página de categoría (Men, Women, Kids, Electronics).
- **Upstream validity condition**: Un producto aparece solo si su `category` coincide con la página; sus atributos (`subcategory`, `size`, `color`, `price`) deben coincidir con algún valor de filtro para poder ser alcanzado por él. Productos con color Yellow (ids 8 y 49) no son alcanzables por ningún filtro de color.
- **Real endpoint observed**: `GET /js/products.js` (una vez por página). Cambiar filtros no genera tráfico de red.
- **Values tried**: Men, Women, Kids y Electronics (4 valores); las 4 páginas devolvieron productos.
- **Notes**: Las opciones de filtro están escritas en el HTML de cada página, no se derivan de los datos.
