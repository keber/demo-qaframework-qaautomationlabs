# Roles y permisos - Gestión del carrito

La aplicación tiene un único rol funcional (comprador). El control de acceso es exclusivamente del
lado del cliente (`localStorage.isLoggedIn`).

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión | Visitante sin sesión |
|------------------------|----------------------|----------------------|
| Ver `cart.php` | ✅ | ❌ (redirige a `index.php`) |
| Agregar productos desde el catálogo | ✅ | ❌ (las páginas de catálogo redirigen a `index.php`) |
| Modificar cantidad | ✅ | ❌ |
| Eliminar productos | ✅ | ❌ |
| Proceder al checkout | ✅ (solo con carrito no vacío) | ❌ |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (contraseña) |
|-----|-----------------------------|----------------------------------|
| Comprador (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

**Notas**:
- La contraseña nunca se documenta: usar `<PLACEHOLDER>` y las variables de entorno.
- Como el servidor responde HTTP 200 a visitantes sin sesión, la restricción ❌ depende de que el
  navegador ejecute JavaScript.
- El carrito no está ligado a la cuenta: varios agentes o workers con la misma cuenta demo no
  comparten carrito porque cada contexto de navegador tiene su propio `localStorage`.
