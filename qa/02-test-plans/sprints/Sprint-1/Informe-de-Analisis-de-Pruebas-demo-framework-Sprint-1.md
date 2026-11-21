# Informe de Análisis de Pruebas - QA Automation Labs Shop - Sprint 1

| Campo | Valor |
|-------|-------|
| Proyecto | demo-framework (QA Automation Labs Shop) |
| Ambiente | https://shop.qaautomationlabs.com (demo pública de práctica QA) |
| Sprint | 1 |
| Fecha | 2026-11-20 |
| Etapas del pipeline | 1 (análisis), 2 (especificación), 3 (plan de pruebas) y 4 (expansión de casos) completadas |
| Plan de Pruebas | `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md` |
| Framework | `@keber/qa-framework` v1.14.0-rc.9 |

---

## 1. Resumen ejecutivo

Se analizaron 3 módulos y 8 submódulos de la tienda demo. El universo de pruebas es de **119 casos de prueba**, trazados a **81 reglas de negocio** y **24 flujos**. El **100 %** de los casos es automatizable (117 de forma completa y 2 de forma parcial). Se formalizaron **5 defectos** (3 de severidad alta y 2 de severidad media) y **17 recomendaciones**. **6 casos** fallarán por defecto conocido y se automatizarán con `test.fail()` referenciando su defecto.

El hallazgo de mayor riesgo es arquitectónico: **autenticación, sesión, carrito y checkout son 100 % del lado del cliente** (`localStorage`, sin llamadas al servidor ni cookies). Esto origina dos defectos de control de acceso que deben derivarse al proceso formal de ciberseguridad.

---

## 2. Alcance

### 2.1 En alcance

| Módulo | Código | Submódulo | Código | Páginas |
|---|---|---|---|---|
| Autenticación | AUTH | Inicio de sesión | LOGIN | `index.php` |
| Autenticación | AUTH | Sesión y cierre de sesión | SES | páginas protegidas, logout |
| Catálogo | CAT | Inicio de tienda y navegación | SHOP | `shop.php` |
| Catálogo | CAT | Listado por categoría | LIST | `mens-wear.php`, `womens-wear.php`, `kids-wear.php`, `electronics.php` |
| Catálogo | CAT | Detalle de producto | DETAIL | `product.php?id={id}` |
| Catálogo | CAT | Badge del carrito y Add to Cart | BADGE | cabecera de todas las páginas |
| Carrito | CART | Gestión del carrito | GEST | `cart.php` |
| Carrito | CART | Checkout y confirmación de orden | CHK | `checkout.php`, `confirm.php`, `thanks.php` |

### 2.2 Fuera de alcance

| Elemento | Motivo |
|---|---|
| Registro de usuarios (`register.php`) | Fuera del alcance definido; solo se usa como dependencia (`localStorage.users`) |
| Búsqueda de cabecera en el sitio externo | Sistema de terceros; solo se verifica el atributo `action` |
| Rendimiento, carga y multinavegador | La configuración define solo Chromium |
| Pruebas de penetración | Política de ciberseguridad: se derivan al proceso formal de la empresa |
| Integración con Azure DevOps | Deshabilitada en la configuración |

---

## 3. Universo de pruebas

### 3.1 Por submódulo y prioridad

| Módulo | Submódulo | RN | FL | TCs | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|---|---|---|
| AUTH | LOGIN | 13 | 3 | 19 | 2 | 7 | 8 | 2 |
| AUTH | SES | 5 | 3 | 12 | 4 | 4 | 3 | 1 |
| CAT | SHOP | 6 | 2 | 10 | 2 | 5 | 2 | 1 |
| CAT | LIST | 15 | 4 | 20 | 2 | 10 | 8 | 0 |
| CAT | DETAIL | 6 | 2 | 8 | 1 | 4 | 3 | 0 |
| CAT | BADGE | 9 | 3 | 12 | 2 | 5 | 4 | 1 |
| CART | GEST | 12 | 3 | 18 | 5 | 7 | 5 | 1 |
| CART | CHK | 15 | 4 | 20 | 4 | 6 | 6 | 4 |
| **Total** | | **81** | **24** | **119** | **22** | **48** | **39** | **10** |

