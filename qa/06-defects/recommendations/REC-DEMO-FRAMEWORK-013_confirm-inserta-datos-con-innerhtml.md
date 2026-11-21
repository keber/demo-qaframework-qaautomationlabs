# Recomendación - REC-DEMO-FRAMEWORK-013: confirm.php inserta los datos del usuario con innerHTML sin escapar

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-013 |
| Título | confirm.php inserta los datos del usuario con innerHTML sin escapar |
| Categoría | Seguridad (observación por lectura de código) |
| Módulo | CART |
| Origen | ANOM-CART-04 |
| Reglas / flujos relacionados | RN-CART-021 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Por inspección del código fuente, `confirm.php` inserta los valores de `localStorage.user` mediante `innerHTML` sin escapar, lo que constituye un riesgo latente de XSS. No se ejecutó ninguna carga ofensiva ni se intentó explotar.

## Por qué no es un defecto

Ninguna regla de negocio exige el escape; se registra como riesgo latente de seguridad. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Usar `textContent` (o escapar el HTML) al renderizar datos ingresados por el usuario. Derivar al proceso formal de ciberseguridad para su evaluación; no realizar pruebas ofensivas desde QA funcional.
