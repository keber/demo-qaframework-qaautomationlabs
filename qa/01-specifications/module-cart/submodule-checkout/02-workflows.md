# Flujos - Carrito y checkout: Checkout y confirmación de orden

### FL-CART-004: Compra completa (camino feliz)

**Actor**: Comprador con sesión iniciada (`QA_USER_EMAIL`)
**Trigger**: Clic en "Proceed To Checkout" en `cart.php`.
**Precondition**: Carrito con al menos un producto (por ejemplo `[{21,2},{22,1}]`, total $800).

**Flow**:
```
[cart.php] --clic proceed-to-checkout-btn--> [checkout.php: order-total "$800", resumen de líneas]
    |
    v
[Completar First Name, Last Name, E-mail, Mobile No. (10 dígitos), Address, State, City, Pin Code]
    |
    v
[Clic continue-btn] -> localStorage.user guardado
    |
    v
[confirm.php: datos del cliente + resumen + "$800"]
    |
    v
[Clic place-order-btn]
    |
    v
[thanks.php: "Thank You for Your Order!", cart y user eliminados]
    |
    v
[Clic shop-again-btn] -> [Fin: shop.php con carrito vacío]
```

**Postcondition**: `localStorage.cart` y `localStorage.user` no existen; no se registró nada en el servidor.

### FL-CART-005: Rechazo por validación del formulario

**Actor**: Comprador con sesión iniciada
**Trigger**: Clic en "Continue" con datos faltantes o inválidos.
**Precondition**: Carrito con productos; en `checkout.php`.

**Flow**:
```
[Clic continue-btn]
    |
    +- [Campo obligatorio vacío] -> error del primer campo vacío (orden RN-CART-014)
    +- [Email sin "@" o con espacios] -> globo nativo del navegador, sin navegación
    +- [Email sin dominio con punto] -> "Please enter a valid email address."
    +- [Teléfono != 10 dígitos] -> "Phone Number Should be 10 digit long."
    +- [Pin Code 0 o negativo] -> globo nativo del navegador
    |
    v
[Comprador corrige el campo] -> errores ocultos al escribir
    |
    v
[Clic continue-btn] -> FL-CART-004 continúa en confirm.php
```

**Postcondition**: Mientras haya errores, se permanece en `checkout.php` y `localStorage.user` no se escribe.

### FL-CART-006: Volver atrás durante el checkout (cancelación)

**Actor**: Comprador con sesión iniciada
**Trigger**: Clic en "Go To Back".
**Precondition**: En `checkout.php` o `confirm.php`.

**Flow**:
```
[confirm.php] --go-back-btn--> [checkout.php (formulario vacío, ANOM-CART-07)]
    |
    v
[checkout.php] --go-back-btn--> [cart.php (carrito intacto)]
    |
    v
[Fin: el comprador puede modificar el carrito]
```

**Postcondition**: El carrito no cambia; `localStorage.user` permanece hasta llegar a `thanks.php`.

### FL-CART-007: Acceso fuera de secuencia (camino de error)

**Actor**: Comprador con sesión iniciada o visitante
**Trigger**: Navegación directa por URL a `checkout.php`, `confirm.php` o `thanks.php`.
**Precondition**: Variable.

**Flow**:
```
[URL directa]
    |
    +- [Sin sesión] -> index.php (RN-CART-027)
    +- [checkout.php con carrito vacío] -> total "$0", Continue permitido (ANOM-CART-02)
    +- [confirm.php sin checkout] -> datos "undefined" (ANOM-CART-03)
    +- [thanks.php sin orden] -> mensaje de orden exitosa (ANOM-CART-03)
```

**Postcondition esperada (spec)**: Ningún paso posterior es accesible sin cumplir el paso previo.
