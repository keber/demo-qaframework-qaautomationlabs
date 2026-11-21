# Reglas de negocio - Carrito y checkout: Checkout y confirmación de orden

> Todas las reglas fueron observadas en la UI el 2026-11-20 y contrastadas con el JavaScript de
> `checkout.php`, `confirm.php` y `thanks.php`.

### RN-CART-013: Campos obligatorios del checkout

- **Type**: Validation
- **Trigger**: Clic en "Continue" (`continue-btn`) con algún campo obligatorio vacío o con solo espacios.
- **Behavior**: No se navega; se muestra el error bajo el campo correspondiente. Obligatorios: First Name, Last Name, E-mail, Mobile No., Address, State, City, Pin Code. Middle Name es opcional.
- **Error message**: "Please enter your first name." / "Please enter your last name." / "Please enter your email." / "Please enter your phone number." / "Please enter your address." / "Please enter your state." / "Please enter your city." / "Please enter your pincode."
- **Notes**: Los valores se recortan (`trim`): "   " en First Name se considera vacío.

### RN-CART-014: Orden de validación y un solo error a la vez

- **Type**: Validation
- **Trigger**: Clic en "Continue".
- **Behavior**: Antes de validar se ocultan todos los errores. Se evalúa en este orden y se detiene en el primero que falla: First Name, Last Name, E-mail, Mobile No., Address, State, City, Pin Code (vacíos), luego formato de email y luego longitud de teléfono. Solo se muestra un mensaje.
- **Notes**: Con el formulario vacío, solo aparece "Please enter your first name.".

### RN-CART-015: Los errores se ocultan al escribir

- **Type**: Validation
- **Trigger**: Evento `input` en cualquier campo obligatorio.
- **Behavior**: Se ocultan todos los mensajes de error visibles.

### RN-CART-016: Formato de email

- **Type**: Validation
- **Trigger**: Clic en "Continue" con un email no vacío.
- **Behavior**: Primero actúa la validación nativa del navegador (`type="email"`): valores sin "@" (`abc`) o con espacios (`a b@x.com`) bloquean el envío con el globo nativo y sin mensaje propio. Valores que pasan la validación nativa pero no el patrón `^[^\s@]+@[^\s@]+\.[^\s@]+$` (`abc@x`) muestran el mensaje propio.
- **Error message**: "Please enter a valid email address."
- **Notes**: `qa@example.c` es aceptado (dominio de un solo carácter).

### RN-CART-017: Teléfono de 10 dígitos

- **Type**: Validation
- **Trigger**: Clic en "Continue" con un teléfono no vacío.
- **Behavior**: Se rechaza cualquier longitud distinta de 10. El campo `type="number"` impide escribir letras.
- **Error message**: "Phone Number Should be 10 digit long."
- **Notes**: Observado: `123456789` y `12345678901` rechazados; `9876543210` y `0000000000` aceptados (ANOM-CART-06).

### RN-CART-018: Pin Code numérico y positivo

- **Type**: Validation
- **Trigger**: Clic en "Continue".
- **Behavior**: El campo `type="number"` con `min="1"` hace que la validación nativa bloquee `0` y `-5` (sin mensaje propio). Las letras no se pueden escribir (`abc12` queda como `12`). No hay validación de longitud.

### RN-CART-019: Checkout exitoso navega a la confirmación

- **Type**: State Machine
- **Trigger**: Clic en "Continue" con todos los campos válidos.
- **Behavior**: Se guarda `localStorage.user` con los 9 campos y se navega a `confirm.php`.
- **Notes**: Middle Name vacío es válido.

### RN-CART-020: Datos del cliente se guardan solo en el navegador

- **Type**: Integration
- **Trigger**: Checkout exitoso.
- **Behavior**: Los datos personales se guardan en texto plano en `localStorage.user`; no se envían al servidor. Se borran solo al cargar `thanks.php` (ANOM-CART-05).

### RN-CART-021: La confirmación muestra los datos ingresados y el resumen de la orden

- **Type**: State Machine
- **Trigger**: Carga de `confirm.php`.
- **Behavior**: Muestra los 9 datos del cliente (`confirm-*`), las líneas del carrito (`confirm-cart-row-{id}`) y el total (`order-total`). Middle Name vacío se muestra en blanco.
- **Notes**: Los valores se insertan con `innerHTML` sin escapar (ANOM-CART-04, por inspección de código).

### RN-CART-022: Volver desde la confirmación

- **Type**: State Machine
- **Trigger**: Clic en `go-back-btn` en `confirm.php`.
- **Behavior**: Navega a `checkout.php`. El formulario aparece vacío (los datos de `localStorage.user` no se recargan, ANOM-CART-07).

### RN-CART-023: Totales consistentes entre carrito, checkout y confirmación

- **Type**: Calculation
- **Trigger**: Carga de `checkout.php` y `confirm.php`.
- **Behavior**: `order-total` = suma de `precio x qty` de `localStorage.cart`, con formato "$<entero>" (sin el prefijo "Total:" que usa `cart.php`). Las líneas muestran nombre, precio, cantidad y subtotal idénticos a `cart.php`.

### RN-CART-024: Realizar la orden

- **Type**: State Machine
- **Trigger**: Clic en "Place Order" (`place-order-btn`) en `confirm.php`.
- **Behavior**: Navega a `thanks.php`, que muestra "🎉 Thank You for Your Order!" y "Your order has been placed successfully." y elimina `localStorage.cart` y `localStorage.user`. "Shop Again" vuelve a `shop.php` con el carrito vacío.

### RN-CART-025: No se puede hacer checkout con el carrito vacío

- **Type**: State Machine
- **Trigger**: Visita directa a `checkout.php` con el carrito vacío y clic en "Continue" con datos válidos.
- **Behavior esperado (spec)**: El checkout debe impedirse cuando el carrito está vacío (coherente con `cart.php`, que oculta "Proceed To Checkout" en ese estado).
- **Behavior observado**: `order-total` = "$0", sin líneas; "Continue" navega a `confirm.php` y "Place Order" muestra la orden como exitosa (ANOM-CART-02).

### RN-CART-026: La confirmación y la orden exitosa requieren un checkout completado

- **Type**: State Machine
- **Trigger**: Visita directa a `confirm.php` o `thanks.php` sin haber completado el checkout.
- **Behavior esperado (spec)**: Debe redirigirse al paso previo del flujo.
- **Behavior observado**: `confirm.php` muestra "undefined" en todos los datos del cliente con total "$0"; `thanks.php` muestra "Thank You for Your Order!" (ANOM-CART-03).

### RN-CART-027: Páginas del checkout requieren sesión

- **Type**: Access Control
- **Trigger**: Visita a `checkout.php`, `confirm.php` o `thanks.php` sin `localStorage.isLoggedIn`.
- **Behavior**: Redirección a `index.php` por JavaScript (el servidor responde HTTP 200).
