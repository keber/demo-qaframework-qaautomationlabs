# Informe de Ejecución de Pruebas - QA Automation Labs Shop - Sprint 1 - AUTH, CAT y CART

**ID de informe:** EXEC-AUTH-CAT-CART-20261120-001
**Proyecto:** demo-framework (QA Automation Labs Shop)
**Sprint:** 1
**Tipo de ejecución:** Automatizada (Playwright), con 2 TCs de cobertura mixta (parte manual documentada)
**Ejecutor:** Agente QA (`@keber/qa-framework` v1.14.0-rc.9)
**Ambiente:** QA - `{QA_BASE_URL}` = https://shop.qaautomationlabs.com (demo pública de práctica QA)
**Fecha de ejecución:** 2026-11-20 21:50 (America/Santiago, UTC-03:00) - 2026-11-21 00:50 UTC
**Versión de Playwright:** 1.65.1
**Plan de referencia:** `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`
**ADO Test Plan:** no aplica (integración con Azure DevOps deshabilitada)

---

## 1. Resumen

Fuente de datos: `qa/05-test-execution/automated/results.json` (corrida final oficial, `stats`: `expected` 119, `unexpected` 0, `skipped` 0, `flaky` 0, `duration` 114 910 ms).

| Métrica | Valor |
|--------|-------|
| Total de TCs ejecutados | 119 |
| Pasados (`test()` en verde) | 113 |
| Fallo esperado (`test.fail()` con defecto abierto) | 6 |
| Fallidos inesperados | 0 |
| Omitidos (`test.skip()`) | 0 |
| Flaky | 0 |
| Reintentos usados | 0 (`retries: 0` en ejecución local) |
| Tasa de aprobación funcional (pasados / total) | 95,0 % (113 / 119) |
| TCs en estado válido según el criterio de completitud | 100 % (119 / 119) |
| Duración total (reloj) | 1 min 54,9 s |
| Suma de duraciones por test | 419,2 s (4 workers en paralelo) |

### Resultado global: PARCIAL - Suite estable y completa; la aplicación incumple 5 reglas de negocio

- La suite automatizada cumple el criterio de completitud del sprint (regla 8 del framework): cada TC está en `test()` pasando o en `test.fail()` respaldado por un archivo `DEF-DEMO-FRAMEWORK-NNN` en `qa/06-defects/open/`. No hay fallos inesperados ni `test.skip()`.
- Los 6 fallos esperados documentan 5 defectos abiertos de la aplicación (3 de severidad Alta y 2 de severidad Media). Las aserciones validan lo que exige la spec; no se invirtieron ni debilitaron.

---

## 2. Ambiente de ejecución

```
QA_BASE_URL={QA_BASE_URL}  (https://shop.qaautomationlabs.com)
Navegador: Chromium 159.0.8154.6 (perfil Desktop Chrome), headless
Playwright: 1.65.1
Viewport: 1440x900 (el plan exige escritorio >= 1350 px)
Proyectos: setup (global-setup) -> chromium (97 TCs) + login-flow (22 TCs, *.login.spec.ts)
Workers: 4 (carril 1 reservado vía lane-lock con heartbeat)
Reintentos: 0
Evidencia: trace y video 'retain-on-failure', screenshot 'only-on-failure'
Sesión: storageState con localStorage.isLoggedIn (no versionado)
Fecha confirmada con: npx qa-framework clock --tz America/Santiago
```

> Las credenciales se leen desde variables de entorno (`QA_USER`, `<PLACEHOLDER>`) y nunca se registran en este informe.

---

## 3. Resultados por módulo y submódulo

