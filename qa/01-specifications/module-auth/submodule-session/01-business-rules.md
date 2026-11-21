# Reglas de negocio - Autenticación: Sesión y cierre de sesión

### RN-AUTH-014: El login exitoso crea la sesión

- **Type**: State Machine
- **Trigger**: Login exitoso (RN-AUTH-006).
- **Behavior**: Se escribe `localStorage.isLoggedIn = "true"` y se redirige a `/shop.php`. El estado pasa de "sin sesión" a "con sesión".
- **Notes**: Observado 2026-11-20. No se crean cookies.

### RN-AUTH-015: Solo un usuario autenticado accede a las páginas protegidas

- **Type**: Access Control
- **Trigger**: Navegación a `/shop.php`, `/mens-wear.php`, `/womens-wear.php`, `/kids-wear.php`, `/electronics.php` o `/cart.php`.
- **Behavior**: Si no existe una sesión creada por un login exitoso, el usuario es redirigido a `/index.php` y no ve contenido protegido.
- **Notes**: Comportamiento observado: el guard redirige cuando `isLoggedIn` no existe (cumple). Incumplimientos observados: (a) cualquier valor no vacío de `isLoggedIn`, incluso `"false"`, concede acceso (ANOM-AUTH-01); (b) el servidor entrega el contenido completo con HTTP 200 a clientes sin sesión y con JavaScript deshabilitado el contenido queda visible (ANOM-AUTH-02).

### RN-AUTH-016: Cierre de sesión

- **Type**: State Machine
- **Trigger**: Clic en `header-logout-btn` en una página protegida.
- **Behavior**: Se elimina `localStorage.isLoggedIn` y se redirige a `/index.php`. A partir de ese momento cualquier página protegida redirige al login, incluso usando el botón "Atrás" del navegador.
- **Notes**: No elimina `rememberedEmail` (el email recordado sigue precargado).

### RN-AUTH-017: Visibilidad de los controles del encabezado

- **Type**: Access Control
- **Trigger**: Carga de cualquier página.
- **Behavior**: En las páginas protegidas con sesión se muestran el botón de logout y el carrito con su contador. En `/index.php` ambos controles están en el DOM pero ocultos, con o sin sesión.
- **Notes**: Con sesión activa, `/index.php` no redirige a la tienda (ANOM-AUTH-06, recomendación).

### RN-AUTH-018: Alcance de la sesión

- **Type**: State Machine
- **Trigger**: Uso de la aplicación en varias pestañas o contextos de navegador.
- **Behavior**: La sesión vive en el `localStorage` del origen: se comparte entre pestañas del mismo perfil/contexto, no existe en un contexto nuevo y no expira por tiempo. Si `isLoggedIn` se elimina durante la sesión, la siguiente navegación a una página protegida redirige a `/index.php`.
