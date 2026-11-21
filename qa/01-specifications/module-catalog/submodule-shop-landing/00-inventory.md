# MÓDULO: Catálogo - Submódulo: Inicio de tienda y navegación

| Campo | Valor |
|-------|-------|
| Código de módulo | CAT |
| Código de submódulo | SHOP |
| URL principal | https://shop.qaautomationlabs.com/shop.php |
| Título de página | "Shop - E-commerce Demo App for UI Automation Practice \| QA Automation Labs" (el original usa un guion largo entre "Shop" y "E-commerce") |
| Estado | Activo |
| Última actualización | 2026-11-20 |

## Elementos de UI

### Cabecera (compartida por todas las páginas del catálogo)

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Cabecera | `site-header` | contenedor | |
| Logo (enlace) | `header-logo-link` / `header-logo` | enlace + imagen | `href="shop.php"` |
| Barra de navegación | `main-navbar` | nav | Enlaces externos a qaautomationlabs.com salvo `nav-shop` |
| Enlace Shop | `nav-shop` | enlace | `href="shop.php"`, clase `active`; oculto bajo 1350 px (menú hamburguesa sin `data-testid`) |
| Enlace al carrito | `header-cart-link` | enlace | `href="cart.php"` |
| Badge del carrito | `header-cart-count` | span | Ver submódulo BADGE |
| Logout | `header-logout-btn` | botón | Elimina `isLoggedIn` y redirige a `index.php` (módulo AUTH) |
| Búsqueda de cabecera | `header-search` | input search | Formulario GET a `https://qaautomationlabs.com/` (búsqueda del sitio externo, no del catálogo) |

### Contenido de shop.php

| Elemento | data-testid | Tipo | Notas |
|----------|-------------|------|-------|
| Breadcrumb | `breadcrumb` | nav | Texto "Home Shop" |
| Breadcrumb Home | `breadcrumb-home` | enlace | `href="#"` (no navega) |
| Breadcrumb actual | `breadcrumb-current` | enlace | Texto "Shop", `href="shop.php"` |
| Tarjeta Men | `category-card-men` / `category-title-men` | tarjeta | Título "Men Fashion" |
| Botón Shop Now Men | `shop-now-mens-wear` | enlace | `href="mens-wear.php"` |
| Tarjeta Women | `category-card-women` / `category-title-women` | tarjeta | Título "Women Fashion" |
| Botón Shop Now Women | `shop-now-womens-wear` | enlace | `href="womens-wear.php"` |
| Tarjeta Kids | `category-card-kids` / `category-title-kids` | tarjeta | Título "Kids Fashion" |
| Botón Shop Now Kids | `shop-now-kids-wear` | enlace | `href="kids-wear.php"` |
| Tarjeta Electronics | `category-card-electronics` / `category-title-electronics` | tarjeta | Título "Electronics" |
| Botón Shop Now Electronics | `shop-now-electronics` | enlace | `href="electronics.php"` |
| Pie de página | `footer`, `footer-copyright`, `footer-brand-link` | contenedor | "(c) 2026 QA Automation Labs. All Rights Reserved." |
| Volver arriba | `back-to-top` | enlace | |
| Barra de la capa de mejora | `qa-toolbar`, `qa-inspect-toggle`, `qa-dark-toggle`, `qa-challenge-toggle` | botones | Inyectada por `assets/qalabs-enhance.js`; fuera de alcance funcional |

`shop.php` no muestra productos ni campo de búsqueda del catálogo: solo las 4 tarjetas de categoría.

## Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /shop.php | Documento HTML (HTTP 200 incluso sin sesión; la protección es JavaScript del cliente) |
| GET | /mens-wear.php, /womens-wear.php, /kids-wear.php, /electronics.php | Navegación a categorías |

No se observaron llamadas XHR/fetch. No se usan cookies de sesión.

## Errores de consola observados

- `$(...).owlCarousel is not a function` al cargar `shop.php` (hallazgo H-CAT-02).