| Módulo | Submódulo | Total | Pasados | Fallo esperado | Fallidos | Omitidos | Defectos |
|--------|-----------|-------|---------|----------------|----------|----------|----------|
| AUTH | LOGIN (inicio de sesión) | 19 | 19 | 0 | 0 | 0 | - |
| AUTH | SES (sesión y cierre de sesión) | 12 | 10 | 2 | 0 | 0 | DEF-001, DEF-002 |
| **AUTH** | **Subtotal** | **31** | **29** | **2** | **0** | **0** | |
| CAT | SHOP (portada de la tienda) | 10 | 10 | 0 | 0 | 0 | - |
| CAT | LIST (listado de categoría) | 20 | 20 | 0 | 0 | 0 | - |
| CAT | DETAIL (detalle de producto) | 8 | 8 | 0 | 0 | 0 | - |
| CAT | BADGE (contador del carrito) | 12 | 12 | 0 | 0 | 0 | - |
| **CAT** | **Subtotal** | **50** | **50** | **0** | **0** | **0** | |
| CART | GEST (gestión del carrito) | 18 | 17 | 1 | 0 | 0 | DEF-003 |
| CART | CHK (checkout y confirmación) | 20 | 17 | 3 | 0 | 0 | DEF-004, DEF-005 |
| **CART** | **Subtotal** | **38** | **34** | **4** | **0** | **0** | |
| **Total** | | **119** | **113** | **6** | **0** | **0** | 5 defectos |

## 4. Resultados por prioridad

| Prioridad | Total | Pasados | Fallo esperado | Fallidos | Omitidos | Tasa de aprobación |
|-----------|-------|---------|----------------|----------|----------|--------------------|
| P0 | 22 | 22 | 0 | 0 | 0 | 100 % |
| P1 | 48 | 44 | 4 | 0 | 0 | 91,7 % |
| P2 | 39 | 37 | 2 | 0 | 0 | 94,9 % |
| P3 | 10 | 10 | 0 | 0 | 0 | 100 % |
| **Total** | **119** | **113** | **6** | **0** | **0** | **95,0 %** |

Todos los flujos críticos (P0: login exitoso, protección de páginas sin sesión, logout, agregar al carrito, actualizar y eliminar líneas, checkout exitoso y realización de la orden) pasan.

---

## 5. Fallos esperados y su relación con defectos

Cada TC listado está marcado con `test.fail()`, aserta el comportamiento que exige la spec y falla porque la aplicación lo incumple. Si alguno pasara, el comportamiento cambió y el defecto debe verificarse y cerrarse.

| TC-ID | Prioridad | DEF | Regla violada | Comportamiento observado |
|-------|-----------|-----|---------------|--------------------------|
| TC-AUTH-SES-010 | P1 | DEF-DEMO-FRAMEWORK-001 | RN-AUTH-015 | El guard de sesión acepta cualquier valor no vacío de `isLoggedIn`, incluso "false" |
| TC-AUTH-SES-011 | P1 | DEF-DEMO-FRAMEWORK-002 | RN-AUTH-015 | Las páginas protegidas se entregan con contenido completo (HTTP 200) a clientes sin sesión |
| TC-CART-GEST-009 | P1 | DEF-DEMO-FRAMEWORK-003 | RN-CART-005 | La cantidad 0 se acepta (subtotal $0) en vez de corregirse a 1 |
| TC-CART-CHK-016 | P1 | DEF-DEMO-FRAMEWORK-004 | RN-CART-025 | Se completa una orden con el carrito vacío (total $0; se alcanzan confirm.php y thanks.php) |
| TC-CART-CHK-017 | P2 | DEF-DEMO-FRAMEWORK-005 | RN-CART-026 | confirm.php es accesible sin checkout completado y muestra "undefined" y $0 |
| TC-CART-CHK-018 | P2 | DEF-DEMO-FRAMEWORK-005 | RN-CART-026 | thanks.php anuncia una orden exitosa sin checkout completado |

## 6. Defectos abiertos

| DEF-ID | Título | Severidad | Prioridad | TCs vinculados | Estado |
|--------|--------|-----------|-----------|----------------|--------|
| DEF-DEMO-FRAMEWORK-001 | El guard de sesión acepta cualquier valor no vacío de isLoggedIn | Alta | P1 | TC-AUTH-SES-010 | Open |
| DEF-DEMO-FRAMEWORK-002 | Las páginas protegidas entregan el contenido completo a clientes sin sesión | Alta | P1 | TC-AUTH-SES-011 | Open |
| DEF-DEMO-FRAMEWORK-003 | La cantidad 0 es aceptada en el carrito | Media | P1 | TC-CART-GEST-009 | Open |
| DEF-DEMO-FRAMEWORK-004 | Se puede completar una orden con el carrito vacío | Alta | P1 | TC-CART-CHK-016 | Open |
| DEF-DEMO-FRAMEWORK-005 | confirm.php y thanks.php son accesibles sin un checkout completado | Media | P2 | TC-CART-CHK-017, TC-CART-CHK-018 | Open |

