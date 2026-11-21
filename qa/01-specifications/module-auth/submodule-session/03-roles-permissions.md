# Roles y permisos - Sesión y cierre de sesión

Rol único de comprador autenticado; el visitante sin sesión es el otro estado relevante.

## Matriz de acceso

| Funcionalidad / acción | Visitante sin sesión | Comprador autenticado |
|------------------------|----------------------|-----------------------|
| Ver `/shop.php` | ❌ (redirige a login) ⚠️ ver ANOM-AUTH-02 | ✅ |
| Ver `/mens-wear.php`, `/womens-wear.php`, `/kids-wear.php`, `/electronics.php` | ❌ (redirige a login) | ✅ |
| Ver `/cart.php` | ❌ (redirige a login) | ✅ |
| Ver botón de logout | ❌ | ✅ (solo en páginas protegidas) |
| Cerrar sesión | ❌ | ✅ |

⚠️ La restricción se aplica solo en el navegador con JavaScript habilitado; el servidor entrega el
contenido a cualquier cliente (ANOM-AUTH-02), y un `isLoggedIn` con cualquier valor no vacío
concede acceso (ANOM-AUTH-01).

## Usuarios de prueba

| Rol | Variable (email) | Variable (contraseña) |
|-----|------------------|-----------------------|
| Comprador demo (`user`) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

**Notas**:
- Valores reales: `<PLACEHOLDER>`.
- `storageState` configurado para el lane 1: `.auth/user-default.json`. Como la sesión es solo `localStorage`, ese archivo debe contener el origen con `isLoggedIn = "true"`.
