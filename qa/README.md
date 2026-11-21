# QA - demo-framework

> Framework: `@keber/qa-framework` v1.14.0-rc.9
> Language: es | Base URL: `https://shop.qaautomationlabs.com` (`QA_BASE_URL`)
> ADO: deshabilitado (fuera de alcance)

---

## Module Status

| Module | Submodule | TCs Total | TCs Automated | Plan | ADO Suite | Status | Last Run |
|---|---|---|---|---|---|---|---|
| auth | LOGIN | 19 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| auth | SES | 12 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| catalog | SHOP | 10 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| catalog | LIST | 20 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| catalog | DETAIL | 8 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| catalog | BADGE | 12 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| cart | GEST | 18 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| cart | CHK | 20 | 0 | ✅ | - | ⚠️ Etapas 1-4 completas; automatización pendiente | - |
| **Total** | | **119** | **0** | | | | |

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
# Run all automated tests
cd qa/07-automation
npx playwright test

# Run a specific module
npx playwright test tests/{module-folder}/

# Run with UI (debug mode)
npx playwright test --ui

# Generate HTML report
npx playwright show-report

# Re-run only failed tests
npx playwright test --last-failed
```

> Set credentials in `qa/07-automation/.env` (copy from `.env.example`).

---

## Active Blockers

| ID | Description | Affects | Opened | Status |
|---|---|---|---|---|
| - | No active blockers | - | - | - |

---

## Last Run

| Suite | Date | Pass | Fail | Skip | CI Link |
|---|---|---|---|---|---|
| E2E | - | - | - | - | - |
| API | - | - | - | - | - |

> Update this table after each significant run. The CI Link can be an ADO TestRun URL, a
> GitHub Actions run URL, or a path to a local report file.

## Last Execution

| Date | Suite | Pass | Skip | Fail | Duration | Report |
|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - |

## Flaky Tests

> Mark known flaky tests with this inline annotation directly in the table or spec file.
> Format: `[flaky] <test-id-or-name> - <root cause> - last seen <YYYY-MM-DD>`
>
> Example:
> `[flaky] TC-MOD-012 - timing issue on slow CI agents - last seen 2026-01-15`
>
> Remove the annotation once the test has been stable for 2+ consecutive CI runs.

---

## Sprint History

<!-- Completed sprint checklists are moved here from AGENT-NEXT-STEPS.md -->
<!-- Format per sprint: -->
<!--
### Sprint N - {SPRINT_NAME} ({YYYY-MM-DD})

**Submodules**: {list}
**TCs automated**: {N} P0 + {M} P1
**Execution report**: `qa/05-test-execution/automated/{date-slug}.md`

Checklist (completed):
- [x] {Task 1}
- [x] {Task 2}
-->

_No sprints completed yet._

---

## Resources

| Resource | Link |
|---|---|
| QA Structure Guide | `qa/QA-STRUCTURE-GUIDE.md` |
| Naming Conventions | `qa/00-standards/naming-conventions.md` |
| Memory Index | `qa/memory/INDEX.md` |
| Agent Next Steps | `qa/AGENT-NEXT-STEPS.md` |
| Automation Config | `qa/07-automation/playwright.config.ts` |