Durante esta ejecución no se abrió ningún defecto nuevo. Las 17 recomendaciones `REC-DEMO-FRAMEWORK-001` a `REC-DEMO-FRAMEWORK-017` (`qa/06-defects/recommendations/`) no violan reglas de negocio y no justifican `test.fail()`; los TCs asociados se ejecutan con `test()` normal y pasan.

## 7. Tests omitidos

No hay TCs omitidos: 0 `test.skip()` y 0 TCs con `PENDING-CODE`.

---

## 8. Estabilización (Etapa 5b)

Fuente: `qa/05-test-execution/automated/STABILIZATION-REPORT-2026-11-20.md`.

| TC-ID | Categoría | Causa raíz | Corrección | Confianza | Estado |
|-------|-----------|------------|------------|-----------|--------|
| TC-AUTH-LOGIN-014 | I - Error de lógica del test | Con email `abc` y contraseña vacía, RN-AUTH-003 evalúa primero "contraseña vacía" y muestra solo `login-password-error`; el test esperaba `login-email-error`. La aplicación cumple la spec. | La aserción del paso 2 se alineó con RN-AUTH-003: `login-password-error` con el texto exacto y `login-email-error` oculto (aserción más estricta, no debilitada). Se precisó el esperado en el plan. | 100 | Estable (3/3 aislado + 3 corridas completas) |

**Verificación de flakiness:** se ejecutaron 2 corridas completas adicionales de repetición además de la corrida final oficial. Resultado: 0 fallos inesperados y 0 tests flaky en las tres corridas. No fue necesario aplicar correcciones de flakiness. El aprendizaje quedó registrado como STAB-001 en `qa/memory/e2e-stabilization-patterns.md`.

---

## 9. Resultados detallados

Duración por test tomada del último resultado de cada TC en `results.json`.

