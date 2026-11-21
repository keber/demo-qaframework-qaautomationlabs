# Reporte de defecto - DEF-DEMO-FRAMEWORK-002: Las páginas protegidas entregan el contenido completo a clientes sin sesión

| Campo | Valor |
|-------|-------|
| ID | DEF-DEMO-FRAMEWORK-002 |
| Título | Las páginas protegidas entregan el contenido completo a clientes sin sesión |
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
| TCs relacionados | TC-AUTH-SES-011 |
| Origen | ANOM-AUTH-02 (módulo AUTH); relacionado con H-CAT-07 y las notas de RN-CART-010 y RN-CART-027 |

---

## Verificación de issues conocidos

| Campo | Valor |
|-------|-------|
| Fuente consultada | `qa/06-defects/` (open, disputed, resolved, recommendations) y anomalías de los README de módulo; no hay tracker externo (ADO deshabilitado) |
| Términos buscados | "HTTP 200", "sin sesión", "JavaScript deshabilitado", "redirección" |
| Coincidencias | Ninguna en `qa/06-defects/` |
| Clasificación | Defecto nuevo |
| Regla violada | RN-AUTH-015 (el usuario sin sesión "no ve contenido protegido") |

---

## Descripción

El servidor responde HTTP 200 con el HTML completo de las páginas protegidas a cualquier cliente. La única protección es una redirección JavaScript al final del `<body>`.

---

## Pasos para reproducir

| Paso | Acción |
|------|--------|
| 1 | Sin sesión, ejecutar `GET {QA_BASE_URL}/shop.php` (por ejemplo con `request.get` de Playwright) |
| 2 | Revisar el estado HTTP y el cuerpo de la respuesta |
| 3 | Alternativa manual: abrir `/shop.php` en un navegador con JavaScript deshabilitado |
| 4 | Observar el contenido mostrado |

---

## Resultado esperado

Según RN-AUTH-015, un cliente sin sesión no recibe contenido protegido: redirección o respuesta 401/403, sin `category-card-*` ni `header-logout-btn`.

---

## Resultado actual

HTTP 200 con el HTML completo. Con JavaScript deshabilitado se ven las 4 tarjetas de categoría y el botón de logout. Aplica también a categorías, `cart.php`, `checkout.php`, `confirm.php` y `thanks.php`.

---

## Evidencia

- Observación de la sesión de exploración del 2026-11-20 (Etapas 1 y 2), documentada en el README del módulo y en `05-test-scenarios.md`.
- Captura: `qa/07-automation/e2e/diagnosis/002-paginas-protegidas-entregan-contenido-sin-sesion.png` (se genera en la Etapa 5).

---

## Análisis de causa raíz

No existe control de acceso del lado del servidor; la autenticación es 100 % del cliente (sin cookies ni llamadas de red). (Inferido de la lectura del JavaScript de la página; pendiente de confirmación por desarrollo.)

---

## Sugerencia de corrección

Implementar sesión del lado del servidor (cookie de sesión `HttpOnly` + `Secure` + `SameSite`) y validar el acceso en cada página PHP antes de emitir contenido. Derivar al proceso formal de ciberseguridad.

---

## Impacto en la automatización

| TC ID | Estado del test | Impacto |
|-------|-----------------|---------|
| TC-AUTH-SES-011 | `test.fail()` | Aserta lo que exige la spec (RN-AUTH-015); falla mientras el defecto siga abierto |

```typescript
test.fail(true, 'DEF-DEMO-FRAMEWORK-002: Las páginas protegidas entregan el contenido completo a clientes sin sesión. Reactivar al cerrar el defecto.');
```

---

## Instrucciones de reactivación

Cuando se corrija el defecto:

1. Quitar `test.fail()` de TC-AUTH-SES-011 (la aserción no cambia: ya expresa la spec).
2. Ejecutar el test al menos 2 veces con distintos valores de `EXEC_IDX` para confirmar estabilidad.
3. Mover este archivo a `qa/06-defects/resolved/`.

---

## Historial de cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0 | 2026-11-20 | Defecto reportado a partir de ANOM-AUTH-02 (Etapa 3, plan `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`) |
