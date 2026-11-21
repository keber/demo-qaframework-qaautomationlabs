# Recomendación - REC-DEMO-FRAMEWORK-007: El contador del carrito cuenta productos distintos y no unidades

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-007 |
| Título | El contador del carrito cuenta productos distintos y no unidades |
| Categoría | Usabilidad (pendiente confirmación de negocio) |
| Módulo | CAT / CART |
| Origen | H-CAT-04, ANOM-CART-08 |
| Reglas / flujos relacionados | RN-CAT-040, RN-CAT-042, RN-CART-002 |
| TCs que documentan el comportamiento | TC-CAT-BADGE-003 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Agregar dos veces el mismo producto deja el badge en 1 (`qty: 2`).

## Por qué no es un defecto

Las reglas vigentes definen el conteo por líneas. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Confirmar con negocio si el badge debe mostrar unidades. Si se define así, mover a `open/` como defecto y cambiar el esperado de TC-CAT-BADGE-003.
