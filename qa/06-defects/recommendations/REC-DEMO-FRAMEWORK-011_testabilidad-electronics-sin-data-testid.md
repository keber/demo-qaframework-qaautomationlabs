# Recomendación - REC-DEMO-FRAMEWORK-011: Electronics: línea "Model" sin data-testid y filtro de marca con id/clase "size"

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-011 |
| Título | Electronics: línea "Model" sin data-testid y filtro de marca con id/clase "size" |
| Categoría | Testabilidad |
| Módulo | CAT |
| Origen | H-CAT-09 |
| Reglas / flujos relacionados | RN-CAT-011, RN-CAT-019 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

La línea "Model: {marca}" no tiene `data-testid` y el filtro de marca reutiliza la clase/id `size`.

## Por qué no es un defecto

Ninguna regla de negocio se ve afectada. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Agregar `data-testid="product-meta-{id}"` en Electronics y usar un id/clase propios para el filtro de marca.