| TC-ID | Título | Prioridad | Resultado | Duración | Notas |
|-------|--------|-----------|-----------|----------|-------|
| TC-AUTH-LOGIN-001 | Login exitoso con la cuenta demo redirige a la tienda | P0 | Pasado | 2,0 s |  |
| TC-AUTH-LOGIN-002 | Contraseña incorrecta muestra mensaje genérico y no inicia sesión | P0 | Pasado | 1,7 s |  |
| TC-AUTH-LOGIN-003 | Email no registrado muestra el mismo mensaje genérico | P1 | Pasado | 1,6 s |  |
| TC-AUTH-LOGIN-004 | Email vacío muestra error obligatorio | P1 | Pasado | 1,8 s |  |
| TC-AUTH-LOGIN-005 | Contraseña vacía muestra error obligatorio | P1 | Pasado | 1,1 s |  |
| TC-AUTH-LOGIN-006 | Ambos campos vacíos muestran solo el error de email | P2 | Pasado | 1,1 s |  |
| TC-AUTH-LOGIN-007 | Email con formato inválido es rechazado (parametrizado) | P1 | Pasado | 1,6 s |  |
| TC-AUTH-LOGIN-008 | Contraseña de menos de 4 caracteres es rechazada (parametrizado) | P1 | Pasado | 1,3 s |  |
| TC-AUTH-LOGIN-009 | Email con mayúsculas distintas es rechazado | P3 | Pasado | 1,2 s |  |
| TC-AUTH-LOGIN-010 | Espacios alrededor de las credenciales se ignoran | P2 | Pasado | 1,7 s |  |
| TC-AUTH-LOGIN-011 | Campos con solo espacios se tratan como vacíos | P2 | Pasado | 1,5 s |  |
| TC-AUTH-LOGIN-012 | Los mensajes de error se ocultan al escribir | P2 | Pasado | 1,5 s |  |
| TC-AUTH-LOGIN-013 | Mostrar y ocultar la contraseña | P2 | Pasado | 1,5 s |  |
| TC-AUTH-LOGIN-014 | Autocompletar credenciales demo | P2 | Pasado | 2,0 s |  |
| TC-AUTH-LOGIN-015 | "Remember me" guarda y precarga el email | P1 | Pasado | 2,4 s |  |
| TC-AUTH-LOGIN-016 | Login sin "Remember me" elimina el email recordado | P2 | Pasado | 2,4 s |  |
| TC-AUTH-LOGIN-017 | Login con usuario registrado en el navegador | P1 | Pasado | 1,9 s |  |
| TC-AUTH-LOGIN-018 | Estructura de la página de login | P2 | Pasado | 1,1 s |  |
| TC-AUTH-LOGIN-019 | Enlace "Register Here" lleva al registro | P3 | Pasado | 1,4 s |  |
| TC-AUTH-SES-001 | Acceso a la tienda sin sesión redirige al login | P0 | Pasado | 2,8 s |  |
| TC-AUTH-SES-002 | Acceso a categorías y carrito sin sesión redirige al login (parametrizado) | P0 | Pasado | 6,4 s |  |
| TC-AUTH-SES-003 | Tras el login el encabezado muestra logout y carrito | P1 | Pasado | 2,4 s |  |
| TC-AUTH-SES-004 | Logout cierra la sesión y redirige al login | P0 | Pasado | 3,0 s |  |
| TC-AUTH-SES-005 | Tras el logout las páginas protegidas redirigen al login | P0 | Pasado | 5,9 s |  |
| TC-AUTH-SES-006 | El botón "Atrás" tras el logout no restaura el acceso | P1 | Pasado | 4,3 s |  |
| TC-AUTH-SES-007 | La sesión se comparte entre pestañas del mismo contexto | P2 | Pasado | 4,9 s |  |
| TC-AUTH-SES-008 | Un contexto de navegador nuevo no hereda la sesión | P2 | Pasado | 6,7 s |  |
| TC-AUTH-SES-009 | La pérdida de isLoggedIn durante la sesión obliga a reautenticarse | P2 | Pasado | 3,8 s |  |
| TC-AUTH-SES-010 | Un indicador de sesión no emitido por el login no concede acceso | P1 | Fallo esperado | 9,4 s | DEF-DEMO-FRAMEWORK-001 |
| TC-AUTH-SES-011 | El servidor no entrega contenido protegido sin sesión | P1 | Fallo esperado | 2,5 s | DEF-DEMO-FRAMEWORK-002 |
| TC-AUTH-SES-012 | El logout conserva el email recordado | P3 | Pasado | 2,0 s |  |
| TC-CAT-SHOP-001 | Usuario sin sesión es redirigido al login al abrir shop.php | P0 | Pasado | 2,5 s |  |
| TC-CAT-SHOP-002 | Usuario con sesión ve las 4 tarjetas de categoría | P0 | Pasado | 2,8 s |  |
| TC-CAT-SHOP-003 | "Shop Now" de cada categoría navega a su página | P1 | Pasado | 7,5 s |  |
| TC-CAT-SHOP-004 | El logo de la cabecera vuelve a shop.php desde una categoría | P1 | Pasado | 4,2 s |  |
| TC-CAT-SHOP-005 | El enlace "Shop" de la navegación vuelve a shop.php y está activo | P2 | Pasado | 4,7 s |  |
| TC-CAT-SHOP-006 | Breadcrumb de shop.php muestra "Home" y "Shop" | P2 | Pasado | 3,7 s |  |
| TC-CAT-SHOP-007 | El badge del carrito es visible en shop.php y refleja el carrito vacío | P1 | Pasado | 3,2 s |  |
| TC-CAT-SHOP-008 | El enlace del carrito en la cabecera navega a cart.php | P1 | Pasado | 2,7 s |  |
| TC-CAT-SHOP-009 | Logout desde el catálogo impide volver a la categoría | P1 | Pasado | 4,2 s |  |
| TC-CAT-SHOP-010 | La búsqueda de la cabecera apunta al sitio externo y no filtra el catálogo | P3 | Pasado | 2,3 s |  |
| TC-CAT-LIST-001 | Usuario sin sesión es redirigido al login al abrir una categoría | P0 | Pasado | 5,7 s |  |
| TC-CAT-LIST-002 | Cada categoría lista solo sus productos con el total correcto | P0 | Pasado | 5,9 s |  |
| TC-CAT-LIST-003 | La tarjeta de producto muestra nombre, precio, categoría, meta y botón | P1 | Pasado | 2,7 s |  |
| TC-CAT-LIST-004 | Todas las imágenes de producto cargan y tienen texto alternativo | P1 | Pasado | 4,8 s |  |
| TC-CAT-LIST-005 | Filtrar por un tipo muestra solo productos de ese tipo | P1 | Pasado | 2,8 s |  |
| TC-CAT-LIST-006 | Dos rangos de precio se combinan con OR | P1 | Pasado | 3,0 s |  |
| TC-CAT-LIST-007 | Filtros de grupos distintos se combinan con AND | P1 | Pasado | 3,0 s |  |
| TC-CAT-LIST-008 | Combinación sin coincidencias muestra "No products found" | P1 | Pasado | 3,9 s |  |
| TC-CAT-LIST-009 | Desmarcar todos los filtros restaura el listado completo | P1 | Pasado | 3,8 s |  |
| TC-CAT-LIST-010 | Búsqueda sin distinción de mayúsculas y con recorte de espacios | P1 | Pasado | 3,5 s |  |
| TC-CAT-LIST-011 | La búsqueda se limita a la categoría actual | P2 | Pasado | 3,6 s |  |
| TC-CAT-LIST-012 | Limpiar la búsqueda restaura el listado | P2 | Pasado | 2,5 s |  |
| TC-CAT-LIST-013 | Ordenar por precio ascendente y descendente | P1 | Pasado | 3,3 s |  |
| TC-CAT-LIST-014 | Ordenar por nombre A-Z, Z-A y volver al orden original | P2 | Pasado | 3,4 s |  |
| TC-CAT-LIST-015 | Búsqueda, filtro y orden combinados | P2 | Pasado | 3,4 s |  |
| TC-CAT-LIST-016 | Electronics ofrece filtros de tipo y marca y no de color | P1 | Pasado | 4,1 s |  |
| TC-CAT-LIST-017 | Los rangos de precio incluyen sus límites | P2 | Pasado | 3,8 s |  |
| TC-CAT-LIST-018 | El contador usa singular con un solo resultado | P2 | Pasado | 3,0 s |  |
| TC-CAT-LIST-019 | Filtros, búsqueda y orden no persisten al recargar | P2 | Pasado | 3,6 s |  |
| TC-CAT-LIST-020 | "Go To Back" y el nombre del producto navegan correctamente | P2 | Pasado | 4,1 s |  |
| TC-CAT-DETAIL-001 | Usuario sin sesión es redirigido al login al abrir un detalle | P0 | Pasado | 2,9 s |  |
| TC-CAT-DETAIL-002 | El detalle muestra nombre, precio e imagen consistentes con el listado | P1 | Pasado | 3,6 s |  |
| TC-CAT-DETAIL-003 | Breadcrumb del detalle muestra "Home" y "Product Details" | P2 | Pasado | 2,4 s |  |
| TC-CAT-DETAIL-004 | "Go To Back" del detalle navega a shop.php | P1 | Pasado | 2,9 s |  |
| TC-CAT-DETAIL-005 | "Add to Cart" en el detalle actualiza el badge sin salir de la página | P1 | Pasado | 2,6 s |  |
| TC-CAT-DETAIL-006 | Producto inexistente muestra "Product not found" | P1 | Pasado | 1,8 s |  |
| TC-CAT-DETAIL-007 | id no numérico o ausente muestra "Product not found" | P2 | Pasado | 2,4 s |  |
| TC-CAT-DETAIL-008 | id con caracteres HTML es rechazado sin renderizar contenido | P2 | Pasado | 1,4 s |  |
| TC-CAT-BADGE-001 | Con carrito vacío el badge muestra 0 | P0 | Pasado | 2,1 s |  |
| TC-CAT-BADGE-002 | Agregar un producto desde el listado incrementa el badge a 1 | P0 | Pasado | 2,6 s |  |
| TC-CAT-BADGE-003 | Agregar el mismo producto dos veces incrementa qty y no el badge | P1 | Pasado | 2,5 s |  |
| TC-CAT-BADGE-004 | Agregar productos distintos incrementa el badge por cada línea nueva | P1 | Pasado | 4,2 s |  |
| TC-CAT-BADGE-005 | El badge se mantiene al navegar entre páginas del catálogo | P1 | Pasado | 5,2 s |  |
| TC-CAT-BADGE-006 | El badge se mantiene tras recargar la página | P1 | Pasado | 4,1 s |  |
| TC-CAT-BADGE-007 | Agregar desde un listado filtrado agrega el producto correcto | P1 | Pasado | 4,6 s |  |
| TC-CAT-BADGE-008 | Al agregar no se muestra alerta ni cambia el texto del botón | P2 | Pasado | 3,0 s |  |
| TC-CAT-BADGE-009 | El badge es visible y correcto en viewport móvil | P2 | Pasado | 2,6 s |  |
| TC-CAT-BADGE-010 | Otra pestaña muestra el badge actualizado solo tras recargar | P2 | Pasado | 5,7 s |  |
| TC-CAT-BADGE-011 | El carrito y el badge se conservan tras logout y nuevo login | P2 | Pasado | 3,2 s |  |
| TC-CAT-BADGE-012 | Carrito corrupto en localStorage no impide usar el catálogo | P3 | Pasado | 3,1 s |  |
| TC-CART-GEST-001 | Agregar un producto nuevo al carrito desde una página de categoría | P0 | Pasado | 2,9 s |  |
| TC-CART-GEST-002 | Agregar un producto que ya está en el carrito incrementa su cantidad | P1 | Pasado | 3,3 s |  |
| TC-CART-GEST-003 | Agregar un producto desde la página de detalle | P2 | Pasado | 3,9 s |  |
| TC-CART-GEST-004 | Productos de distintas categorías se acumulan en el mismo carrito | P1 | Pasado | 5,5 s |  |
| TC-CART-GEST-005 | La tabla del carrito muestra columnas, precio y subtotal por línea | P0 | Pasado | 3,0 s |  |
| TC-CART-GEST-006 | Actualizar la cantidad recalcula subtotal y total | P0 | Pasado | 2,6 s |  |
| TC-CART-GEST-007 | La cantidad modificada persiste al recargar la página | P1 | Pasado | 2,9 s |  |
| TC-CART-GEST-008 | Una cantidad negativa se normaliza a 1 | P2 | Pasado | 2,6 s |  |
| TC-CART-GEST-009 | Una cantidad 0 no debe aceptarse | P1 | Fallo esperado | 3,0 s | DEF-DEMO-FRAMEWORK-003 |
| TC-CART-GEST-010 | Cantidad vacía o decimal se normaliza a 1 | P2 | Pasado | 4,0 s |  |
| TC-CART-GEST-011 | Se acepta una cantidad alta sin límite máximo | P3 | Pasado | 2,7 s |  |
| TC-CART-GEST-012 | Eliminar un producto actualiza tabla, total y contador | P0 | Pasado | 2,7 s |  |
| TC-CART-GEST-013 | Eliminar el último producto muestra el estado de carrito vacío | P1 | Pasado | 2,7 s |  |
| TC-CART-GEST-014 | Carrito vacío al cargar la página | P1 | Pasado | 2,5 s |  |
| TC-CART-GEST-015 | Navegación de retorno a la tienda desde el carrito | P2 | Pasado | 4,7 s |  |
| TC-CART-GEST-016 | "Proceed To Checkout" lleva al checkout con el carrito actual | P0 | Pasado | 2,9 s |  |
| TC-CART-GEST-017 | Visitante sin sesión es redirigido al login | P1 | Pasado | 2,8 s |  |
| TC-CART-GEST-018 | El carrito es propio del navegador y sobrevive al logout | P2 | Pasado | 5,5 s |  |
| TC-CART-CHK-001 | El checkout muestra el resumen del carrito y el total | P0 | Pasado | 2,7 s |  |
| TC-CART-CHK-002 | Enviar el formulario vacío muestra solo el error del primer campo | P1 | Pasado | 2,6 s |  |
| TC-CART-CHK-003 | Cada campo obligatorio vacío muestra su mensaje (parametrizado) | P0 | Pasado | 15,8 s |  |
| TC-CART-CHK-004 | First Name con solo espacios se considera vacío | P2 | Pasado | 3,1 s |  |
| TC-CART-CHK-005 | Los errores se ocultan al escribir en un campo | P3 | Pasado | 3,2 s |  |
| TC-CART-CHK-006 | Email con formato inválido muestra el mensaje propio | P1 | Pasado | 3,5 s |  |
| TC-CART-CHK-007 | Email sin "@" o con espacios es bloqueado por la validación nativa | P2 | Pasado | 6,0 s |  |
| TC-CART-CHK-008 | Teléfono con longitud distinta de 10 es rechazado | P1 | Pasado | 5,2 s |  |
| TC-CART-CHK-009 | El teléfono no admite letras | P3 | Pasado | 3,0 s |  |
| TC-CART-CHK-010 | Pin Code 0 o negativo es bloqueado por la validación nativa | P2 | Pasado | 6,4 s |  |
| TC-CART-CHK-011 | Middle Name es opcional | P2 | Pasado | 4,1 s |  |
| TC-CART-CHK-012 | Checkout exitoso muestra la confirmación con los datos ingresados | P0 | Pasado | 5,8 s |  |
| TC-CART-CHK-013 | La confirmación muestra el mismo resumen y total que el carrito | P1 | Pasado | 4,5 s |  |
| TC-CART-CHK-014 | "Go To Back" desde la confirmación vuelve al checkout | P3 | Pasado | 4,9 s |  |
| TC-CART-CHK-015 | "Go To Back" desde el checkout vuelve al carrito sin cambios | P3 | Pasado | 4,0 s |  |
| TC-CART-CHK-016 | No se puede completar una orden con el carrito vacío | P1 | Fallo esperado | 4,4 s | DEF-DEMO-FRAMEWORK-004 |
| TC-CART-CHK-017 | confirm.php no es accesible sin un checkout completado | P2 | Fallo esperado | 8,7 s | DEF-DEMO-FRAMEWORK-005 |
| TC-CART-CHK-018 | thanks.php no anuncia una orden que no se realizó | P2 | Fallo esperado | 2,0 s | DEF-DEMO-FRAMEWORK-005 |
| TC-CART-CHK-019 | Realizar la orden muestra el éxito y vacía el carrito | P0 | Pasado | 5,1 s |  |
| TC-CART-CHK-020 | Las páginas del checkout redirigen al login sin sesión | P1 | Pasado | 4,4 s |  |

