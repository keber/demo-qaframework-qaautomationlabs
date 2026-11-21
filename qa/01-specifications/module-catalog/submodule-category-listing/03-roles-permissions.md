# Roles y permisos - Listado por categoría (LIST)

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión (`user`) | Visitante sin sesión |
|-----------------|---------|---------|
| Ver listado de categoría | ✅ | ❌ (redirección a `index.php`) |
| Filtrar / buscar / ordenar | ✅ | ❌ |
| Abrir detalle de producto | ✅ | ❌ |
| Agregar al carrito desde el listado | ✅ | ❌ |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (password) |
|------|----------------|-------------------|
| user (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

Valor de contraseña en documentación: `<PLACEHOLDER>`.

**Notas**: Un solo rol. La restricción es solo del lado del cliente (H-CAT-07): el HTML y `js/products.js`
se descargan sin sesión.
