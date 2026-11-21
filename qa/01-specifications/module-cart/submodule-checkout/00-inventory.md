# MÓDULO: Carrito y checkout - Submódulo: Checkout y confirmación de orden

| Campo | Valor |
|-------|-------|
| Código de módulo | CART |
| Código de submódulo | CHK |
| URL principal | {{QA_BASE_URL}}/checkout.php |
| Páginas del flujo | `checkout.php` -> `confirm.php` -> `thanks.php` |
| Títulos de página | Contienen "Checkout", "Order Confirmation" y "Thank You" respectivamente (con guion largo tipográfico; usar coincidencia parcial) |
| Breadcrumbs | Home / Checkout; Home / Confirm Details; Home / Thanks |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Elementos de UI - checkout.php (formulario "Billing Address")

| Elemento | data-testid | Tipo | Obligatorio | Notas |
|----------|-------------|------|-------------|-------|
| Formulario | `checkout-form` | form | - | Envío interceptado por JavaScript (`preventDefault`). Texto "* fields are mandatory". |
| First Name | `checkout-firstname-input` | text | Sí | Error en `checkout-firstname-error`. Se aplica `trim`. |
| Middle Name | `checkout-middlename-input` | text | No | Sin validación. |
| Last Name | `checkout-lastname-input` | text | Sí | Error en `checkout-lastname-error`. |
| E-mail | `checkout-email-input` | email | Sí | Validación nativa HTML5 (`type="email"`) + patrón `^[^\s@]+@[^\s@]+\.[^\s@]+$`. Error en `checkout-email-error`. |
| Mobile No. | `checkout-phone-input` | number | Sí | Exactamente 10 caracteres. Al ser `type="number"`, no admite letras. Error en `checkout-phone-error`. |
| Address | `checkout-address-input` | textarea | Sí | Error en `checkout-address-error`. |
| State | `checkout-state-input` | text | Sí | Texto libre (el `select` de estados está comentado en el HTML). Error en `checkout-state-error`. |
| City | `checkout-city-input` | text | Sí | Error en `checkout-city-error`. |
| Pin Code | `checkout-pincode-input` | number | Sí | `min="1"` (validación nativa bloquea 0 y negativos). Error en `checkout-pincode-error`. |
| Total de la orden | `order-total` | div | - | Formato "$800". |
| Continuar | `continue-btn` | button submit | - | Texto "Continue". Valida y navega a `confirm.php`. |
| Resumen del carrito | `checkout-cart-table` | table | - | Filas `checkout-cart-row-{id}` con `checkout-item-name-{id}`, `checkout-item-price-{id}`, `checkout-item-qty-{id}`, `checkout-item-total-{id}`. Solo lectura. |
| Volver | `go-back-btn` | link | - | "Go To Back", `href="cart.php"`. |

## Elementos de UI - confirm.php ("Confirm Details")

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Datos del cliente | `confirm-user-info` | div | Contiene `confirm-firstname`, `confirm-middlename`, `confirm-lastname`, `confirm-email`, `confirm-phone`, `confirm-address`, `confirm-state`, `confirm-city`, `confirm-pincode`. Cada valor se muestra con un espacio inicial (usar `trim` en aserciones). |
| Total de la orden | `order-total` | div | Formato "$800". |
| Realizar orden | `place-order-btn` | link | "Place Order", `href="thanks.php"`. |
| Resumen del carrito | `confirm-cart-table` | table | Filas `confirm-cart-row-{id}` con `confirm-item-name/price/qty/total-{id}`. |
| Volver | `go-back-btn` | link | "Go To Back", `href="checkout.php"`. |

## Elementos de UI - thanks.php

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Contenedor | `order-success` | div | - |
| Título | `order-success-title` | h1 | "🎉 Thank You for Your Order!" |
| Mensaje | `order-success-message` | p | "Your order has been placed successfully." |
| Volver a comprar | `shop-again-btn` | link | "Shop Again", navega a `shop.php`. |

## Mensajes de validación (texto exacto)

| Campo | Condición | Mensaje |
|-------|-----------|---------|
| First Name | vacío | "Please enter your first name." |
| Last Name | vacío | "Please enter your last name." |
| E-mail | vacío | "Please enter your email." |
| E-mail | no cumple el patrón | "Please enter a valid email address." |
| Mobile No. | vacío | "Please enter your phone number." |
| Mobile No. | longitud distinta de 10 | "Phone Number Should be 10 digit long." |
| Address | vacío | "Please enter your address." |
| State | vacío | "Please enter your state." |
| City | vacío | "Please enter your city." |
| Pin Code | vacío | "Please enter your pincode." |

## Almacenamiento del lado del cliente

| Clave `localStorage` | Forma | Escrita por | Borrada por |
|----------------------|-------|-------------|-------------|
| `cart` | `[{ id, qty }]` | Catálogo / `cart.php` | `thanks.php` |
| `user` | `{ firstname, middlename, lastname, email, phone, address, states, city, pincode }` | `checkout.php` al pasar las validaciones | `thanks.php` |

## Endpoints observados

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /checkout.php | Formulario de checkout. |
| GET | /confirm.php | Confirmación de datos (lee `localStorage.user` y `cart`). |
| GET | /thanks.php | Página de orden exitosa; limpia `cart` y `user`. |

Durante "Continue" y "Place Order" no se observó ninguna petición distinta del `GET` de navegación:
la orden nunca se envía al servidor.
