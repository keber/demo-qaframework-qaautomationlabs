# Recomendación - REC-DEMO-FRAMEWORK-005: La comparación de email en el login distingue mayúsculas y minúsculas

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-005 |
| Título | La comparación de email en el login distingue mayúsculas y minúsculas |
| Categoría | Usabilidad |
| Módulo | AUTH |
| Origen | ANOM-AUTH-07 |
| Reglas / flujos relacionados | RN-AUTH-006 |
| TCs que documentan el comportamiento | TC-AUTH-LOGIN-009 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

`DEMO@DEMO.COM` con la contraseña correcta es rechazado.

## Por qué no es un defecto

RN-AUTH-006 define la comparación exacta; TC-AUTH-LOGIN-009 valida ese comportamiento. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Normalizar el email a minúsculas antes de comparar (los emails no distinguen mayúsculas en la práctica).
