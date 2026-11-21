# Flujos - Catálogo: Detalle de producto (DETAIL)

### FL-CAT-030: Consultar el detalle y agregar al carrito

**Actor**: Comprador con sesión (`user`)
**Trigger**: Clic en el nombre de un producto en el listado.
**Precondition**: Sesión iniciada.

**Flow**:
```
[Inicio: categoría.php]
    |
    v
[Clic product-name-{id}] -> product.php?id={id}
    |
    v
[Se muestran imagen, nombre, precio y Add to Cart]
    |
    +-- [Clic Add to Cart] -> badge +1 si el producto no estaba en el carrito
    |
    v
[Clic Go To Back] -> shop.php
    |
    v
[Fin]
```

**Postcondition**: El carrito en `localStorage` refleja lo agregado; el usuario queda en `shop.php`.

### FL-CAT-031: Ruta de error - producto inexistente

**Actor**: Comprador con sesión
**Trigger**: Abrir `product.php` con id inexistente, inválido o sin id.
**Precondition**: Sesión iniciada.

**Flow**:
```
[GET product.php?id=99999 | ?id=abc | sin id]
    |
    v
[HTTP 200 + "Product not found"]
    |
    v
[Fin: sin botón Add to Cart]
```

**Postcondition**: El carrito no cambia.
