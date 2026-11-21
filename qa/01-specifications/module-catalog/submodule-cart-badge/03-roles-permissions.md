# Roles y permisos - Badge del carrito y Add to Cart (BADGE)

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión (`user`) | Visitante sin sesión |
|-----------------|---------|---------|
| Ver badge | ✅ | ❌ (redirección a `index.php`) |
| Agregar al carrito | ✅ | ❌ |
| Navegar a cart.php | ✅ | ❌ |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (password) |
|------|----------------|-------------------|
| user (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

Valor de contraseña en documentación: `<PLACEHOLDER>`.

**Notas**: El carrito pertenece al navegador, no al usuario (H-CAT-06). La cuenta demo es pública y
compartida, pero como el carrito vive en `localStorage` las ejecuciones paralelas en contextos distintos no
se interfieren.
