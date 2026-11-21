# MÓDULO: Autenticación - Submódulo: Inicio de sesión

| Campo | Valor |
|-------|-------|
| Código de módulo | AUTH |
| Código de submódulo | LOGIN |
| URL principal | {{QA_BASE_URL}}/index.php |
| Estado | Activo |
| Última actualización | 2026-11-20 |
| Fuente | Exploración con Playwright (Chromium) y lectura del HTML/JS servido, sesión 2026-11-20 |

## Navegación

| Elemento | Valor observado |
|----------|-----------------|
| Ruta | `/index.php` (la URL canónica declarada es `/`) |
| Título de la página | Contiene "Sign In" y termina en "QA Automation Labs" (incluye un guion tipográfico: usar regex `/Sign In/`) |
| Encabezado del formulario | `Sign in` (h3 dentro de `[data-testid=login-form]`) |
| Destino tras login exitoso | `/shop.php` (breadcrumb `[data-testid=breadcrumb-current]` = "Shop", 4 tarjetas `[data-testid^=category-card-]`) |

## Elementos de UI

| Elemento | Selector (data-testid) | Tipo | Obligatorio | Notas |
|----------|------------------------|------|-------------|-------|
| Tarjeta de login | `login-card` | contenedor | - | Incluye panel informativo `login-hero` |
| Formulario | `login-form` | `div` (no es `<form>`) | - | Por eso Enter no envía (ANOM-AUTH-04) |
| Email | `login-email-input` (`#email`) | `input type=email` | Sí | Placeholder "Email". Sin atributos `required` ni `maxlength`; validación solo por JavaScript al hacer clic en Login |
| Error de email | `login-email-error` (`#emailerror`) | `p role=alert` | - | Vacío/oculto por defecto |
| Contraseña | `login-password-input` (`#password`) | `input type=password` | Sí | Placeholder "Password", `autocomplete=current-password` |
| Mostrar/ocultar contraseña | `login-password-toggle` (`#togglePassword`) | `button type=button` | No | Alterna `type` password/text; `title`/`aria-label` alterna "Show password" / "Hide password" |
| Error de contraseña | `login-password-error` (`#passerror`) | `p role=alert` | - | Vacío/oculto por defecto |
| Remember me | `login-remember-me` (`#rememberMe`) | checkbox | No | Desmarcado por defecto; la etiqueta "Remember me" también lo alterna |
| Error general | `login-error-message` (`#errorMsg`) | `p role=alert` | - | Credenciales inválidas |
| Botón Login | `login-submit-btn` (`#loginBtn`) | button | - | Texto "Login" |
| Autocompletar demo | `login-autofill-demo` (`#autofillDemo`) | button | No | Texto "Autofill demo credentials" |
| Caja de credenciales demo | `login-demo-credentials` (`demo-email`, `demo-password`) | texto | - | Publica en pantalla el email y la contraseña de la cuenta demo |
| Enlace de registro | `register-link` | enlace | - | "Register Here" -> `/register.php` |
| Encabezado: logout | `header-logout-btn` | button | - | Presente en el DOM pero **oculto** en `index.php` (`#rightside` oculto) |
| Encabezado: carrito | `header-cart-link` / `header-cart-count` | enlace | - | Presente en el DOM pero **oculto** en `index.php` |

## Mensajes de validación (texto exacto)

| Selector | Texto |
|----------|-------|
| `login-email-error` | "Please enter your email." |
| `login-email-error` | "Please enter a valid email address." |
| `login-password-error` | "Please enter your password." |
| `login-password-error` | "Password must be at least 4 characters long." |
| `login-error-message` | "Invalid email or password!" |

## Almacenamiento cliente (localStorage)

| Clave | Escrita por | Valor |
|-------|-------------|-------|
| `isLoggedIn` | Login exitoso | `"true"` |
| `rememberedEmail` | Clic en Login con "Remember me" marcado | Email ingresado (recortado) |
| `users` | `register.php` (otro flujo) | Arreglo JSON de usuarios registrados, incluye la contraseña en texto plano |

No se crean cookies de sesión.

## API Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | /index.php | Página de login (documento) |
| GET | /shop.php | Destino tras login exitoso (documento) |

No se observaron llamadas XHR/fetch durante el login: la validación de credenciales ocurre íntegramente en el navegador.
