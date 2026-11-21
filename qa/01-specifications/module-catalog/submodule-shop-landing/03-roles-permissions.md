# Roles y permisos - Inicio de tienda y navegación (SHOP)

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión (`user`) | Visitante sin sesión |
|-----------------|---------|---------|
| Ver shop.php | ✅ | ❌ (redirección a `index.php`) |
| Ver tarjetas de categoría | ✅ | ❌ |
| Navegar a una categoría | ✅ | ❌ |
| Ver badge del carrito | ✅ | ❌ |
| Logout | ✅ | No aplica |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (password) |
|------|----------------|-------------------|
| user (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

Valor de contraseña en documentación: `<PLACEHOLDER>`.

**Notas**: La aplicación tiene un solo rol. El "permiso" depende únicamente de la clave `isLoggedIn` en
`localStorage`; no hay control del lado del servidor (hallazgo H-CAT-07).
