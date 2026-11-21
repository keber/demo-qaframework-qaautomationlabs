# Reglas de negocio - Catálogo: Detalle de producto (DETAIL)

### RN-CAT-030: El detalle requiere sesión

- **Type**: Access Control
- **Trigger**: Abrir `product.php?id={id}` sin `isLoggedIn`.
- **Behavior**: Redirección a `index.php` (mismo mecanismo de cliente que RN-CAT-001).

### RN-CAT-031: El detalle es consistente con el listado

- **Type**: Validation
- **Trigger**: Abrir `product.php?id={id}` desde el nombre del producto en el listado.
- **Behavior**: `product-detail-name`, `product-detail-price` y la imagen (`src`) coinciden con los del producto `{id}` en el listado. Observado: id 21 "Black T-Shirt"; id 23 "Green Shirt" $200; id 70 "LG UHD AI TV" $180 con `products/Electronics/e-10.jpg`.

### RN-CAT-032: Producto inexistente o id inválido

- **Type**: Validation
- **Trigger**: Abrir `product.php` con un id que no existe (`99999`), no numérico (`abc`) o sin parámetro `id`.
- **Behavior**: `product-detail` muestra solo el mensaje; no hay nombre, precio ni botón "Add to Cart". HTTP 200.
- **Error message**: "Product not found"

### RN-CAT-033: Breadcrumb del detalle

- **Type**: Validation
- **Trigger**: Cargar el detalle.
- **Behavior**: Muestra "Home" y "Product Details". No incluye la categoría del producto.

### RN-CAT-034: "Go To Back" del detalle vuelve a shop.php

- **Type**: Integration
- **Trigger**: Clic en `go-back-btn` en el detalle.
- **Behavior**: Navega a `shop.php`, no a la categoría de origen.

### RN-CAT-035: Agregar al carrito desde el detalle

- **Type**: State Machine
- **Trigger**: Clic en `add-to-cart-{id}` en el detalle.
- **Behavior**: Igual que en el listado (RN-CAT-041/042): agrega `{ id, qty: 1 }` o incrementa `qty`, y actualiza el badge. Permanece en la misma URL.