Cobertura mixta: TC-AUTH-SES-011 automatiza el paso con JavaScript deshabilitado mediante un contexto `javaScriptEnabled: false`; en TC-CAT-SHOP-010 el envío al sitio externo qaautomationlabs.com queda como verificación manual (sistema de terceros).

---

## 10. Riesgos

| ID | Riesgo | Impacto | Probabilidad | Mitigación / acción sugerida |
|----|--------|---------|--------------|------------------------------|
| R-01 | Control de acceso solo en el cliente: el guard acepta cualquier valor de `isLoggedIn` y el servidor entrega las páginas protegidas sin sesión (DEF-001, DEF-002) | Alto | Alta | Validar la sesión en el servidor; mientras tanto, no considerar el área protegida como confidencial |
| R-02 | Integridad de la orden: checkout con carrito vacío y confirmaciones alcanzables sin checkout (DEF-004, DEF-005) | Alto | Alta | Validar en servidor que exista un carrito no vacío y un checkout completado antes de confirmar |
| R-03 | Cantidad 0 aceptada en el carrito (DEF-003) | Medio | Media | Normalizar la cantidad mínima a 1, igual que con valores negativos |
| R-04 | Ambiente público y compartido: otros usuarios o cambios del tercero pueden alterar datos, textos o disponibilidad | Medio | Media | Reejecutar la suite antes de cada uso del informe; los TCs no dependen de datos persistentes en servidor |
| R-05 | Datos personales del checkout y carrito guardados en `localStorage` y uso de `innerHTML` en confirm.php (REC-013, REC-014) | Medio | Media | Tratados como recomendaciones; evaluar en una revisión de seguridad formal |
| R-06 | Errores JavaScript no controlados (`owlCarousel`, `loadProducts`, REC-006) | Bajo | Alta | No se usan como aserción; monitorear si cambian el comportamiento funcional |

