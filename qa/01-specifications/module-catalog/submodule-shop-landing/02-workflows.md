# Flujos - Catálogo: Inicio de tienda y navegación (SHOP)

### FL-CAT-001: Ingresar a la tienda y elegir una categoría

**Actor**: Comprador con sesión (rol `user`)
**Trigger**: Login exitoso (redirige a `shop.php`) o clic en el logo / "Shop".
**Precondition**: `localStorage["isLoggedIn"]` presente.

**Flow**:
```
[Inicio: shop.php]
    |
    v
[Se muestran 4 tarjetas de categoría + badge del carrito]
    |
    +-- [Clic Shop Now Men]         -> mens-wear.php
    +-- [Clic Shop Now Women]       -> womens-wear.php
    +-- [Clic Shop Now Kids]        -> kids-wear.php
    +-- [Clic Shop Now Electronics] -> electronics.php
    |
    v
[Fin: listado de la categoría elegida]
```

**Postcondition**: El usuario ve el listado de la categoría; el badge conserva el mismo valor.

### FL-CAT-002: Acceso sin sesión (rechazo)

**Actor**: Visitante sin sesión
**Trigger**: Abrir directamente una URL del catálogo.
**Precondition**: `localStorage` sin `isLoggedIn`.

**Flow**:
```
[Inicio: GET /shop.php (o categoría / detalle)]
    |
    v
[Servidor responde 200 con HTML]
    |
    v
[Script del cliente: isLoggedIn ausente]
    |
    v
[Fin: redirección a index.php (login)]
```

**Postcondition**: El visitante queda en la página de login. Ruta de error: si JavaScript está deshabilitado, el HTML del catálogo queda visible (no verificado en esta sesión; ver H-CAT-07).
