# Roles y permisos - Inicio de sesión

La aplicación no tiene roles diferenciados: existe un único tipo de usuario autenticado (comprador),
ya sea la cuenta demo o un usuario registrado en `localStorage.users`.

## Matriz de acceso

| Funcionalidad / acción | Visitante sin sesión | Comprador (cuenta demo) | Comprador (usuario registrado) |
|------------------------|----------------------|-------------------------|--------------------------------|
| Ver página de login `/index.php` | ✅ | ✅ (no se redirige, ANOM-AUTH-06) | ✅ |
| Iniciar sesión | ✅ | ✅ | ✅ (solo en el navegador donde se registró) |
| Autocompletar credenciales demo | ✅ | ✅ | ✅ |
| Ver botón de logout en el header de `/index.php` | ❌ | ❌ (oculto) | ❌ (oculto) |
| Acceder a `/shop.php` tras login | ❌ | ✅ | ✅ |

## Usuarios de prueba

| Rol | Variable (email) | Variable (contraseña) |
|-----|------------------|-----------------------|
| Comprador demo (`user`) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

**Notas**:
- Valores reales: `<PLACEHOLDER>` (definidos solo en variables de entorno, nunca en documentación).
- Un usuario registrado se puede provisionar sembrando `localStorage.users` en el contexto del test (ver `04-test-data.md`), sin depender de `register.php`.
