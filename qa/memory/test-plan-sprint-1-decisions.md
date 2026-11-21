# Decisiones del Plan de Pruebas - Sprint 1

| Campo | Valor |
|---|---|
| Fecha | 2026-11-20 |
| Etapa | 3 y 4 (qa-test-plan + qa-test-cases) |
| Alcance | AUTH, CAT, CART (8 submódulos, 119 TCs) |

## Decisiones

- **Plan único de proyecto:** un solo Plan de Pruebas cubre los 3 módulos (`qa/02-test-plans/sprints/Sprint-1/Plan-de-Pruebas-demo-framework-Sprint-1-AUTH-CAT-CART.md`). ADO está deshabilitado, por lo que no existe consolidado de `@keber/ado-qa`.
- **Prefijo de defectos:** `conventions.defectIdPrefix` no está definido; se deriva de `project.name` -> `DEMO-FRAMEWORK` (misma regla que `resolveDefectIdPrefix` del framework). IDs: `DEF-DEMO-FRAMEWORK-NNN` y `REC-DEMO-FRAMEWORK-NNN`; archivos `{ID}_{slug}.md`.
- **Sin TC-*.md en `qa/03-test-cases/`:** la tabla del plan es la fuente autoritativa (pasos con esperado por paso).
- **Etiquetas:** `[SMOKE]` para P0, `[REGRESION]` para el resto. Confirma = `N/A` en todos los TCs.
- **Reclasificaciones:** H-CAT-01 y H-CAT-03 pasan de DEF propuesto a REC (no violan ninguna RN); H-CAT-07 se consolida en DEF-001/002 (viola RN-AUTH-015).

## Mapa TC -> DEF (`test.fail()` en la Etapa 5)

| TC | DEF |
|---|---|
| TC-AUTH-SES-010 | DEF-DEMO-FRAMEWORK-001 |
| TC-AUTH-SES-011 | DEF-DEMO-FRAMEWORK-002 |
| TC-CART-GEST-009 | DEF-DEMO-FRAMEWORK-003 |
| TC-CART-CHK-016 | DEF-DEMO-FRAMEWORK-004 |
| TC-CART-CHK-017, TC-CART-CHK-018 | DEF-DEMO-FRAMEWORK-005 |

Los TCs ligados a recomendaciones (TC-AUTH-LOGIN-009, TC-CAT-BADGE-003/008/010/011, TC-CART-GEST-018, TC-CART-CHK-009/014) usan `test()` normal.
