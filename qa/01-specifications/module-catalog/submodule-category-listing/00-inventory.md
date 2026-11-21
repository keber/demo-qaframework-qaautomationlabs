# MÓDULO: Catálogo - Submódulo: Listado por categoría

| Campo | Valor |
|-------|-------|
| Código de módulo | CAT |
| Código de submódulo | LIST |
| URL principal | https://shop.qaautomationlabs.com/mens-wear.php (también `womens-wear.php`, `kids-wear.php`, `electronics.php`) |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Páginas de categoría (observado)

| Página | Breadcrumb actual | Productos | IDs | Filtro "Type" | Tercer grupo de filtros | Filtro de color |
|--------|------------------|-----------|-----|---------------|-------------------------|-----------------|
| `mens-wear.php` | "Mens Wear" | 20 | 21-40 | Formal, Footwear | Size: S, M, L, XL, XXL | Sí (Black, White, Red, Blue, Green) |
| `womens-wear.php` | "Womens Wear" | 20 | 1-20 | Formal, Footwear | Size | Sí |
| `kids-wear.php` | "Kids Wear" | 20 | 41-60 | Formal, Footwear | Size | Sí |
| `electronics.php` | "Electronics" | 25 | 61-85 | Mobile, Laptop, Fridge, TV, Monitor | Brand: Samsung, LG, Panasonic, Toshiba, Sony | No (comentado en el HTML) |

## Elementos de UI

| Elemento | data-testid | Tipo | Requerido | Notas |
|----------|-------------|------|----------|-------|
| Breadcrumb | `breadcrumb`, `breadcrumb-home`, `breadcrumb-current` | nav | - | `breadcrumb-home` apunta a `https://shop.qaautomationlabs.com/` (H-CAT-03) |
| Botón volver | `go-back-btn` | enlace | - | Texto "Go To Back", `href="shop.php"` |
| Filtro tipo | `filter-type-{formal\|footwear\|mobile\|laptop\|fridge\|tv\|monitor}` | checkbox | No | Clase `subcat` |
| Filtro precio | `filter-price-0-100`, `filter-price-101-200`, `filter-price-201-300`, `filter-price-301-400`, `filter-price-401-500` | checkbox | No | Rangos inclusivos; etiquetas "$0 - $100", etc. |
| Filtro talla (ropa) | `filter-size-{s\|m\|l\|xl\|xxl}` | checkbox | No | Etiquetas Small ... Double Extra Large |
| Filtro marca (Electronics) | `filter-brand-{samsung\|lg\|panasonic\|toshiba\|sony}` | checkbox | No | Reutiliza clase `size` e ids `size-N` (H-CAT-09) |
| Filtro color (ropa) | `filter-color-{black\|white\|red\|blue\|green}` | checkbox | No | No existe Yellow (H-CAT-08) |
| Barra de herramientas | `shop-toolbar` | contenedor | - | |
| Búsqueda | `search-input` | text | No | Placeholder "Search products"; filtra en cada tecla (evento `input`) |
| Ordenar | `sort-select` | select | No | Opciones: "Sort by" (vacío), "Price: Low to High", "Price: High to Low", "Name: A to Z", "Name: Z to A" |
| Contador de resultados | `results-count` | texto | - | "N products" / "1 product" |
| Lista | `product-list` | contenedor | - | |
| Tarjeta | `product-card-{id}` | tarjeta | - | |
| Imagen | `product-image-{id}` | img | - | `alt` = nombre; ruta `products/{men\|women\|kids\|Electronics}/...` |
| Nombre | `product-name-{id}` | enlace | - | `href="product.php?id={id}"` |
| Precio | `product-price-{id}` | h5 | - | Formato `$N` (entero) |
| Meta (ropa) | `product-meta-{id}` | small | - | "Size: X \| Color: Y" |
| Meta (Electronics) | (sin testid) | small | - | "Model: {marca}" (H-CAT-09) |
| Categoría | `product-category-{id}` | small | - | "{Categoría} - {Tipo}", p. ej. "Men - Formal" |
| Agregar al carrito | `add-to-cart-{id}` | botón | - | Texto "Add to Cart"; ver submódulo BADGE |
| Sin resultados | `no-products-message` | alerta | - | Texto "No products found", `role="alert"` |

## Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /{categoría}.php | Documento HTML |
| GET | /js/products.js | Catálogo estático de 85 productos (`window.PRODUCTS`) |

Filtros, búsqueda y orden no generan tráfico de red: se calculan en el cliente sobre `window.PRODUCTS`.

## Errores de consola observados

- `loadProducts is not defined` en las 4 páginas de categoría (H-CAT-01).

## Nota de automatización

Los checkboxes son `custom-control-input` de Bootstrap: el `<label>` intercepta el clic. `check()` falla con
"label intercepts pointer events"; usar `check({ force: true })` o hacer clic en el `label[for=...]`.
