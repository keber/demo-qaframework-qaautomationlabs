# Recomendación - REC-DEMO-FRAMEWORK-012: "Add to Cart" no da retroalimentación visual

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-012 |
| Título | "Add to Cart" no da retroalimentación visual |
| Categoría | Usabilidad |
| Módulo | CAT |
| Origen | H-CAT-10 |
| Reglas / flujos relacionados | RN-CAT-045 |
| TCs que documentan el comportamiento | TC-CAT-BADGE-008 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Al agregar no aparece toast, alerta ni cambio de texto; la única señal es el badge.

## Por qué no es un defecto

RN-CAT-045 define explícitamente la ausencia de retroalimentación. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Mostrar una confirmación no bloqueante (toast) o un cambio temporal del texto del botón.
