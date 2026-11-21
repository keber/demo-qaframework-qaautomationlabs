# Módulo AUTH - Autenticación (login / logout)

| Campo | Valor |
|-------|-------|
| Código de módulo | AUTH |
| URL principal | {{QA_BASE_URL}}/index.php |
| Estado | Activo |
| Etapas completadas | Etapa 1 (análisis de módulo) y Etapa 2 (generación de especificaciones) |
| Última actualización | 2026-11-20 |

## Alcance

Inicio de sesión en `index.php` (email, contraseña, "Remember me", mostrar/ocultar contraseña,
autocompletado de credenciales demo, mensajes de validación), cierre de sesión desde el botón del
encabezado y control de acceso a las páginas protegidas (`shop.php`, `mens-wear.php`,
`womens-wear.php`, `kids-wear.php`, `electronics.php`, `cart.php`) sin sesión.

Fuera de alcance: el formulario de registro (`register.php`) como funcionalidad. Solo se documenta
su relación de dependencia con el login (usuarios registrados en `localStorage`).

## Submódulos

| Submódulo | Código | Carpeta | RN | FL | TCs |
|-----------|--------|---------|----|----|-----|
| Inicio de sesión | LOGIN | `submodule-login/` | RN-AUTH-001 a RN-AUTH-013 | FL-AUTH-001 a FL-AUTH-003 | 19 |
| Sesión y cierre de sesión | SES | `submodule-session/` | RN-AUTH-014 a RN-AUTH-018 | FL-AUTH-004 a FL-AUTH-006 | 12 |
| **Total** | | | **18** | **6** | **31** |

## Hallazgo arquitectónico clave

La autenticación es **100 % del lado del cliente**: no existe ninguna llamada XHR/fetch ni cookie de
sesión. El script de `index.php` compara las credenciales contra valores fijos en el JavaScript y
contra el arreglo `users` de `localStorage`; al tener éxito escribe `localStorage.isLoggedIn = "true"`
y redirige a `shop.php`. Cada página protegida ejecuta al final del `<body>` el guard
`if (!localStorage.getItem("isLoggedIn")) location.href = "index.php"`. Esto condiciona el diseño de
las pruebas (estado de sesión = `storageState` de `localStorage`, sin cookies).

## Anomalías observadas (2026-11-20)

| ID provisional | Severidad sugerida | Clasificación | Descripción | RN / TC relacionado |
|----------------|--------------------|---------------|-------------|---------------------|
| ANOM-AUTH-01 | Alta | Candidato a DEF | El guard acepta **cualquier** valor no vacío de `isLoggedIn`: con `localStorage.isLoggedIn = "false"` se accede a `shop.php` sin haber iniciado sesión. | RN-AUTH-015 / TC-AUTH-SES-010 |
| ANOM-AUTH-02 | Alta | Candidato a DEF | Las páginas protegidas responden HTTP 200 con el contenido completo a clientes sin sesión; la protección es solo una redirección JavaScript al final del `<body>` (con JavaScript deshabilitado, `shop.php` muestra las 4 tarjetas de categoría y el botón de logout). | RN-AUTH-015 / TC-AUTH-SES-011 |
| ANOM-AUTH-03 | Media | Recomendación (REC) | Las credenciales de la cuenta demo están embebidas en el JavaScript público y las contraseñas de usuarios registrados se guardan en texto plano en `localStorage.users`. Aceptable para una tienda demo, no para producción. | RN-AUTH-006, RN-AUTH-013 |
| ANOM-AUTH-04 | Baja | Recomendación (REC) | Presionar Enter en el campo de contraseña no envía el formulario (el botón no está dentro de un `<form>`); solo el clic en "Login" inicia sesión. | FL-AUTH-001 |
| ANOM-AUTH-05 | Baja | Recomendación (REC) | Con "Remember me" marcado, el email se guarda en `localStorage.rememberedEmail` aunque el login falle (validación o credenciales incorrectas). | RN-AUTH-010 |
| ANOM-AUTH-06 | Baja | Recomendación (REC) | Un usuario con sesión activa que visita `index.php` ve nuevamente el formulario de login (no se redirige a `shop.php`) y el encabezado oculta el botón de logout y el carrito. | RN-AUTH-017 |
| ANOM-AUTH-07 | Baja | Recomendación (REC) | La comparación de email distingue mayúsculas y minúsculas (`DEMO@DEMO.COM` es rechazado). | RN-AUTH-006 / TC-AUTH-LOGIN-009 |

> Los IDs `ANOM-AUTH-*` son provisionales. La creación de archivos `DEF-*` / `REC-*` en `qa/06-defects/`
> queda pendiente para la etapa correspondiente; ningún TC usará `test.fail()` sin su archivo DEF.

## Nota para automatización

Los títulos de las páginas contienen un guion largo tipográfico (por ejemplo, el título de `index.php`
comienza con "Sign In" y termina con "| QA Automation Labs"). Usar aserciones parciales o expresiones
regulares (`/Sign In/`) en lugar del texto completo.
