# MÓDULO: Catálogo - Submódulo: Detalle de producto

| Campo | Valor |
|-------|-------|
| Código de módulo | CAT |
| Código de submódulo | DETAIL |
| URL principal | https://shop.qaautomationlabs.com/product.php?id={id} |
| Título de página | "Product Details - E-commerce Demo for UI Automation Practice \| QA Automation Labs" (el original usa guion largo) |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Elementos de UI

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Cabecera | `site-header`, `header-cart-count`, ... | - | Igual que en SHOP |
| Breadcrumb | `breadcrumb`, `breadcrumb-home`, `breadcrumb-current` | nav | Texto "Home Product Details"; Home -> `https://shop.qaautomationlabs.com/` (H-CAT-03) |
| Botón volver | `go-back-btn` | enlace | "Go To Back", `href="shop.php"` (no vuelve a la categoría de origen) |
| Contenedor de detalle | `product-detail` | contenedor | Con id inexistente muestra solo "Product not found" |
| Imagen | `product-detail-image` | img | `src` igual al del listado, `alt` = nombre |
| Nombre | `product-detail-name` | h3 | |
| Precio | `product-detail-price` | texto | Formato `$N` |
| Texto adicional | (sin testid) | texto | "(99 Reviews)" y descripción de relleno (lorem ipsum) iguales para todos los productos |
| Agregar al carrito | `add-to-cart-{id}` | botón | Mismo comportamiento que en el listado (submódulo BADGE) |

## Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /product.php?id={id} | Documento HTML; HTTP 200 también con id inexistente o ausente |
| GET | /js/products.js | Fuente de datos del detalle |

Con caracteres HTML en `id` (por ejemplo `<script>` codificado en la URL) el servidor responde HTTP 403 "Forbidden" (filtro tipo WAF delante de la aplicación).

## Errores de consola observados

- `$(...).owlCarousel is not a function` (H-CAT-02).
