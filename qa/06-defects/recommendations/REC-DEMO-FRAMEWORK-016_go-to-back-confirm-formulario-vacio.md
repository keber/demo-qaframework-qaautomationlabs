# Recomendación - REC-DEMO-FRAMEWORK-016: "Go To Back" desde la confirmación deja el formulario de checkout vacío

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-016 |
| Título | "Go To Back" desde la confirmación deja el formulario de checkout vacío |
| Categoría | Usabilidad |
| Módulo | CART |
| Origen | ANOM-CART-07 |
| Reglas / flujos relacionados | RN-CART-022 |
| TCs que documentan el comportamiento | TC-CART-CHK-014 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Al volver desde `confirm.php`, los datos guardados en `localStorage.user` no se recargan en el formulario.

## Por qué no es un defecto

RN-CART-022 documenta el formulario vacío. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Precargar el formulario desde `localStorage.user` al volver.
