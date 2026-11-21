# Recomendación - REC-DEMO-FRAMEWORK-010: Productos de color Yellow no son alcanzables por ningún filtro de color

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-010 |
| Título | Productos de color Yellow no son alcanzables por ningún filtro de color |
| Categoría | Funcional / datos |
| Módulo | CAT |
| Origen | H-CAT-08 |
| Reglas / flujos relacionados | RN-CAT-024 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Los productos id 8 "Frock" (Women) e id 49 "Sharara" (Kids) son Yellow y no existe esa opción de filtro: quedan excluidos al marcar cualquier color.

## Por qué no es un defecto

RN-CAT-024 documenta la limitación como condición de la dependencia. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Agregar la opción Yellow o derivar las opciones de filtro desde `window.PRODUCTS`.
