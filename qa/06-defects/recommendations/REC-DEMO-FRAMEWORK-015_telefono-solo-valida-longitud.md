# Recomendación - REC-DEMO-FRAMEWORK-015: El teléfono del checkout solo valida longitud

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-015 |
| Título | El teléfono del checkout solo valida longitud |
| Categoría | Calidad de datos |
| Módulo | CART |
| Origen | ANOM-CART-06 |
| Reglas / flujos relacionados | RN-CART-017 |
| TCs que documentan el comportamiento | TC-CART-CHK-009 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

`0000000000` es aceptado como teléfono válido.

## Por qué no es un defecto

RN-CART-017 solo exige 10 dígitos. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Validar formato según el país objetivo (prefijo, dígito inicial).
