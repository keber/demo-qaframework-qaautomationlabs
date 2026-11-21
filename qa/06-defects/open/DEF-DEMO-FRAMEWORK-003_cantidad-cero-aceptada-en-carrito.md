# Reporte de defecto - DEF-DEMO-FRAMEWORK-003: La cantidad 0 es aceptada en el carrito

| Campo | Valor |
|-------|-------|
| ID | DEF-DEMO-FRAMEWORK-003 |
| Título | La cantidad 0 es aceptada en el carrito |
| Severidad | Media |
| Prioridad | P1 |
| Estado | Open |
| Asignado a | Sin asignar |
| Módulo | CART |
| Submódulo | GEST (Gestión del carrito) |
| Ambiente | QA (`{QA_BASE_URL}` = https://shop.qaautomationlabs.com) |
| Navegador | Chromium (Playwright) |
| Fecha de reporte | 2026-11-20 |
| ADO WI | No aplica (integración ADO deshabilitada) |
| TCs relacionados | TC-CART-GEST-009 |
| Origen | ANOM-CART-01 (módulo CART) |

---

## Verificación de issues conocidos

| Campo | Valor |
|-------|-------|
| Fuente consultada | `qa/06-defects/` (open, disputed, resolved, recommendations) y anomalías de los README de módulo; no hay tracker externo (ADO deshabilitado) |
| Términos buscados | "cantidad 0", "qty 0", "min=1", "subtotal $0" |
| Coincidencias | Ninguna en `qa/06-defects/` |
| Clasificación | Defecto nuevo |
| Regla violada | RN-CART-005 (la cantidad mínima es 1) |

---

## Descripción

El campo de cantidad de `cart.php` acepta `0` pese a `min="1"`: la línea queda con subtotal `$0` y sigue contando en el encabezado.

---

## Pasos para reproducir

| Paso | Acción |
|------|--------|
| 1 | Iniciar sesión con `{QA_USER_EMAIL}` / `{QA_USER_PASSWORD}` (`<PLACEHOLDER>`) |
| 2 | Preparar `localStorage.cart = [{"id":21,"qty":2},{"id":22,"qty":1}]` y navegar a `{QA_BASE_URL}/cart.php` |
| 3 | Escribir `0` en `cart-qty-22` y presionar Tab |
| 4 | Observar `cart-qty-22`, `cart-item-total-22`, `cart-total` y `header-cart-count` |

---

## Resultado esperado

Según RN-CART-005, cualquier valor menor que 1 se rechaza y la cantidad queda en 1: `cart-item-total-22` = "$500" y "Total: $800".

---

## Resultado actual

Se guarda `qty: 0`, `cart-item-total-22` = "$0", `cart-total` = "Total: $300" y la línea permanece en el carrito (el contador sigue en "2"). El valor `-2` sí se corrige a 1.

---

## Evidencia

- Observación de la sesión de exploración del 2026-11-20 (Etapas 1 y 2), documentada en el README del módulo y en `05-test-scenarios.md`.
- Captura: `qa/07-automation/e2e/diagnosis/003-cantidad-cero-aceptada-en-carrito.png` (se genera en la Etapa 5).

---

## Análisis de causa raíz

La normalización probablemente usa una condición `< 0` o trata `0` como válido en lugar de `< 1`. (Inferido de la lectura del JavaScript de la página; pendiente de confirmación por desarrollo.)

---

## Sugerencia de corrección

Normalizar con `qty < 1 -> 1` (o, si negocio lo decide, eliminar la línea con confirmación).

---

## Impacto en la automatización

| TC ID | Estado del test | Impacto |
|-------|-----------------|---------|
| TC-CART-GEST-009 | `test.fail()` | Aserta lo que exige la spec (RN-CART-005); falla mientras el defecto siga abierto |

```typescript
test.fail(true, 'DEF-DEMO-FRAMEWORK-003: La cantidad 0 es aceptada en el carrito. Reactivar al cerrar el defecto.');
```

---

## Instrucciones de reactivación

Cuando se corrija el defecto:

1. Quitar `test.fail()` de TC-CART-GEST-009 (la aserción no cambia: ya expresa la spec).
2. Ejecutar el test al menos 2 veces con distintos valores de `EXEC_IDX` para confirmar estabilidad.
3. Mover este archivo a `qa/06-defects/resolved/`.

---

## Historial de cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-11-20 | Defecto reportado a partir de ANOM-CART-01 (Etapa 3, plan `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`) |
