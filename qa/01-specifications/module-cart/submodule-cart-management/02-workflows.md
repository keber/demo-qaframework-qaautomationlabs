# Flujos - Carrito y checkout: Gestión del carrito

### FL-CART-001: Agregar productos y revisar el carrito (camino feliz)

**Actor**: Comprador con sesión iniciada (`QA_USER_EMAIL`)
**Trigger**: El comprador hace clic en "Add to Cart" en una página de categoría o de producto.
**Precondition**: Sesión iniciada; carrito vacío.

**Flow**:
```
[Inicio: mens-wear.php]
    |
    v
[Clic add-to-cart-21] -> cart = [{21,1}], contador = 1
    |
    v
[Clic add-to-cart-21 otra vez] -> cart = [{21,2}], contador = 1
    |
    v
[Clic add-to-cart-22] -> cart = [{21,2},{22,1}], contador = 2
    |
    v
[Clic header-cart-link] -> cart.php
    |
    v
[Fin: 2 filas, subtotales $300 y $500, "Total: $800", botón "Proceed To Checkout" visible]
```

**Postcondition**: `localStorage.cart` contiene las líneas agregadas; nada se envía al servidor.

### FL-CART-002: Modificar cantidad y eliminar productos

**Actor**: Comprador con sesión iniciada
**Trigger**: Cambio en `cart-qty-{id}` o clic en `cart-remove-{id}`.
**Precondition**: Carrito con al menos 2 productos.

**Flow**:
```
[cart.php con productos]
    |
    v
[Escribir cantidad y Tab/Enter]
    |
    +- [Entero >= 1] -> se guarda, subtotal y total recalculados
    +- [Vacío, negativo o decimal] -> se normaliza a 1
    +- [0] -> se guarda 0, subtotal $0 (ANOM-CART-01)
    |
    v
[Clic cart-remove-{id}]
    |
    +- [Quedan líneas] -> fila eliminada, total y contador recalculados
    +- [Era la última] -> FL-CART-003
    |
    v
[Fin: carrito actualizado y persistido en localStorage]
```

**Postcondition**: Las cantidades y líneas persisten al recargar la página.

### FL-CART-003: Carrito vacío y retorno a la tienda

**Actor**: Comprador con sesión iniciada
**Trigger**: Carga de `cart.php` sin productos o eliminación de la última línea.
**Precondition**: Sesión iniciada.

**Flow**:
```
[cart.php sin productos]
    |
    v
[Se muestra "Your Cart is Empty", "Total: $0", contador 0, sin "Proceed To Checkout"]
    |
    v
[Clic start-shopping-btn]
    |
    v
[Fin: shop.php]
```

**Alternativa de error**: sin sesión, la visita a `cart.php` redirige a `index.php` (RN-CART-010).

**Postcondition**: El comprador vuelve al catálogo sin haber podido iniciar el checkout desde el carrito.
