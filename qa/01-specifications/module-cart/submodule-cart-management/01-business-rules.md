# Reglas de negocio - Carrito y checkout: Gestión del carrito

> Todas las reglas fueron observadas en la UI el 2026-11-20 y contrastadas con el JavaScript de
> `cart.php` y de las páginas de categoría.

### RN-CART-001: Agregar un producto nuevo al carrito

- **Type**: State Machine
- **Trigger**: Clic en `add-to-cart-{id}` de un producto que no está en el carrito.
- **Behavior**: Se agrega `{ id, qty: 1 }` al final de `localStorage.cart` y el contador del encabezado se incrementa en 1. No se muestra mensaje ni alerta de confirmación.
- **Notes**: Funciona igual desde las 4 páginas de categoría y desde `product.php`.

### RN-CART-002: Agregar un producto ya existente incrementa la cantidad

- **Type**: Calculation
- **Trigger**: Clic en `add-to-cart-{id}` de un producto que ya está en el carrito.
- **Behavior**: No se crea una segunda línea; la `qty` del producto aumenta en 1. El contador del encabezado **no** cambia.
- **Notes**: El contador refleja productos distintos (`cart.length`), no unidades (ANOM-CART-08).

### RN-CART-003: Subtotal de línea

- **Type**: Calculation
- **Trigger**: Renderizado de `cart.php` o cambio de cantidad.
- **Behavior**: `cart-item-total-{id}` = precio unitario de `js/products.js` x `qty`, con formato `$<entero>`.
- **Notes**: Observado: id 21 ($150) x 2 = $300; id 22 ($500) x 3 = $1500; id 22 x 999 = $499500.

### RN-CART-004: Cantidad válida

- **Type**: Validation
- **Trigger**: Evento `change` sobre `cart-qty-{id}` (Tab, Enter o pérdida de foco).
- **Behavior**: Un entero positivo reemplaza la cantidad, se persiste en `localStorage.cart` y se recalculan subtotal y total. No hay máximo (999 es aceptado).
- **Notes**: La cantidad persiste al recargar la página.

### RN-CART-005: La cantidad mínima es 1

- **Type**: Validation
- **Trigger**: Evento `change` con un valor menor que 1.
- **Behavior esperado (spec)**: Cualquier valor menor que 1 debe rechazarse y la cantidad debe quedar en 1 (atributo `min="1"`).
- **Behavior observado**: `-2` se corrige a 1, pero `0` es **aceptado**: la línea queda con subtotal `$0` y el producto permanece en el carrito (ANOM-CART-01).
- **Error message**: No se muestra mensaje; la corrección es silenciosa.

### RN-CART-006: Cantidad vacía o no entera se normaliza a 1

- **Type**: Validation
- **Trigger**: Evento `change` con valor vacío o decimal (por ejemplo `1.5`).
- **Behavior**: La cantidad se fija en 1 y se recalculan subtotal y total. Sin mensaje de error.

### RN-CART-007: Total del carrito

- **Type**: Calculation
- **Trigger**: Renderizado de `cart.php`, cambio de cantidad o eliminación.
- **Behavior**: `cart-total` = suma de los subtotales de línea, con formato "Total: $<entero>".
- **Notes**: Observado con 4 líneas: $300 + $500 + $150 + $100 = "Total: $1050". Formato distinto al de checkout (ANOM-CART-10).

### RN-CART-008: Eliminar un producto

- **Type**: State Machine
- **Trigger**: Clic en `cart-remove-{id}`.
- **Behavior**: Se elimina la línea completa (todas sus unidades) sin confirmación; se recalcula el total y el contador del encabezado disminuye en 1.

### RN-CART-009: Estado de carrito vacío

- **Type**: State Machine
- **Trigger**: `localStorage.cart` vacío o inexistente al cargar `cart.php`, o eliminación de la última línea.
- **Behavior**: Se muestra `cart-empty-message` "Your Cart is Empty" y `start-shopping-btn` "Start Shopping" (a `shop.php`); el total es "Total: $0", el contador es 0 y `proceed-to-checkout-btn` queda oculto.

### RN-CART-010: Acceso a cart.php requiere sesión

- **Type**: Access Control
- **Trigger**: Visita a `cart.php` sin `localStorage.isLoggedIn`.
- **Behavior**: Redirección a `index.php` mediante JavaScript.
- **Notes**: La protección es solo del cliente: el servidor responde HTTP 200 con el HTML completo (ver ANOM-AUTH-02 en el módulo AUTH).

### RN-CART-011: El carrito es local al navegador y sobrevive al logout

- **Type**: State Machine
- **Trigger**: Logout, nuevo login o uso de otro navegador/contexto con la misma cuenta.
- **Behavior**: El carrito no se asocia a la cuenta: otro contexto con la misma cuenta ve su propio carrito (vacío). El logout solo borra `isLoggedIn`, por lo que el carrito reaparece al volver a iniciar sesión en el mismo navegador.

### RN-CART-012: Nombre y precio provienen del catálogo estático

- **Type**: Dependency
- **Depends on**: Catálogo `window.PRODUCTS` de `js/products.js` (módulo CAT).
- **Scoping field**: `id` de cada elemento de `localStorage.cart`.
- **Upstream validity condition**: El `id` debe existir en `window.PRODUCTS` (1 a 85). Un `id` inexistente provoca un error de JavaScript al renderizar (`product` es `undefined`) y la tabla no se dibuja.
- **Real endpoint observed**: `GET /js/products.js` (archivo estático; no hay endpoint de precios).
- **Values tried**: ids 21 y 22 (Men), 61 (Electronics) y 1 (Women vía `product.php`): los cuatro muestran nombre y precio del catálogo.
- **Notes**: El comportamiento con un `id` inexistente se dedujo del código fuente; no se ejercitó en la UI.
