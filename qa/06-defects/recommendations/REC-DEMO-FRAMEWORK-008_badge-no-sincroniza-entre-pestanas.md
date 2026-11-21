# Recomendación - REC-DEMO-FRAMEWORK-008: El badge del carrito no se sincroniza entre pestañas

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-008 |
| Título | El badge del carrito no se sincroniza entre pestañas |
| Categoría | Usabilidad |
| Módulo | CAT |
| Origen | H-CAT-05 |
| Reglas / flujos relacionados | RN-CAT-046 |
| TCs que documentan el comportamiento | TC-CAT-BADGE-010 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Otra pestaña abierta mantiene el valor anterior del badge hasta recargar.

## Por qué no es un defecto

RN-CAT-046 documenta el comportamiento actual. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Escuchar el evento `storage` de `window` para actualizar el badge.
