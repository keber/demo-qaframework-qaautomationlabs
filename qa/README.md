# QA - demo-framework

> Framework: `@keber/qa-framework` v1.14.0-rc.9
> Language: es | Base URL: `https://shop.qaautomationlabs.com` (`QA_BASE_URL`)
> ADO: deshabilitado (fuera de alcance)

---

## Module Status

| Module | Submodule | TCs Total | TCs Automated | Plan | ADO Suite | Status | Last Run |
|---|---|---|---|---|---|---|---|
| auth | LOGIN | 19 | 19 | ✅ | - | ✅ Etapas 1-5b completas (19 pasan) | 2026-11-20 |
| auth | SES | 12 | 12 | ✅ | - | ✅ Etapas 1-5b completas (10 pasan, 2 `test.fail()`: DEF-001, DEF-002) | 2026-11-20 |
| catalog | SHOP | 10 | 10 | ✅ | - | ✅ Etapas 1-5b completas (10 pasan) | 2026-11-20 |
| catalog | LIST | 20 | 20 | ✅ | - | ✅ Etapas 1-5b completas (20 pasan) | 2026-11-20 |
| catalog | DETAIL | 8 | 8 | ✅ | - | ✅ Etapas 1-5b completas (8 pasan) | 2026-11-20 |
| catalog | BADGE | 12 | 12 | ✅ | - | ✅ Etapas 1-5b completas (12 pasan) | 2026-11-20 |
| cart | GEST | 18 | 18 | ✅ | - | ✅ Etapas 1-5b completas (17 pasan, 1 `test.fail()`: DEF-003) | 2026-11-20 |
| cart | CHK | 20 | 20 | ✅ | - | ✅ Etapas 1-5b completas (17 pasan, 3 `test.fail()`: DEF-004, DEF-005) | 2026-11-20 |
| **Total** | | **119** | **119** | | | **113 pasan, 6 `test.fail()`** | |

**Legend**: ✅ Done · ⚠️ Partial · 🔲 Not started · ⛔ Blocked

---

## Artefactos de planificación (Sprint 1)

| Artefacto | Ruta |
|---|---|
| Plan de Pruebas (AUTH, CAT, CART) | `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md` |
| Informe de Análisis de Pruebas | `qa/02-test-plans/sprints/Sprint-1/Informe-de-Analisis-de-Pruebas-demo-framework-Sprint-1.md` |
| Defectos abiertos (5) | `qa/06-defects/open/` |
| Recomendaciones (17) | `qa/06-defects/recommendations/` |

Prioridades: P0 22 · P1 48 · P2 39 · P3 10. Automatizables: 117 completos + 2 parciales.

## Informes finales (Sprint 1)

| Informe | Fuente (Markdown) | PDF |
|---|---|---|
| Informe de Análisis de Pruebas | `qa/02-test-plans/sprints/Sprint-1/Informe-de-Analisis-de-Pruebas-demo-framework-Sprint-1.md` | `qa/09-reports/Informe-de-Analisis-de-Pruebas.pdf` |
| Plan de Pruebas (AUTH, CAT, CART) | `qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md` | `qa/09-reports/Plan-de-Pruebas.pdf` |
| Informe de Ejecución de Pruebas | `qa/05-test-execution/Informe-de-Ejecucion-de-Pruebas-demo-framework-Sprint-1.md` | `qa/09-reports/Informe-de-Ejecucion-de-Pruebas.pdf` |

Corrida final (2026-11-20, Chromium, Playwright 1.65.1): 119 TCs, 113 pasados, 6 fallos esperados (DEF-DEMO-FRAMEWORK-001..005), 0 fallidos, 0 omitidos, 0 flaky.

## Open Defects

| ID | Descripción | TCs con `test.fail()` | Severidad |
|---|---|---|---|
| DEF-DEMO-FRAMEWORK-001 | El guard de sesión acepta cualquier valor no vacío de `isLoggedIn` | TC-AUTH-SES-010 | Alta |
| DEF-DEMO-FRAMEWORK-002 | Páginas protegidas entregan contenido sin sesión (HTTP 200) | TC-AUTH-SES-011 | Alta |
| DEF-DEMO-FRAMEWORK-003 | La cantidad 0 es aceptada en el carrito | TC-CART-GEST-009 | Media |
| DEF-DEMO-FRAMEWORK-004 | Se puede completar una orden con el carrito vacío | TC-CART-CHK-016 | Alta |
| DEF-DEMO-FRAMEWORK-005 | confirm.php y thanks.php accesibles sin checkout completado | TC-CART-CHK-017, TC-CART-CHK-018 | Media |

---

