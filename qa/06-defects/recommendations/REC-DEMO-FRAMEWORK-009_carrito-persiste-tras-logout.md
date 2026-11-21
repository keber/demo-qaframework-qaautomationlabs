# Recomendación - REC-DEMO-FRAMEWORK-009: El carrito persiste tras el logout y no está asociado al usuario

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-009 |
| Título | El carrito persiste tras el logout y no está asociado al usuario |
| Categoría | Privacidad (equipos compartidos) |
| Módulo | CAT / CART |
| Origen | H-CAT-06 |
| Reglas / flujos relacionados | RN-CAT-047, RN-CART-011 |
| TCs que documentan el comportamiento | TC-CAT-BADGE-011, TC-CART-GEST-018 |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

El logout solo borra `isLoggedIn`; el carrito queda en `localStorage` y lo ve el siguiente usuario del mismo navegador.

## Por qué no es un defecto

RN-CAT-047 y RN-CART-011 documentan el comportamiento actual. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Asociar el carrito al usuario (servidor o clave por usuario) o vaciarlo en el logout, según decisión de negocio.
