# Recomendación - REC-DEMO-FRAMEWORK-003: "Remember me" guarda el email aunque el login falle

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-003 |
| Título | "Remember me" guarda el email aunque el login falle |
| Categoría | Usabilidad / privacidad |
| Módulo | AUTH |
| Origen | ANOM-AUTH-05 |
| Reglas / flujos relacionados | RN-AUTH-010 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Con "Remember me" marcado, `localStorage.rememberedEmail` se escribe incluso cuando el login falla por validación o credenciales.

## Por qué no es un defecto

RN-AUTH-010 documenta explícitamente que el email se guarda con cualquier resultado. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Guardar el email recordado solo tras un login exitoso.
