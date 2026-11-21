# Recomendación - REC-DEMO-FRAMEWORK-006: Errores JavaScript no controlados en las páginas de la tienda

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-006 |
| Título | Errores JavaScript no controlados en las páginas de la tienda |
| Categoría | Deuda técnica |
| Módulo | CAT / CART |
| Origen | H-CAT-01, H-CAT-02, ANOM-CART-09 |
| Reglas / flujos relacionados | - |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Las páginas de categoría lanzan `loadProducts is not defined` (la función no existe en `products.js`, `main.js` ni `qalabs-enhance.js`) y varias páginas lanzan `$(...).owlCarousel is not a function`. No bloquean ningún flujo observado.

## Por qué no es un defecto

H-CAT-01 se propuso como DEF técnico, pero ninguna regla de negocio se ve afectada (sin impacto funcional visible). Se clasifica como REC conforme a la regla 8. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Eliminar la llamada a `loadProducts` o definir la función; cargar el plugin Owl Carousel antes de usarlo o quitar su inicialización.
