# 06-defects/recommendations/

Use this folder for findings that violate no business rule: technical debt, usability,
clarity, accessibility, testability, latent risk. They are recommendations, not defects.

- Before filing here, confirm that no source (spec, business rule, functional document,
  code) requires the behavior. If one does, it is a defect: file it in open/.
- Identifier: REC-{PREFIX}-NNN, with its own numbering. Never reuse a DEF number.
- A recommendation never justifies a test.fail() or a defect marker in automation, and
  it is not opened as a Bug in the work tracker.
- If a finding filed as a defect turns out to be a recommendation, move it here with a
  new REC id and leave the old DEF number retired, with a note pointing to the REC.
- If a source later defines the rule, move the file back to open/ as a defect, citing
  that source.

## Índice - demo-framework (Sprint 1)

17 recomendaciones registradas el 2026-11-20. Ninguna justifica `test.fail()`; los defectos están
en `../open/` (DEF-DEMO-FRAMEWORK-001..005).

| ID | Título | Categoría | Origen (ID provisional) |
|---|---|---|---|
| [REC-DEMO-FRAMEWORK-001](REC-DEMO-FRAMEWORK-001_credenciales-demo-y-contrasenas-en-texto-plano.md) | Credenciales demo embebidas en el JavaScript y contraseñas en texto plano en localStorage | Seguridad | ANOM-AUTH-03 |
| [REC-DEMO-FRAMEWORK-002](REC-DEMO-FRAMEWORK-002_enter-no-envia-formulario-login.md) | Presionar Enter en la contraseña no envía el formulario de login | Usabilidad / accesibilidad | ANOM-AUTH-04 |
| [REC-DEMO-FRAMEWORK-003](REC-DEMO-FRAMEWORK-003_remember-me-guarda-email-en-login-fallido.md) | "Remember me" guarda el email aunque el login falle | Usabilidad / privacidad | ANOM-AUTH-05 |
| [REC-DEMO-FRAMEWORK-004](REC-DEMO-FRAMEWORK-004_home-con-sesion-activa-muestra-login.md) | Con sesión activa, index.php y el enlace "Home" muestran el formulario de login | Navegación / usabilidad | ANOM-AUTH-06, H-CAT-03 |
| [REC-DEMO-FRAMEWORK-005](REC-DEMO-FRAMEWORK-005_email-login-distingue-mayusculas.md) | La comparación de email en el login distingue mayúsculas y minúsculas | Usabilidad | ANOM-AUTH-07 |
| [REC-DEMO-FRAMEWORK-006](REC-DEMO-FRAMEWORK-006_errores-javascript-no-controlados.md) | Errores JavaScript no controlados en las páginas de la tienda | Deuda técnica | H-CAT-01, H-CAT-02, ANOM-CART-09 |
| [REC-DEMO-FRAMEWORK-007](REC-DEMO-FRAMEWORK-007_badge-cuenta-lineas-no-unidades.md) | El contador del carrito cuenta productos distintos y no unidades | Usabilidad (pendiente confirmación de negocio) | H-CAT-04, ANOM-CART-08 |
| [REC-DEMO-FRAMEWORK-008](REC-DEMO-FRAMEWORK-008_badge-no-sincroniza-entre-pestanas.md) | El badge del carrito no se sincroniza entre pestañas | Usabilidad | H-CAT-05 |
| [REC-DEMO-FRAMEWORK-009](REC-DEMO-FRAMEWORK-009_carrito-persiste-tras-logout.md) | El carrito persiste tras el logout y no está asociado al usuario | Privacidad (equipos compartidos) | H-CAT-06 |
| [REC-DEMO-FRAMEWORK-010](REC-DEMO-FRAMEWORK-010_productos-yellow-sin-filtro-color.md) | Productos de color Yellow no son alcanzables por ningún filtro de color | Funcional / datos | H-CAT-08 |
| [REC-DEMO-FRAMEWORK-011](REC-DEMO-FRAMEWORK-011_testabilidad-electronics-sin-data-testid.md) | Electronics: línea "Model" sin data-testid y filtro de marca con id/clase "size" | Testabilidad | H-CAT-09 |
| [REC-DEMO-FRAMEWORK-012](REC-DEMO-FRAMEWORK-012_add-to-cart-sin-retroalimentacion.md) | "Add to Cart" no da retroalimentación visual | Usabilidad | H-CAT-10 |
| [REC-DEMO-FRAMEWORK-013](REC-DEMO-FRAMEWORK-013_confirm-inserta-datos-con-innerhtml.md) | confirm.php inserta los datos del usuario con innerHTML sin escapar | Seguridad (observación por lectura de código) | ANOM-CART-04 |
| [REC-DEMO-FRAMEWORK-014](REC-DEMO-FRAMEWORK-014_datos-personales-en-localstorage.md) | Datos personales del checkout en texto plano en localStorage | Privacidad / protección de datos | ANOM-CART-05 |
| [REC-DEMO-FRAMEWORK-015](REC-DEMO-FRAMEWORK-015_telefono-solo-valida-longitud.md) | El teléfono del checkout solo valida longitud | Calidad de datos | ANOM-CART-06 |
| [REC-DEMO-FRAMEWORK-016](REC-DEMO-FRAMEWORK-016_go-to-back-confirm-formulario-vacio.md) | "Go To Back" desde la confirmación deja el formulario de checkout vacío | Usabilidad | ANOM-CART-07 |
| [REC-DEMO-FRAMEWORK-017](REC-DEMO-FRAMEWORK-017_formato-total-inconsistente.md) | Formato del total inconsistente entre carrito y checkout | Consistencia de UI | ANOM-CART-10 |