### 3.2 Por módulo

| Módulo | TCs | % del total |
|---|---|---|
| AUTH | 31 | 26,1 % |
| CAT | 50 | 42,0 % |
| CART | 38 | 31,9 % |
| **Total** | **119** | **100 %** |

### 3.3 Por tipo de prueba (según especificación)

| Tipo | TCs |
|---|---|
| Funcional | 69 |
| Negativo | 28 |
| Seguridad | 14 |
| Regresión | 6 |
| Integración | 2 |
| **Total** | **119** |

> Nota: los conteos por tipo provienen de la columna `Type` de cada TC en `05-test-scenarios.md`.

---

## 4. Análisis de riesgos

| # | Riesgo | Probabilidad | Impacto | Nivel | Mitigación / cobertura |
|---|---|---|---|---|---|
| R1 | Acceso a páginas protegidas sin login (guard solo del cliente, acepta cualquier valor) | Alta (confirmado) | Alto | **Crítico** | DEF-DEMO-FRAMEWORK-001/002; TC-AUTH-SES-010/011 con `test.fail()`; derivar a ciberseguridad |
| R2 | Órdenes inválidas: checkout con carrito vacío y páginas finales fuera de secuencia | Alta (confirmado) | Alto | **Crítico** | DEF-DEMO-FRAMEWORK-004/005; TC-CART-CHK-016/017/018 |
| R3 | Cálculos incorrectos del carrito (cantidad 0, subtotales, totales) | Media | Alto | **Alto** | DEF-DEMO-FRAMEWORK-003; TC-CART-GEST-005 a 012 (P0/P1) |
| R4 | Exposición de datos personales y credenciales en `localStorage` | Alta (confirmado) | Medio | **Alto** | REC-DEMO-FRAMEWORK-001/014; derivar a protección de datos |
| R5 | Riesgo latente de XSS por `innerHTML` en `confirm.php` (lectura de código) | Media | Alto | **Alto** | REC-DEMO-FRAMEWORK-013; sin explotación; derivar a ciberseguridad |
| R6 | Fallo del flujo principal de compra (login -> carrito -> orden) | Baja | Alto | **Medio** | 22 TCs P0 de camino feliz y bloqueantes |
| R7 | Filtros, búsqueda u orden devuelven productos incorrectos | Baja | Medio | **Medio** | 20 TCs LIST con esperados calculados desde `window.PRODUCTS` |
| R8 | Inestabilidad de la automatización (errores JS no controlados, títulos con guion largo, checkboxes Bootstrap) | Media | Medio | **Medio** | Notas de automatización del plan; REC-DEMO-FRAMEWORK-006 |
| R9 | Cambios en el catálogo estático de la demo pública invalidan esperados | Baja | Medio | **Bajo** | Calcular esperados desde `window.PRODUCTS` cuando sea posible |
| R10 | Interferencia entre ejecuciones con la cuenta demo compartida | Baja | Bajo | **Bajo** | El estado es por contexto de navegador; no hay interferencia observada |

---

## 5. Viabilidad de automatización

| Categoría | TCs | % | Detalle |
|---|---|---|---|
| Automatizable completo | 117 | 98,3 % | Deterministas, observables en el navegador o mediante `request` de Playwright |
| Parcial (`Ambos`) | 2 | 1,7 % | TC-AUTH-SES-011 (verificación con JavaScript deshabilitado) y TC-CAT-SHOP-010 (destino externo verificado por atributo) |
| Manual | 0 | 0 % | - |
| Bloqueado | 0 | 0 % | - |

**Factores que favorecen la automatización:**

- Todos los elementos relevantes tienen `data-testid`.
- El estado (sesión, carrito, datos de checkout) vive en `localStorage`, por lo que cada test puede preparar y limpiar su estado sin depender del servidor.
- El catálogo es estático (85 productos), lo que permite esperados deterministas.

**Consideraciones técnicas:**

- La sesión se representa con `storageState` que incluya `localStorage.isLoggedIn`; no hay cookies.
- Los checkboxes de filtro requieren clic en el `<label>` o `check({ force: true })`.
- El recálculo de cantidad se dispara con el evento `change` (Tab/Enter).
- Los errores JS conocidos no deben usarse como criterio de falla en los tests funcionales.

