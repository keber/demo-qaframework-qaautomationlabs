# Reporte de defecto - DEF-DEMO-FRAMEWORK-005: confirm.php y thanks.php son accesibles sin un checkout completado

| Campo | Valor |
|-------|-------|
| ID | DEF-DEMO-FRAMEWORK-005 |
| Título | confirm.php y thanks.php son accesibles sin un checkout completado |
| Severidad | Media |
| Prioridad | P2 |
| Estado | Open |
| Asignado a | Sin asignar |
| Módulo | CART |
| Submódulo | CHK (Checkout y confirmación de orden) |
| Ambiente | QA (`{QA_BASE_URL}` = https://shop.qaautomationlabs.com) |
| Navegador | Chromium (Playwright) |
| Fecha de reporte | 2026-11-20 |
| ADO WI | No aplica (integración ADO deshabilitada) |
| TCs relacionados | TC-CART-CHK-017, TC-CART-CHK-018 |
| Origen | ANOM-CART-03 (módulo CART) |

---

## Verificación de issues conocidos

| Campo | Valor |
|-------|-------|
| Fuente consultada | `qa/06-defects/` (open, disputed, resolved, recommendations) y anomalías de los README de módulo; no hay tracker externo (ADO deshabilitado) |
| Términos buscados | "confirm.php", "thanks.php", "undefined", "acceso fuera de secuencia" |
| Coincidencias | Ninguna en `qa/06-defects/` |
| Clasificación | Defecto nuevo |
| Regla violada | RN-CART-026 (la confirmación y la orden exitosa requieren un checkout completado) |

---

## Descripción

Las páginas finales del flujo de compra se muestran al visitarlas directamente: `confirm.php` presenta "undefined" en los datos del cliente y `thanks.php` anuncia una orden que no se realizó.

---

## Pasos para reproducir

| Paso | Acción |
|------|--------|
| 1 | Iniciar sesión con `{QA_USER_EMAIL}` / `{QA_USER_PASSWORD}` (`<PLACEHOLDER>`); eliminar `localStorage.user` y vaciar el carrito |
| 2 | Navegar directamente a `{QA_BASE_URL}/confirm.php` y observar el contenido |
| 3 | Navegar directamente a `{QA_BASE_URL}/thanks.php` y observar el contenido |

---

## Resultado esperado

Según RN-CART-026, ambas páginas redirigen al paso previo del flujo (`checkout.php`); nunca se muestra "undefined" ni el mensaje de orden exitosa.

---

## Resultado actual

`confirm.php` muestra "undefined" en los 9 datos y total "$0"; `thanks.php` muestra "Thank You for Your Order!" y "Your order has been placed successfully.". Además, por lectura de código, visitar `thanks.php` con carrito lleno lo vacía sin pasar por el checkout.

---

## Evidencia

- Observación de la sesión de exploración del 2026-11-20 (Etapas 1 y 2), documentada en el README del módulo y en `05-test-scenarios.md`.
- Captura: `qa/07-automation/e2e/diagnosis/005-confirm-y-thanks-accesibles-sin-checkout.png` (se genera en la Etapa 5).

---

## Análisis de causa raíz

Las páginas no verifican la existencia de `localStorage.user` ni de líneas en el carrito al cargarse. (Inferido de la lectura del JavaScript de la página; pendiente de confirmación por desarrollo.)

---

## Sugerencia de corrección

En `confirm.php`, redirigir a `checkout.php` si falta `localStorage.user` o el carrito está vacío; en `thanks.php`, mostrar el éxito solo cuando se llega desde "Place Order" (por ejemplo, con un indicador de orden emitido en ese clic).

---

## Impacto en la automatización

| TC ID | Estado del test | Impacto |
|-------|-----------------|---------|
| TC-CART-CHK-017 | `test.fail()` | Aserta lo que exige la spec (RN-CART-026); falla mientras el defecto siga abierto |
| TC-CART-CHK-018 | `test.fail()` | Aserta lo que exige la spec (RN-CART-026); falla mientras el defecto siga abierto |

```typescript
test.fail(true, 'DEF-DEMO-FRAMEWORK-005: confirm.php y thanks.php son accesibles sin un checkout completado. Reactivar al cerrar el defecto.');
```

---

## Instrucciones de reactivación

Cuando se corrija el defecto:

1. Quitar `test.fail()` de TC-CART-CHK-017 y TC-CART-CHK-018 (la aserción no cambia: ya expresa la spec).
2. Ejecutar el test al menos 2 veces con distintos valores de `EXEC_IDX` para confirmar estabilidad.
3. Mover este archivo a `qa/06-defects/resolved/`.

---

## Historial de cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-11-20 | Defecto reportado a partir de ANOM-CART-03 (Etapa 3, plan `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`) |
