# Reglas de negocio - Catálogo: Badge del carrito y Add to Cart (BADGE)

### RN-CAT-040: El badge muestra la cantidad de líneas del carrito

- **Type**: Calculation
- **Trigger**: Carga de cualquier página del catálogo.
- **Behavior**: `header-cart-count` = `JSON.parse(localStorage.cart || "[]").length`. Con carrito vacío o inexistente muestra "0".
- **Notes**: Cuenta líneas distintas, no unidades (H-CAT-04: pendiente confirmación de negocio).

### RN-CAT-041: Agregar un producto nuevo crea una línea con qty 1

- **Type**: State Machine
- **Trigger**: Clic en `add-to-cart-{id}` de un producto que no está en el carrito.
- **Behavior**: Se agrega `{ id, qty: 1 }` al final de `cart` y el badge aumenta en 1 sin recargar la página.

### RN-CAT-042: Agregar un producto existente incrementa qty sin cambiar el badge

- **Type**: State Machine
- **Trigger**: Clic en `add-to-cart-{id}` de un producto que ya está en el carrito.
- **Behavior**: `qty` de esa línea aumenta en 1; el badge mantiene su valor. Observado: dos clics en id 21 -> `[{ id: 21, qty: 2 }]` y badge "1".

### RN-CAT-043: El badge persiste entre páginas y recargas

- **Type**: State Machine
- **Trigger**: Navegar entre categorías, `shop.php`, `product.php`, `cart.php` o recargar.
- **Behavior**: El badge refleja siempre el contenido de `localStorage.cart`.

### RN-CAT-044: Filtros, búsqueda y orden no modifican el carrito

- **Type**: Validation
- **Trigger**: Cambiar filtros, búsqueda u orden.
- **Behavior**: El badge y `localStorage.cart` no cambian. Agregar desde un listado filtrado agrega el id correcto (observado: id 35 con filtro Footwear).

### RN-CAT-045: Sin retroalimentación adicional al agregar

- **Type**: Validation
- **Trigger**: Clic en "Add to Cart".
- **Behavior**: No aparece alerta, toast ni cambio de texto; la única señal es el badge.
- **Notes**: H-CAT-10 (recomendación de usabilidad).

### RN-CAT-046: El badge no se sincroniza entre pestañas

- **Type**: State Machine
- **Trigger**: Agregar un producto en una pestaña con otra pestaña del catálogo abierta.
- **Behavior**: La otra pestaña mantiene el valor anterior hasta recargar; tras recargar muestra el valor actualizado.
- **Notes**: H-CAT-05.

### RN-CAT-047: El carrito sobrevive al logout

- **Type**: State Machine
- **Trigger**: Logout y nuevo login en el mismo navegador.
- **Behavior**: `localStorage.cart` se conserva y el badge muestra las mismas líneas tras el nuevo login.
- **Notes**: H-CAT-06 (privacidad en equipos compartidos; el carrito no está asociado al usuario).

### RN-CAT-048: Carrito corrupto en localStorage

- **Type**: Validation
- **Trigger**: `localStorage.cart` con un valor que no es JSON válido.
- **Behavior**: Se produce un error JS no controlado ("is not valid JSON"); el badge queda en su valor por defecto "0" y el listado de productos se muestra igual.
- **Notes**: Un id inexistente en el carrito (por ejemplo 9999) también cuenta en el badge.
