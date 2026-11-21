# Reporte de defecto - DEF-DEMO-FRAMEWORK-004: Se puede completar una orden con el carrito vacío

| Campo | Valor |
|-------|-------|
| ID | DEF-DEMO-FRAMEWORK-004 |
| Título | Se puede completar una orden con el carrito vacío |
| Severidad | Alta |
| Prioridad | P1 |
| Estado | Open |
| Asignado a | Sin asignar |
| Módulo | CART |
| Submódulo | CHK (Checkout y confirmación de orden) |
| Ambiente | QA (`{QA_BASE_URL}` = https://shop.qaautomationlabs.com) |
| Navegador | Chromium (Playwright) |
| Fecha de reporte | 2026-11-20 |
| ADO WI | No aplica (integración ADO deshabilitada) |
| TCs relacionados | TC-CART-CHK-016 |
| Origen | ANOM-CART-02 (módulo CART) |

---

## Verificación de issues conocidos

| Campo | Valor |
|-------|-------|
| Fuente consultada | `qa/06-defects/` (open, disputed, resolved, recommendations) y anomalías de los README de módulo; no hay tracker externo (ADO deshabilitado) |
| Términos buscados | "carrito vacío", "checkout", "orden $0", "Place Order" |
| Coincidencias | Ninguna en `qa/06-defects/` |
| Clasificación | Defecto nuevo |
| Regla violada | RN-CART-025 (no se puede hacer checkout con el carrito vacío) |

---

## Descripción

Navegando directamente a `checkout.php` con el carrito vacío, el formulario permite continuar a `confirm.php` con total `$0` y "Place Order" anuncia una orden exitosa.

---

## Pasos para reproducir

| Paso | Acción |
|------|--------|
| 1 | Iniciar sesión con `{QA_USER_EMAIL}` / `{QA_USER_PASSWORD}` (`<PLACEHOLDER>`) y vaciar `localStorage.cart` |
| 2 | Navegar directamente a `{QA_BASE_URL}/checkout.php` |
| 3 | Completar los 9 campos con datos válidos ficticios y hacer click en `continue-btn` |
| 4 | En `confirm.php`, hacer click en `place-order-btn` |

---

## Resultado esperado

Según RN-CART-025, el checkout se impide cuando el carrito está vacío (coherente con `cart.php`, que oculta "Proceed To Checkout"): no se navega a `confirm.php` ni se alcanza la orden exitosa.

---

## Resultado actual

`order-total` = "$0" sin líneas; "Continue" navega a `confirm.php` y "Place Order" muestra "Your order has been placed successfully.".

---

## Evidencia

- Observación de la sesión de exploración del 2026-11-20 (Etapas 1 y 2), documentada en el README del módulo y en `05-test-scenarios.md`.
- Captura: `qa/07-automation/e2e/diagnosis/004-checkout-con-carrito-vacio.png` (se genera en la Etapa 5).

---

## Análisis de causa raíz

`checkout.php` y `confirm.php` no validan que `localStorage.cart` tenga líneas antes de continuar. (Inferido de la lectura del JavaScript de la página; pendiente de confirmación por desarrollo.)

---

## Sugerencia de corrección

Al cargar `checkout.php` (y al hacer click en "Continue"), redirigir a `cart.php` si el carrito está vacío.

---

## Impacto en la automatización

| TC ID | Estado del test | Impacto |
|-------|-----------------|---------|
| TC-CART-CHK-016 | `test.fail()` | Aserta lo que exige la spec (RN-CART-025); falla mientras el defecto siga abierto |

```typescript
test.fail(true, 'DEF-DEMO-FRAMEWORK-004: Se puede completar una orden con el carrito vacío. Reactivar al cerrar el defecto.');
```

---

## Instrucciones de reactivación

Cuando se corrija el defecto:

1. Quitar `test.fail()` de TC-CART-CHK-016 (la aserción no cambia: ya expresa la spec).
2. Ejecutar el test al menos 2 veces con distintos valores de `EXEC_IDX` para confirmar estabilidad.
3. Mover este archivo a `qa/06-defects/resolved/`.

---

## Historial de cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-11-20 | Defecto reportado a partir de ANOM-CART-02 (Etapa 3, plan `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`) |
