# Roles y permisos - Checkout y confirmación de orden

La aplicación tiene un único rol funcional (comprador). El control de acceso es exclusivamente del
lado del cliente (`localStorage.isLoggedIn`).

## Matriz de acceso

| Funcionalidad / Acción | Comprador con sesión | Visitante sin sesión |
|------------------------|----------------------|----------------------|
| Ver `checkout.php` | ✅ | ❌ (redirige a `index.php`) |
| Enviar el formulario de checkout | ✅ | ❌ |
| Ver `confirm.php` | ✅ | ❌ (redirige a `index.php`) |
| Realizar la orden ("Place Order") | ✅ | ❌ |
| Ver `thanks.php` | ✅ | ❌ (redirige a `index.php`) |
| Checkout con carrito vacío | ⚠️ (permitido por la app, contrario al spec: ANOM-CART-02) | ❌ |

## Usuarios de prueba

| Rol | Variable de entorno (email) | Variable de entorno (contraseña) |
|-----|-----------------------------|----------------------------------|
| Comprador (cuenta demo pública) | `QA_USER_EMAIL` | `QA_USER_PASSWORD` |

**Notas**:
- La contraseña nunca se documenta: usar `<PLACEHOLDER>` y las variables de entorno.
- El email del formulario de checkout es independiente del email de la cuenta: usar siempre datos
  ficticios (ver `04-test-data.md`).
