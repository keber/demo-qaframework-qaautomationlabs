# Módulo: Catálogo (CAT)

| Campo | Valor |
|-------|-------|
| Código de módulo | CAT |
| URL base | https://shop.qaautomationlabs.com |
| Páginas | `shop.php`, `mens-wear.php`, `womens-wear.php`, `kids-wear.php`, `electronics.php`, `product.php?id={id}` |
| Etapa del pipeline | 1 (análisis) y 2 (especificación) completadas |
| Última actualización | 2026-11-20 |
| Fuente de verdad | UI observada con Playwright (chromium) en esta sesión |

## Alcance

Catálogo de productos de la tienda demo: página de inicio de la tienda con las tarjetas de categoría,
listado por categoría (tarjetas de producto, filtros, búsqueda, ordenamiento), detalle de producto
alcanzado desde el listado y el contador (badge) del carrito en la cabecera, incluyendo el botón
"Add to Cart" del listado y del detalle. La gestión completa del carrito (`cart.php`) y el checkout
pertenecen al módulo CART; el login y el logout pertenecen al módulo AUTH.

## Submódulos

| Submódulo | Código | Carpeta | TCs | RN | FL |
|-----------|--------|---------|-----|----|----|
| Inicio de tienda y navegación | SHOP | `submodule-shop-landing/` | 10 | RN-CAT-001..006 | FL-CAT-001..002 |
| Listado por categoría | LIST | `submodule-category-listing/` | 20 | RN-CAT-010..024 | FL-CAT-010..013 |
| Detalle de producto | DETAIL | `submodule-product-detail/` | 8 | RN-CAT-030..035 | FL-CAT-030..031 |
| Badge del carrito y Add to Cart | BADGE | `submodule-cart-badge/` | 12 | RN-CAT-040..048 | FL-CAT-040..042 |
| **Total** | | | **50** | | |

## Hechos técnicos clave (observados)

- **Sesión requerida (solo en el cliente)**: cada página del catálogo ejecuta
  `if (!localStorage.getItem("isLoggedIn")) location.href = "index.php"`. El servidor responde HTTP 200
  con el HTML completo sin sesión y no usa cookies; la redirección ocurre en el navegador.
- **Datos del catálogo**: 85 productos estáticos en `js/products.js` (`window.PRODUCTS`). Women 1-20,
  Men 21-40, Kids 41-60, Electronics 61-85. No hay llamadas XHR/fetch: filtrado, búsqueda y orden se
  resuelven en el cliente.
- **Carrito**: `localStorage["cart"]` = `[{ id, qty }]`. El badge muestra `cart.length` (líneas
  distintas), no la suma de unidades.
- **Selectores**: todos los elementos relevantes tienen `data-testid` (ver `00-inventory.md` de cada
  submódulo). Los checkboxes de filtro son `custom-control` de Bootstrap: el `<label>` intercepta el clic,
  por lo que la automatización debe hacer clic en el label o usar `check({ force: true })`.

## Hallazgos y anomalías observadas (2026-11-20)

Candidatos a registrar en `qa/06-defects/` (no se crearon archivos fuera de este módulo). La
clasificación DEF/REC es propuesta y debe confirmarla el responsable de QA según la regla 8 del framework.

| ID propuesto | Hallazgo | Evidencia | Clasificación sugerida |
|---|---|---|---|
| H-CAT-01 | Error JS no controlado `loadProducts is not defined` al cargar las 4 páginas de categoría | `pageerror` en Playwright; la función no existe en `products.js`, `main.js` ni `qalabs-enhance.js` | DEF (técnico, sin impacto funcional visible) |
| H-CAT-02 | Error JS `$(...).owlCarousel is not a function` en `shop.php`, `product.php` y otras páginas | `pageerror` en Playwright | REC |
| H-CAT-03 | El enlace "Home" del breadcrumb en categoría y detalle apunta a `/`, que muestra el formulario de login aunque la sesión esté activa; en `shop.php` "Home" apunta a `#` | Navegación observada | DEF candidato (navegación inconsistente) |
| H-CAT-04 | El badge cuenta líneas distintas y no unidades: agregar 2 veces el mismo producto deja el badge en 1 (`qty: 2`) | `localStorage.cart` y badge observados | REC (pendiente confirmación de negocio) |
| H-CAT-05 | El badge no se sincroniza entre pestañas hasta recargar | Dos pestañas en el mismo contexto | REC |
| H-CAT-06 | El carrito persiste en `localStorage` tras el logout y no está asociado al usuario | `localStorage` después de logout | REC (privacidad en equipos compartidos) |
| H-CAT-07 | Control de acceso solo en el cliente: el servidor entrega el HTML sin sesión y cualquier valor no vacío de `isLoggedIn` (incluso `"false"`) habilita el acceso | `curl` HTTP 200; prueba con `isLoggedIn="false"` | REC de seguridad (derivar al proceso formal de ciberseguridad) |
| H-CAT-08 | Productos de color Yellow (id 8 "Frock" de Women, id 49 "Sharara" de Kids) no tienen opción de filtro de color y quedan excluidos al marcar cualquier color | `products.js` + filtros observados | REC |
| H-CAT-09 | En Electronics la línea "Model: {marca}" no tiene `data-testid` y el filtro de marca reutiliza la clase/id `size` | HTML observado | REC (testabilidad) |
| H-CAT-10 | "Add to Cart" no da retroalimentación visual (sin toast, alerta ni cambio de texto); solo cambia el badge | Observado | REC (usabilidad) |

## Siguiente etapa

Etapa 3 - Plan de pruebas (`/qa-test-plan`).