---

## 6. Priorización P0-P3

| Prioridad | Criterio | TCs | % | Uso recomendado |
|---|---|---|---|---|
| P0 | Camino feliz y riesgo bloqueante | 22 | 18,5 % | Smoke en cada ejecución de CI |
| P1 | Negativos comunes, transiciones de estado, dependencias entre módulos | 48 | 40,3 % | Regresión principal en cada ejecución |
| P2 | Funcionalidad secundaria y regresión adyacente | 39 | 32,8 % | Regresión completa (diaria o previa a entrega) |
| P3 | Casos borde y baja frecuencia | 10 | 8,4 % | Regresión completa; complementar con 2 charters exploratorios de 45 min |
| **Total** | | **119** | **100 %** | |

---

## 7. Matriz de trazabilidad (resumen)

| Módulo | RN especificadas | RN cubiertas por al menos un TC | FL especificados | FL cubiertos | TCs |
|---|---|---|---|---|---|
| AUTH | 18 | 18 | 6 | 6 | 31 |
| CAT | 36 | 36 | 11 | 11 | 50 |
| CART | 27 | 27 | 7 | 7 | 38 |
| **Total** | **81** | **81 (100 %)** | **24** | **24 (100 %)** | **119** |

Cada TC del plan es idéntico en ID a su escenario de origen en `05-test-scenarios.md`. La matriz detallada (TC -> RN, FL, escenario y defecto) está en la sección 10 del Plan de Pruebas.

---

## 8. Resumen de hallazgos

### 8.1 Defectos (`qa/06-defects/open/`)

| ID | Título | Severidad | Regla violada | TCs con `test.fail()` | Origen |
|---|---|---|---|---|---|
| DEF-DEMO-FRAMEWORK-001 | El guard de sesión acepta cualquier valor no vacío de `isLoggedIn` | Alta | RN-AUTH-015 | TC-AUTH-SES-010 | ANOM-AUTH-01, H-CAT-07 |
| DEF-DEMO-FRAMEWORK-002 | Las páginas protegidas entregan el contenido completo a clientes sin sesión | Alta | RN-AUTH-015 | TC-AUTH-SES-011 | ANOM-AUTH-02, H-CAT-07 |
| DEF-DEMO-FRAMEWORK-003 | La cantidad 0 es aceptada en el carrito | Media | RN-CART-005 | TC-CART-GEST-009 | ANOM-CART-01 |
| DEF-DEMO-FRAMEWORK-004 | Se puede completar una orden con el carrito vacío | Alta | RN-CART-025 | TC-CART-CHK-016 | ANOM-CART-02 |
| DEF-DEMO-FRAMEWORK-005 | `confirm.php` y `thanks.php` son accesibles sin un checkout completado | Media | RN-CART-026 | TC-CART-CHK-017, TC-CART-CHK-018 | ANOM-CART-03 |

### 8.2 Recomendaciones (`qa/06-defects/recommendations/`)

