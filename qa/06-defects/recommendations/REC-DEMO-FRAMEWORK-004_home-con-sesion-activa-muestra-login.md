# Recomendación - REC-DEMO-FRAMEWORK-004: Con sesión activa, index.php y el enlace "Home" muestran el formulario de login

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-004 |
| Título | Con sesión activa, index.php y el enlace "Home" muestran el formulario de login |
| Categoría | Navegación / usabilidad |
| Módulo | AUTH / CAT |
| Origen | ANOM-AUTH-06, H-CAT-03 |
| Reglas / flujos relacionados | RN-AUTH-017, RN-CAT-005, RN-CAT-023 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Un usuario con sesión que visita `index.php` (o hace click en "Home" del breadcrumb en categorías y detalle, que apunta a `/`) ve el formulario de login, con el encabezado sin logout ni carrito. En `shop.php` "Home" apunta a `#`.

## Por qué no es un defecto

H-CAT-03 se propuso como DEF, pero ninguna regla define el destino esperado de "Home" (RN-CAT-023 documenta el comportamiento actual y TC-CAT-LIST-020 indica que no se crea TC hasta que negocio lo defina). Se clasifica como REC conforme a la regla 8. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Definir con negocio el destino de "Home"; sugerencia: redirigir a `shop.php` cuando exista sesión y unificar el `href` de "Home" en todas las páginas.