## Quick-Start Commands

```bash
# Instalación (una vez)
cd qa/07-automation/e2e
npm install
npx playwright install chromium

# Variables de entorno (o en qa/07-automation/e2e/.env, copiado de .env.example y excluido de git)
export QA_BASE_URL=https://shop.qaautomationlabs.com
export QA_LOGIN_PATH=/index.php
export QA_USER_EMAIL=<PLACEHOLDER>
export QA_USER_PASSWORD=<PLACEHOLDER>

# Suite completa (119 TCs), tal como se ejecutó la corrida final
QA_LANE_ONLY=1 npx playwright test --project=chromium --project=login-flow --workers=4

# Un módulo concreto
QA_LANE_ONLY=1 npx playwright test tests/cart/ --project=chromium --project=login-flow

# Abrir el informe HTML (se genera en qa/05-test-execution/automated/html-report)
npx playwright show-report ../../05-test-execution/automated/html-report
```

> En Git Bash para Windows, anteponga `MSYS_NO_PATHCONV=1` al comando para que `/index.php` no se
> convierta en una ruta de Windows. `QA_LANE_ONLY=1` fija la corrida al carril 1 (`QA_USER`) de
> `parallelLanes` en `qa/qa-framework.config.json`.
>
> CI: el workflow `.github/workflows/e2e.yml` ejecuta la suite bajo demanda (`workflow_dispatch`) y
> publica el informe HTML de Playwright en GitHub Pages.

---

## Active Blockers

| ID | Description | Affects | Opened | Status |
|---|---|---|---|---|
| - | No active blockers | - | - | - |

---

## Last Run

| Suite | Date | Pass | Fail | Skip | CI Link |
|---|---|---|---|---|---|
| E2E | 2026-11-20 | 113 (+6 `test.fail()` esperados) | 0 | 0 | Local: `qa/05-test-execution/automated/results.json` |

> Sin suite API: el proyecto no usa pruebas de integración API (`qa/07-automation/integration/`).

## Last Execution

| Date | Suite | Pass | Skip | Fail | Duration | Report |
|---|---|---|---|---|---|---|
| 2026-11-20 | E2E Chromium (`chromium` + `login-flow`, 4 workers) | 113 + 6 esperados | 0 | 0 | 1 min 55 s (114,9 s) | `qa/05-test-execution/automated/html-report/`, `qa/05-test-execution/automated/STABILIZATION-REPORT-2026-11-20.md` |

## Flaky Tests

Ninguno. La estabilización (Etapa 5b) ejecutó dos corridas completas adicionales más la corrida
final: 0 fallos inesperados y 0 tests flaky en las tres.

> Formato si aparece uno: `[flaky] <test-id> - <causa raíz> - last seen <YYYY-MM-DD>`. Retirar la
> anotación tras 2 o más corridas de CI estables consecutivas.

---

## Sprint History

### Sprint 1 - AUTH, CAT, CART (2026-11-20)

**Submodules**: AUTH (LOGIN, SES), CAT (SHOP, LIST, DETAIL, BADGE), CART (GEST, CHK)
**TCs automated**: 119 (22 P0 + 48 P1 + 39 P2 + 10 P3); 113 pasan, 6 `test.fail()` sobre DEF-DEMO-FRAMEWORK-001..005
**Execution report**: `qa/05-test-execution/Informe-de-Ejecucion-de-Pruebas-demo-framework-Sprint-1.md` (PDF en `qa/09-reports/`)

Checklist (completed):
- [x] Instalación y configuración del framework (pasos de `AGENT-NEXT-STEPS.md`; sin integración ADO)
- [x] Etapas 1-2: análisis y especificaciones de 3 módulos y 8 submódulos
- [x] Etapas 3-4: Plan de Pruebas (119 TCs) e Informe de Análisis
- [x] Registro de 5 defectos (`qa/06-defects/open/`) y 17 recomendaciones (`qa/06-defects/recommendations/`)
- [x] Etapa 5: suite Playwright con los 119 TCs
- [x] Etapa 5b: estabilización (TC-AUTH-LOGIN-014 corregido en el test; sin defectos nuevos)
- [x] Informes finales en PDF (`qa/09-reports/`)

---

## Resources

| Resource | Link |
|---|---|
| QA Structure Guide | `qa/QA-STRUCTURE-GUIDE.md` |
| Naming Conventions | `qa/00-standards/naming-conventions.md` |
| Memory Index | `qa/memory/INDEX.md` |
| Agent Next Steps | `qa/AGENT-NEXT-STEPS.md` |
| Automation Config | `qa/07-automation/e2e/playwright.config.ts` |
