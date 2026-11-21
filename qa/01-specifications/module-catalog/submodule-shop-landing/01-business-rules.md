# Reglas de negocio - Catálogo: Inicio de tienda y navegación (SHOP)

### RN-CAT-001: Acceso al catálogo requiere sesión iniciada

- **Type**: Access Control
- **Trigger**: Abrir cualquier página del catálogo (`shop.php`, páginas de categoría, `product.php`).
- **Behavior**: Si `localStorage["isLoggedIn"]` no existe, el navegador redirige a `index.php`. Con sesión, la página se muestra.
- **Error message**: No aplica (redirección silenciosa).
- **Notes**: La verificación es solo en el cliente; el servidor responde HTTP 200 con el HTML completo. Cualquier valor no vacío (incluso `"false"`) habilita el acceso (hallazgo H-CAT-07).

### RN-CAT-002: shop.php presenta exactamente 4 categorías

- **Type**: Validation
- **Trigger**: Cargar `shop.php` con sesión.
- **Behavior**: Se muestran 4 tarjetas en este orden: "Men Fashion", "Women Fashion", "Kids Fashion", "Electronics", cada una con imagen de fondo y botón "Shop Now".
- **Notes**: No se listan productos en esta página.

### RN-CAT-003: Cada botón "Shop Now" lleva a su categoría

- **Type**: Integration
- **Trigger**: Clic en "Shop Now" de una tarjeta.
- **Behavior**: Men -> `mens-wear.php`; Women -> `womens-wear.php`; Kids -> `kids-wear.php`; Electronics -> `electronics.php`.

### RN-CAT-004: El logo y el enlace "Shop" vuelven a shop.php

- **Type**: Integration
- **Trigger**: Clic en `header-logo-link` o `nav-shop` desde cualquier página del catálogo.
- **Behavior**: Navega a `shop.php`. `nav-shop` se muestra con la clase `active`.

### RN-CAT-005: Breadcrumb de shop.php

- **Type**: Validation
- **Trigger**: Cargar `shop.php`.
- **Behavior**: El breadcrumb muestra "Home" y "Shop". "Home" tiene `href="#"` y no cambia de página.
- **Notes**: En las páginas de categoría y detalle "Home" apunta a `/`, que muestra el login aunque haya sesión (hallazgo H-CAT-03).

### RN-CAT-006: La búsqueda de la cabecera no busca en el catálogo

- **Type**: Integration
- **Trigger**: Escribir en `header-search` y enviar con Enter.
- **Behavior**: El formulario envía `GET https://qaautomationlabs.com/?s={texto}` (sitio externo). La búsqueda de productos del catálogo es `search-input`, disponible solo en las páginas de categoría (RN-CAT-015).
- **Notes**: Comportamiento por diseño del sitio; se documenta para que la automatización no la confunda con la búsqueda del catálogo.