## 11. Veredicto QA

**Veredicto: APROBADO CON OBSERVACIONES para la suite de pruebas; NO APTO para producción la aplicación bajo prueba mientras sigan abiertos los defectos de severidad Alta.**

- La suite del Sprint 1 está completa y estable: 119 de 119 TCs en un estado válido, 0 fallos inesperados, 0 omitidos, 0 flaky en 3 corridas completas.
- Todos los TCs P0 pasan (22/22): los flujos principales de login, navegación del catálogo, carrito y checkout funcionan.
- La aplicación incumple 5 reglas de negocio documentadas (RN-AUTH-015, RN-CART-005, RN-CART-025, RN-CART-026), 3 de ellas con severidad Alta relacionadas con control de acceso e integridad de órdenes.
- Al corregirse cada defecto, el TC con `test.fail()` correspondiente comenzará a "pasar inesperadamente": en ese momento se debe verificar contra la spec, cerrar el DEF y quitar el marcador.

## 12. Limitaciones del análisis

- **Ambiente público y compartido:** https://shop.qaautomationlabs.com es una demo de práctica de un tercero. Los resultados reflejan el estado del sitio en la fecha de ejecución y pueden cambiar sin aviso (contenido, catálogo, textos, disponibilidad).
- **Aplicación solo del lado del cliente:** la sesión, el carrito y los datos del checkout viven en `localStorage`; no hay backend de órdenes observable. Las pruebas validan el comportamiento observable en el navegador y las respuestas HTTP, no persistencia en servidor.
- **Dependencia del tercero:** fallos de red, mantenimiento o cambios en el sitio pueden producir fallos no atribuibles a la aplicación ni a la suite; no se controlan desde este proyecto.
- **Un solo navegador:** la ejecución cubre Chromium en escritorio (1440x900). Firefox, WebKit y viewports móviles (salvo TC-CAT-BADGE-009) quedan fuera de esta corrida.
- **Cobertura mixta:** 2 TCs tienen una parte manual (JavaScript deshabilitado ya automatizado; envío al sitio externo manual).
- **Sin trazabilidad ADO:** la integración con Azure DevOps está deshabilitada; no hay Test Run ni bugs sincronizados.
- **Fuera de alcance de seguridad:** este informe no constituye una prueba de penetración; los hallazgos de control de acceso deben derivarse al proceso formal de seguridad si el sistema fuera propio.

