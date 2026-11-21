# MÓDULO: Autenticación - Submódulo: Sesión y cierre de sesión

| Campo | Valor |
|-------|-------|
| Código de módulo | AUTH |
| Código de submódulo | SES |
| URL principal | {{QA_BASE_URL}}/shop.php (y demás páginas protegidas) |
| Estado | Activo |
| Última actualización | 2026-11-20 |
| Fuente | Exploración con Playwright (Chromium, con y sin JavaScript) y `curl`, sesión 2026-11-20 |

## Páginas protegidas

| Página | Respuesta HTTP sin sesión | Comportamiento en navegador sin sesión |
|--------|---------------------------|----------------------------------------|
| `/shop.php` | 200 con contenido completo | Redirección JS a `/index.php` |
| `/mens-wear.php` | 200 con contenido completo | Redirección JS a `/index.php` |
| `/womens-wear.php` | 200 | Redirección JS a `/index.php` |
| `/kids-wear.php` | 200 | Redirección JS a `/index.php` |
| `/electronics.php` | 200 con contenido completo | Redirección JS a `/index.php` |
| `/cart.php` | 200 | Redirección JS a `/index.php` |

Mecanismo del guard (al final del `<body>` de cada página protegida):
`if (!localStorage.getItem("isLoggedIn")) location.href = "index.php";`

No existe `/logout.php` (HTTP 404); el cierre de sesión es solo JavaScript.

## Elementos de UI

| Elemento | Selector (data-testid) | Tipo | Notas |
|----------|------------------------|------|-------|
| Encabezado | `site-header` | header | Común a todas las páginas |
| Botón logout | `header-logout-btn` (`#logoutBtn`) | button (icono) | `title`/`aria-label` "Logout". Visible en páginas protegidas; oculto en `/index.php` |
| Enlace carrito | `header-cart-link` | enlace | Visible en páginas protegidas; oculto en `/index.php` |
| Contador del carrito | `header-cart-count` | span | Muestra la cantidad de ítems de `localStorage.cart` ("0" tras login sin carrito) |
| Indicador de página tienda | `breadcrumb-current` | texto | "Shop" en `/shop.php` |
| Tarjetas de categoría | `category-card-men`, `category-card-women`, `category-card-kids`, `category-card-electronics` | tarjetas | 4 en `/shop.php` |

## Estado de sesión

| Clave `localStorage` | Efecto |
|----------------------|--------|
| `isLoggedIn` | Cualquier valor no vacío habilita el acceso (incluido `"false"`, ANOM-AUTH-01) |
| `rememberedEmail` | No se elimina en el logout |
| `cart` | Gestionado por el módulo CART; no se limpia en el logout (no verificado en esta sesión) |

Sin cookies de sesión ni expiración: la sesión dura mientras exista `isLoggedIn` en el `localStorage` del origen.

## API Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /shop.php, /mens-wear.php, /womens-wear.php, /kids-wear.php, /electronics.php, /cart.php | Documentos protegidos (sin validación en servidor) |
| GET | /index.php | Destino de la redirección del guard y del logout |

No se observaron llamadas XHR/fetch asociadas a sesión o logout.
