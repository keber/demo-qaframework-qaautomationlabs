# Recomendación - REC-DEMO-FRAMEWORK-002: Presionar Enter en la contraseña no envía el formulario de login

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-002 |
| Título | Presionar Enter en la contraseña no envía el formulario de login |
| Categoría | Usabilidad / accesibilidad |
| Módulo | AUTH |
| Origen | ANOM-AUTH-04 |
| Reglas / flujos relacionados | FL-AUTH-001 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

El botón "Login" no está dentro de un `<form>`; solo el clic inicia sesión.

## Por qué no es un defecto

Ninguna regla de negocio define el envío con Enter. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Envolver los campos en un `<form>` con `type="submit"` para permitir Enter y mejorar la accesibilidad por teclado.