---

## 13. Recomendaciones

1. **DEF-DEMO-FRAMEWORK-001 y DEF-DEMO-FRAMEWORK-002 (Alta):** mover la validación de sesión al servidor; ambos afectan a todas las páginas protegidas.
2. **DEF-DEMO-FRAMEWORK-004 y DEF-DEMO-FRAMEWORK-005:** validar carrito no vacío y checkout completado antes de confirmar una orden.
3. **Ejecución periódica:** reejecutar la suite antes de reutilizar este informe, dado que el ambiente es de un tercero.
4. **Ampliación de cobertura:** agregar proyectos Firefox y WebKit en un sprint posterior si el alcance lo requiere.

## 14. Artefactos

| Artefacto | Ubicación |
|-----------|-----------|
| Resultados JSON (corrida final) | `qa/05-test-execution/automated/results.json` |
| Reporte HTML de Playwright | `qa/05-test-execution/automated/html-report/` |
| Reporte de estabilización | `qa/05-test-execution/automated/STABILIZATION-REPORT-2026-11-20.md` |
| Spec files | `qa/07-automation/e2e/tests/{auth,catalog,cart}/` |
| Plan de pruebas | `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md` |
| Informe de análisis | `qa/02-test-plans/sprints/Sprint-1/Informe-de-Analisis-de-Pruebas-demo-framework-Sprint-1.md` |
| Defectos abiertos | `qa/06-defects/open/` |
| Recomendaciones | `qa/06-defects/recommendations/` |
| Informes en PDF | `qa/09-reports/` |

## 15. Aprobación

| Rol | Nombre | Fecha |
|-----|--------|-------|
| Analista QA | | |
| Líder técnico | | |
