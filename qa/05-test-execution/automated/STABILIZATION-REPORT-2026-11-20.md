# Reporte de estabilización (Etapa 5b) - 2026-11-20

| Campo | Valor |
|---|---|
| Fecha de ejecución | 2026-11-20 (`npx qa-framework clock --date`) |
| Ambiente | QA (`{QA_BASE_URL}` = https://shop.qaautomationlabs.com), Chromium headless |
| Proyectos | `chromium` + `login-flow`, 4 workers, carril 1 (`QA_USER`) reservado vía lane-lock con heartbeat |
| Suite | `qa/07-automation/e2e` (119 TCs) |

## Tabla de TCs

| ID | Categoría | Causa raíz | Corrección aplicada | Confianza | Estado |
|---|---|---|---|---|---|
| TC-AUTH-LOGIN-014 | I - Error de lógica del test | Con email `abc` y contraseña vacía, RN-AUTH-003 evalúa "contraseña vacía" antes que "formato de email" y muestra solo `login-password-error`. El test esperaba `login-email-error`, que correctamente permanece oculto. La aplicación cumple la spec; no hay defecto. | La aserción del paso 2 se alineó con RN-AUTH-003: `login-password-error` con el texto exacto "Please enter your password." y `login-email-error` oculto (aserción más estricta, no debilitada). Se precisó el esperado del paso 2 en la fila del plan. | 100 | Estable (3/3 aislado + 3 corridas completas) |

## Verificación de flakiness

Dos corridas completas adicionales (resultados en directorio temporal) más la corrida final oficial: 0 fallos inesperados y 0 tests flaky en las tres. No se aplicaron correcciones de flakiness.

## Resumen (corrida final, `results.json`)

| Métrica | Valor |
|---|---|
| Pasados | 113 |
| Fallo esperado (defectos abiertos DEF-DEMO-FRAMEWORK-001..005) | 6 |
| Fallidos | 0 |
| Omitidos | 0 |
| Flaky | 0 |
| Duración | 1,9 min (114,9 s) |

Bloqueos que requieren corrección de la aplicación: los ya documentados en DEF-DEMO-FRAMEWORK-001..005. No se creó ningún defecto nuevo.

## Recomendaciones

- Al redactar pasos del tipo "ver un error de validación" en el login, indicar el slot exacto (`login-email-error`, `login-password-error` o `login-error-message`) según el orden de RN-AUTH-003. Registrado como STAB-001 en `qa/memory/e2e-stabilization-patterns.md`.
