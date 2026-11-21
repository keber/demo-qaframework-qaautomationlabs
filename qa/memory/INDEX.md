# Memory Index - demo-framework

> The agent reads this file first before loading any memory file.
> Add a row here whenever you create or update a file in this directory.

| File | Topic | When to load |
|---|---|---|
| `ci-pipeline-findings.md` | CI pipeline issues, root causes, applied fixes, failure triage categories | Diagnosing CI failures; reviewing pipeline changes |
| `e2e-stabilization-patterns.md` | Flakiness patterns, crash-recovery techniques, strict-mode conflicts, reference timeouts; STAB-001 (2026-11-20): TC-AUTH-LOGIN-014, slot de error según RN-AUTH-003 | Investigating intermittent failures; refactoring fragile specs; escribir pasos de validación del login |
| `test-plan-sprint-1-decisions.md` | Decisiones del Plan de Pruebas Sprint 1: prefijo de defectos, mapa TC -> DEF para `test.fail()`, reclasificaciones DEF/REC | Al automatizar (Etapa 5) TCs de AUTH/CAT/CART; al crear o mover defectos |
| `data-volatility-strategies.md` | Strategies for handling volatile test data (filter values, row counts, search inputs) | Fixing hardcoded-data failures; choosing an assertion resilience approach |
