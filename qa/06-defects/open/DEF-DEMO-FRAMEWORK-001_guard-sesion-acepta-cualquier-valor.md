# Reporte de defecto - DEF-DEMO-FRAMEWORK-001: El guard de sesión acepta cualquier valor no vacío de isLoggedIn

| Campo | Valor |
|-------|-------|
| ID | DEF-DEMO-FRAMEWORK-001 |
| Título | El guard de sesión acepta cualquier valor no vacío de isLoggedIn |
| Severidad | Alta |
| Prioridad | P1 |
| Estado | Open |
| Asignado a | Sin asignar |
| Módulo | AUTH |
| Submódulo | SES (Sesión y cierre de sesión) |
| Ambiente | QA (`{QA_BASE_URL}` = https://shop.qaautomationlabs.com) |
| Navegador | Chromium (Playwright) |
| Fecha de reporte | 2026-11-20 |
| ADO WI | No aplica (integración ADO deshabilitada) |
| TCs relacionados | TC-AUTH-SES-010 |
| Origen | ANOM-AUTH-01 (módulo AUTH); también reportado como H-CAT-07 (módulo CAT) |

---

## Verificación de issues conocidos

| Campo | Valor |
|-------|-------|
| Fuente consultada | `qa/06-defects/` (open, disputed, resolved, recommendations) y anomalías de los README de módulo; no hay tracker externo (ADO deshabilitado) |
| Términos buscados | "isLoggedIn", "guard", "acceso sin sesión", "false" |
| Coincidencias | Ninguna en `qa/06-defects/` |
| Clasificación | Defecto nuevo |
| Regla violada | RN-AUTH-015 (solo un usuario autenticado accede a las páginas protegidas); RN-CAT-001 |

---

## Descripción

El guard de las páginas protegidas solo comprueba que `localStorage.isLoggedIn` no esté vacío. Un valor que no fue emitido por un login exitoso, como `"false"`, concede acceso a la tienda.

---

## Pasos para reproducir

| Paso | Acción |
|------|--------|
| 1 | Abrir un contexto de navegador nuevo, sin login, en `{QA_BASE_URL}/index.php` |
| 2 | Escribir `localStorage.isLoggedIn = "false"` en el origen |
| 3 | Navegar a `{QA_BASE_URL}/shop.php` |
| 4 | Observar la URL final y el contenido |

---

## Resultado esperado

Según RN-AUTH-015, sin una sesión creada por un login exitoso el usuario es redirigido a `/index.php` y no ve contenido protegido.

---

## Resultado actual

La página `/shop.php` se muestra con las 4 tarjetas de categoría y el botón de logout. El guard es `if (!localStorage.getItem("isLoggedIn"))`, que solo detecta la clave ausente o vacía.

---

## Evidencia

- Observación de la sesión de exploración del 2026-11-20 (Etapas 1 y 2), documentada en el README del módulo y en `05-test-scenarios.md`.
- Captura: `qa/07-automation/e2e/diagnosis/001-guard-sesion-acepta-cualquier-valor.png` (se genera en la Etapa 5).

---

## Análisis de causa raíz

La validación de sesión es exclusivamente del cliente y compara la existencia de la clave, no su valor. (Inferido de la lectura del JavaScript de la página; pendiente de confirmación por desarrollo.)

---

## Sugerencia de corrección

Comparar el valor exacto (`=== "true"`) como mitigación mínima. La corrección de fondo es una sesión emitida y validada por el servidor (ver DEF-DEMO-FRAMEWORK-002). Derivar al proceso formal de ciberseguridad.

---

## Impacto en la automatización

| TC ID | Estado del test | Impacto |
|-------|-----------------|---------|
| TC-AUTH-SES-010 | `test.fail()` | Aserta lo que exige la spec (RN-AUTH-015); falla mientras el defecto siga abierto |

```typescript
test.fail(true, 'DEF-DEMO-FRAMEWORK-001: El guard de sesión acepta cualquier valor no vacío de isLoggedIn. Reactivar al cerrar el defecto.');
```

---

## Instrucciones de reactivación

Cuando se corrija el defecto:

1. Quitar `test.fail()` de TC-AUTH-SES-010 (la aserción no cambia: ya expresa la spec).
2. Ejecutar el test al menos 2 veces con distintos valores de `EXEC_IDX` para confirmar estabilidad.
3. Mover este archivo a `qa/06-defects/resolved/`.

---

## Historial de cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-11-20 | Defecto reportado a partir de ANOM-AUTH-01 (Etapa 3, plan `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`) |
