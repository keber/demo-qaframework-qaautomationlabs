# Recomendación - REC-DEMO-FRAMEWORK-017: Formato del total inconsistente entre carrito y checkout

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-017 |
| Título | Formato del total inconsistente entre carrito y checkout |
| Categoría | Consistencia de UI |
| Módulo | CART |
| Origen | ANOM-CART-10 |
| Reglas / flujos relacionados | RN-CART-007, RN-CART-023 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

`cart.php` muestra "Total: $1050" y `checkout.php`/`confirm.php` muestran "$1050".

## Por qué no es un defecto

Las reglas documentan ambos formatos. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Unificar el formato del total en todas las páginas.
