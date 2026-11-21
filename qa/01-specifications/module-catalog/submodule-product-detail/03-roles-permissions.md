# Roles y permisos - Detalle de producto (DETAIL)

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión (`user`) | Visitante sin sesión |
|-----------------|---------|---------|
| Ver detalle de producto | ✅ | ❌ (redirección a `index.php`) |
| Agregar al carrito desde el detalle | ✅ | ❌ |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (password) |
|------|----------------|-------------------|
| user (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

Valor de contraseña en documentación: `<PLACEHOLDER>`.

**Notas**: Mismo control solo en el cliente que el resto del catálogo (H-CAT-07).
