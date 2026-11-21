# Módulo CART - Carrito y checkout

| Campo | Valor |
|-------|-------|
| Código de módulo | CART |
| URL principal | {{QA_BASE_URL}}/cart.php |
| Estado | Activo |
| Etapas completadas | Etapas 1 a 5b (Sprint 1): especificaciones, plan, 38 TCs automatizados y estabilizados (34 pasan, 4 `test.fail()` sobre DEF-DEMO-FRAMEWORK-003, 004 y 005) |
| Última actualización | 2026-11-20 |

## Alcance

Gestión del carrito (agregar productos desde las páginas de catálogo, actualizar cantidad, eliminar
productos, cálculo de subtotales y total, estado de carrito vacío, contador del encabezado) y el
recorrido completo de compra: formulario de checkout (`checkout.php`) con sus validaciones, página
de confirmación de datos (`confirm.php`) y página de orden exitosa (`thanks.php`).

Fuera de alcance: filtros, búsqueda y ordenamiento del catálogo (módulo CAT) y el inicio/cierre de
sesión (módulo AUTH). Solo se documenta la dependencia del carrito con ambos.

## Submódulos

| Submódulo | Código | Carpeta | RN | FL | TCs |
|-----------|--------|---------|----|----|-----|
| Gestión del carrito | GEST | `submodule-cart-management/` | RN-CART-001 a RN-CART-012 | FL-CART-001 a FL-CART-003 | 18 |
| Checkout y confirmación de orden | CHK | `submodule-checkout/` | RN-CART-013 a RN-CART-027 | FL-CART-004 a FL-CART-007 | 20 |
| **Total** | | | **27** | **7** | **38** |

## Hallazgo arquitectónico clave

El carrito y el checkout son **100 % del lado del cliente**. Durante todo el recorrido (agregar,
modificar, eliminar, checkout, confirmación y "Place Order") el navegador solo realiza peticiones
`GET` de navegación a las páginas PHP; no existe ninguna llamada XHR/fetch ni `POST`.

- El carrito vive en `localStorage.cart` como arreglo JSON `[{ "id": <número>, "qty": <número> }]`.
- El catálogo de precios sale del archivo estático `js/products.js` (`window.PRODUCTS`, 85 productos:
  Women 1-20, Men 21-40, Kids 41-60, Electronics 61-85).
- Los datos del formulario de checkout se guardan en `localStorage.user` y se muestran en
  `confirm.php`; `thanks.php` borra `cart` y `user` al cargarse.
- **Estado no compartido entre sesiones**: dos contextos de navegador con la misma cuenta demo tienen
  carritos independientes (verificado: el segundo contexto ve el carrito vacío mientras el primero
  tiene productos). La cuenta demo compartida por otros agentes no interfiere con el carrito.
- El carrito **sobrevive al logout** (el logout solo borra `isLoggedIn`) y reaparece al volver a
  iniciar sesión en el mismo navegador.

## Anomalías observadas (2026-11-20)

| ID provisional | Severidad sugerida | Registro final | Descripción | RN / TC relacionado |
|----------------|--------------------|---------------|-------------|---------------------|
| ANOM-CART-01 | Media | DEF-DEMO-FRAMEWORK-003 | El campo cantidad acepta `0` (pese a `min="1"`): el producto permanece en el carrito con subtotal `$0` y sigue contando en el encabezado. | RN-CART-005 / TC-CART-GEST-009 |
| ANOM-CART-02 | Alta | DEF-DEMO-FRAMEWORK-004 | Se puede completar el checkout con el carrito vacío (navegando directo a `checkout.php`): "Continue" lleva a `confirm.php` con total `$0` y "Place Order" muestra "Your order has been placed successfully.". | RN-CART-025 / TC-CART-CHK-016 |
| ANOM-CART-03 | Media | DEF-DEMO-FRAMEWORK-005 | `confirm.php` y `thanks.php` son accesibles sin haber completado el checkout: `confirm.php` muestra el texto `undefined` en todos los datos del cliente y `thanks.php` anuncia una orden exitosa. | RN-CART-026 / TC-CART-CHK-017, TC-CART-CHK-018 |
| ANOM-CART-04 | Media | REC-DEMO-FRAMEWORK-013 | `confirm.php` inserta los datos ingresados por el usuario mediante `innerHTML` sin escapar (riesgo de XSS almacenado en `localStorage`). Detectado por inspección del código fuente; no se ejecutó ninguna carga ofensiva. | RN-CART-021 |
| ANOM-CART-05 | Baja | REC-DEMO-FRAMEWORK-014 | Los datos personales del checkout (nombre, email, teléfono, dirección) quedan en texto plano en `localStorage.user` hasta llegar a `thanks.php`; si el usuario abandona en `confirm.php`, permanecen indefinidamente. | RN-CART-020 |
| ANOM-CART-06 | Baja | REC-DEMO-FRAMEWORK-015 | El teléfono solo valida longitud (10 caracteres): `0000000000` es aceptado. | RN-CART-017 / TC-CART-CHK-009 |
| ANOM-CART-07 | Baja | REC-DEMO-FRAMEWORK-016 | Al volver desde `confirm.php` con "Go To Back", el formulario de checkout aparece vacío (los datos guardados en `localStorage.user` no se recargan). | RN-CART-022 / TC-CART-CHK-014 |
| ANOM-CART-08 | Baja | REC-DEMO-FRAMEWORK-007 | El contador del encabezado muestra la cantidad de **productos distintos**, no de unidades (2 unidades del mismo producto = contador 1). | RN-CART-002 |
| ANOM-CART-09 | Baja | REC-DEMO-FRAMEWORK-006 | Todas las páginas del recorrido lanzan el error JavaScript `$(...).owlCarousel is not a function` y las páginas de categoría `loadProducts is not defined`; no bloquean el flujo del carrito. | - |
| ANOM-CART-10 | Baja | REC-DEMO-FRAMEWORK-017 | El formato del total es inconsistente: `cart.php` muestra "Total: $1050" y `checkout.php`/`confirm.php` muestran "$1050". | RN-CART-007 |

> Los IDs `ANOM-CART-*` fueron provisionales; la columna "Registro final" indica el archivo creado en
> `qa/06-defects/open/` (DEF) o `qa/06-defects/recommendations/` (REC). Solo los DEF justifican
> `test.fail()` (TC-CART-GEST-009, TC-CART-CHK-016, TC-CART-CHK-017 y TC-CART-CHK-018).

## Notas para automatización

- Los títulos de las páginas contienen un guion largo tipográfico; usar aserciones parciales o
  expresiones regulares (`/Cart/`, `/Checkout/`, `/Order Confirmation/`, `/Thank You/`).
- El evento que recalcula la cantidad es `change` (se dispara con Tab/Enter o al perder el foco), no
  `input`.
- Como el estado es `localStorage`, cada test puede preparar el carrito con
  `page.evaluate(() => localStorage.setItem('cart', ...))` o vía UI; el `storageState` del login debe
  incluir `isLoggedIn`.
