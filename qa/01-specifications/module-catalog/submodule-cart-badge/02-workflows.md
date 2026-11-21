# Flujos - Catálogo: Badge del carrito y Add to Cart (BADGE)

### FL-CAT-040: Agregar productos desde el listado

**Actor**: Comprador con sesión (`user`)
**Trigger**: Clic en "Add to Cart" en una tarjeta.
**Precondition**: Sesión iniciada; en una página de categoría.

**Flow**:
```
[Inicio: badge = N]
    |
    v
[Clic add-to-cart-{id}]
    |
    +-- [id no está en cart] -> push { id, qty: 1 } -> badge = N + 1
    +-- [id ya está en cart] -> qty + 1           -> badge = N
    |
    v
[Fin: localStorage.cart actualizado]
```

**Postcondition**: El badge refleja `cart.length` en todas las páginas.

### FL-CAT-041: Persistencia del carrito entre páginas, recargas y sesiones

**Actor**: Comprador con sesión
**Trigger**: Navegación, recarga, logout + login.
**Precondition**: Carrito con al menos 1 línea.

**Flow**:
```
[categoría.php badge = N]
    |
    +-- [otra categoría / shop.php / product.php / cart.php] -> badge = N
    +-- [recargar]                                           -> badge = N
    +-- [logout + login]                                     -> badge = N (H-CAT-06)
    +-- [otra pestaña agrega]                                -> badge = N hasta recargar (H-CAT-05)
    |
    v
[Fin]
```

### FL-CAT-042: Ruta de error - carrito corrupto

**Actor**: Comprador con sesión
**Trigger**: `localStorage.cart` no es JSON válido.
**Precondition**: Valor corrupto en `localStorage`.

**Flow**:
```
[Cargar categoría] -> [JSON.parse falla: error JS] -> [badge "0", listado visible]
```

**Postcondition**: La página sigue siendo utilizable; el carrito corrupto no se repara automáticamente.
