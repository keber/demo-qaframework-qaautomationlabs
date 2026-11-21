# MÓDULO: Catálogo - Submódulo: Badge del carrito y Add to Cart

| Campo | Valor |
|-------|-------|
| Código de módulo | CAT |
| Código de submódulo | BADGE |
| URL principal | Cabecera de todas las páginas del catálogo (`shop.php`, categorías, `product.php`) |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Elementos de UI

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Enlace al carrito | `header-cart-link` | enlace | `href="cart.php"`, `aria-label="Cart"` |
| Badge | `header-cart-count` | span (`#cartCount`) | Muestra `cart.length`; visible también a 390 px de ancho |
| Badge móvil | (sin testid, `#cartCountmobile`) | span `hidden` | Se actualiza igual pero está oculto |
| Agregar al carrito (listado) | `add-to-cart-{id}` | botón (`.addToCart`, `data-id`) | Texto "Add to Cart"; `aria-label="Add {nombre} to cart"` |
| Agregar al carrito (detalle) | `add-to-cart-{id}` | botón | Mismo comportamiento |

No hay toast, alerta ni cambio de texto del botón tras agregar (H-CAT-10). El `alert("Product Added in Cart")` está comentado en el código.

## Almacenamiento

| Clave `localStorage` | Forma | Escritura |
|---|---|---|
| `cart` | `[{ "id": number, "qty": number }]` | Al hacer clic en "Add to Cart" |
| `isLoggedIn` | `"true"` | Login (módulo AUTH); el logout la elimina pero no toca `cart` |

## Endpoints

No hay llamadas de red al agregar al carrito: la operación es 100 % en el cliente (`localStorage`).
