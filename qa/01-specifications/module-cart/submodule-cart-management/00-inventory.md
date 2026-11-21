# MÓDULO: Carrito y checkout - Submódulo: Gestión del carrito

| Campo | Valor |
|-------|-------|
| Código de módulo | CART |
| Código de submódulo | GEST |
| URL principal | {{QA_BASE_URL}}/cart.php |
| Páginas relacionadas | `mens-wear.php`, `womens-wear.php`, `kids-wear.php`, `electronics.php`, `product.php?id={id}` (origen de "Add to Cart") |
| Título de página | Contiene "Cart" (incluye un guion largo tipográfico; usar coincidencia parcial) |
| Breadcrumb | Home / Cart |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Elementos de UI - páginas de catálogo (origen)

| Elemento | data-testid | Tipo | Obligatorio | Notas |
|----------|-------------|------|-------------|-------|
| Botón agregar al carrito | `add-to-cart-{id}` | button | - | Presente en las páginas de categoría y en `product.php`. `shop.php` no tiene botones de agregar (solo tarjetas de categoría). Si el producto ya existe en el carrito, incrementa `qty` en 1. |
| Contador del encabezado | `header-cart-count` | span | - | Muestra `cart.length` (productos distintos, no unidades). |
| Enlace al carrito | `header-cart-link` | link | - | Navega a `cart.php`. |

## Elementos de UI - cart.php

| Elemento | data-testid | Tipo | Obligatorio | Notas |
|----------|-------------|------|-------------|-------|
| Breadcrumb | `breadcrumb`, `breadcrumb-home`, `breadcrumb-current` | nav | - | `breadcrumb-current` = "Cart". |
| Volver | `go-back-btn` | link | - | Texto "Go To Back", `href="shop.php"`. |
| Tabla del carrito | `cart-table` | table | - | Encabezados: Products, Price, Quantity, Total, Remove. Se renderiza por JavaScript desde `localStorage.cart`. |
| Fila de producto | `cart-row-{id}` | tr | - | Una por producto distinto, en orden de inserción. |
| Nombre de producto | `cart-item-name-{id}` | td | - | Imagen miniatura + nombre. |
| Precio unitario | `cart-item-price-{id}` | td | - | Formato `$150` (precio de `js/products.js`). |
| Cantidad | `cart-qty-{id}` | input number | Sí | `min="1"`; recalcula con el evento `change`. Ver RN-CART-004 a RN-CART-006. |
| Subtotal de línea | `cart-item-total-{id}` | td | - | `precio x cantidad`, formato `$300`. |
| Eliminar | `cart-remove-{id}` | button | - | Ícono de papelera; elimina la línea completa sin confirmación. |
| Total del carrito | `cart-total` | div | - | Formato "Total: $1050". Con carrito vacío: "Total: $0". |
| Proceder al checkout | `proceed-to-checkout-btn` | link | - | Texto "Proceed To Checkout", `href="checkout.php"`. Oculto (`d-none`) cuando el carrito está vacío. |
| Mensaje de carrito vacío | `cart-empty-message` | h3 | - | Texto "Your Cart is Empty". |
| Botón empezar a comprar | `start-shopping-btn` | link | - | Texto "Start Shopping", navega a `shop.php`. Solo con carrito vacío. |
| Cerrar sesión | `header-logout-btn` | button | - | Borra solo `isLoggedIn`; el carrito se conserva. |

## Almacenamiento del lado del cliente

| Clave `localStorage` | Forma | Escrita por | Notas |
|----------------------|-------|-------------|-------|
| `cart` | `[{ "id": 21, "qty": 2 }, { "id": 22, "qty": 1 }]` | Páginas de catálogo, `cart.php` | Fuente de verdad del carrito. No se sincroniza con el servidor. |
| `isLoggedIn` | `"true"` | `index.php` | Requerida por el guard de `cart.php`. |

## Endpoints observados

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /cart.php | Página del carrito (HTML estático; el contenido se arma en el cliente). |
| GET | /js/products.js | Catálogo estático de 85 productos (`window.PRODUCTS`) usado para nombre y precio. |
| GET | /mens-wear.php, /womens-wear.php, /kids-wear.php, /electronics.php, /product.php?id={id} | Páginas de origen del botón "Add to Cart". |

No se observó ninguna petición XHR/fetch ni `POST` al agregar, modificar o eliminar productos.

## Datos de referencia observados (2026-11-20)

| id | Nombre | Categoría | Precio |
|----|--------|-----------|--------|
| 1 | Black T-Shirt | Women | $100 |
| 21 | Black T-Shirt | Men | $150 |
| 22 | White T-Shirt | Men | $500 |
| 61 | Samsung Mobile | Electronics | $150 |

> Los ids 1 y 21 comparten el nombre "Black T-Shirt" con precios distintos: las aserciones deben
> usar el `data-testid` con id, no el nombre.