| ID | Título | Categoría | Origen |
|---|---|---|---|
| REC-DEMO-FRAMEWORK-001 | Credenciales demo embebidas y contraseñas en texto plano | Seguridad | ANOM-AUTH-03 |
| REC-DEMO-FRAMEWORK-002 | Enter no envía el formulario de login | Usabilidad / accesibilidad | ANOM-AUTH-04 |
| REC-DEMO-FRAMEWORK-003 | "Remember me" guarda el email aunque el login falle | Usabilidad / privacidad | ANOM-AUTH-05 |
| REC-DEMO-FRAMEWORK-004 | Con sesión activa, `index.php` y "Home" muestran el login | Navegación | ANOM-AUTH-06, H-CAT-03 |
| REC-DEMO-FRAMEWORK-005 | El email del login distingue mayúsculas | Usabilidad | ANOM-AUTH-07 |
| REC-DEMO-FRAMEWORK-006 | Errores JavaScript no controlados | Deuda técnica | H-CAT-01, H-CAT-02, ANOM-CART-09 |
| REC-DEMO-FRAMEWORK-007 | El badge cuenta líneas y no unidades | Usabilidad (pendiente de negocio) | H-CAT-04, ANOM-CART-08 |
| REC-DEMO-FRAMEWORK-008 | El badge no se sincroniza entre pestañas | Usabilidad | H-CAT-05 |
| REC-DEMO-FRAMEWORK-009 | El carrito persiste tras el logout | Privacidad | H-CAT-06 |
| REC-DEMO-FRAMEWORK-010 | Productos Yellow sin filtro de color | Funcional / datos | H-CAT-08 |
| REC-DEMO-FRAMEWORK-011 | Electronics sin `data-testid` en "Model" | Testabilidad | H-CAT-09 |
| REC-DEMO-FRAMEWORK-012 | "Add to Cart" sin retroalimentación visual | Usabilidad | H-CAT-10 |
| REC-DEMO-FRAMEWORK-013 | `confirm.php` usa `innerHTML` sin escapar (lectura de código) | Seguridad | ANOM-CART-04 |
| REC-DEMO-FRAMEWORK-014 | Datos personales en texto plano en `localStorage` | Protección de datos | ANOM-CART-05 |
| REC-DEMO-FRAMEWORK-015 | El teléfono solo valida longitud | Calidad de datos | ANOM-CART-06 |
| REC-DEMO-FRAMEWORK-016 | "Go To Back" deja el formulario de checkout vacío | Usabilidad | ANOM-CART-07 |
| REC-DEMO-FRAMEWORK-017 | Formato del total inconsistente | Consistencia de UI | ANOM-CART-10 |

### 8.3 Reclasificaciones respecto de la Etapa 2

| Hallazgo | Propuesta original | Clasificación final | Motivo |
|---|---|---|---|
| H-CAT-01 (`loadProducts is not defined`) | DEF técnico | REC-DEMO-FRAMEWORK-006 | Ninguna regla de negocio es violada; sin impacto funcional visible (regla 8 del framework) |
| H-CAT-03 ("Home" lleva al login con sesión) | DEF candidato | REC-DEMO-FRAMEWORK-004 | Ninguna regla define el destino esperado de "Home"; se requiere decisión de negocio |
| H-CAT-07 (control de acceso solo en el cliente) | REC de seguridad | DEF-DEMO-FRAMEWORK-001/002 | Viola RN-AUTH-015; se consolida con ANOM-AUTH-01/02 |
| ANOM-CART-08 / H-CAT-04 | REC (duplicado entre módulos) | REC-DEMO-FRAMEWORK-007 | Consolidado en una sola recomendación |
| ANOM-CART-09 / H-CAT-02 | REC (duplicado entre módulos) | REC-DEMO-FRAMEWORK-006 | Consolidado en una sola recomendación |

---

## 9. Supuestos y limitaciones del análisis

- El comportamiento se observó en una sola sesión de exploración (2026-11-20) con Chromium; no se validó en otros navegadores.
- La aplicación es una demo pública: su contenido puede cambiar sin aviso, lo que afectaría los esperados basados en el catálogo estático.
- Algunos comportamientos se dedujeron de la lectura del código fuente y no se ejercitaron en la UI (id inexistente en el carrito, vaciado del carrito al visitar `thanks.php`, `innerHTML` sin escapar); están identificados como tales en las especificaciones y en los reportes.
- La clasificación DEF/REC debe ser confirmada por el responsable de QA; los hallazgos de seguridad se derivan al proceso formal de ciberseguridad y no se realizaron pruebas ofensivas.
- Las credenciales se gestionan exclusivamente mediante variables de entorno (`QA_USER_EMAIL`, `QA_USER_PASSWORD`); en la documentación se usa `<PLACEHOLDER>`.

---

## 10. Próximos pasos

1. Confirmar la clasificación DEF/REC con el responsable de QA.
2. Derivar DEF-DEMO-FRAMEWORK-001/002 y REC-DEMO-FRAMEWORK-001/013/014 al proceso formal de ciberseguridad y protección de datos.
3. Etapa 5: automatizar los 119 TCs con Playwright (`/qa-automation`), comenzando por los 22 P0, con `test.fail()` en los 6 TCs vinculados a defectos.
4. Ejecutar los 2 charters exploratorios P3 y registrar los hallazgos.
