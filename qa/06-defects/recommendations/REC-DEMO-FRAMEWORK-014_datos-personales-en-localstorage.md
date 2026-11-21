# Recomendación - REC-DEMO-FRAMEWORK-014: Datos personales del checkout en texto plano en localStorage

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-014 |
| Título | Datos personales del checkout en texto plano en localStorage |
| Categoría | Privacidad / protección de datos |
| Módulo | CART |
| Origen | ANOM-CART-05 |
| Reglas / flujos relacionados | RN-CART-020 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Nombre, email, teléfono y dirección quedan en `localStorage.user` hasta cargar `thanks.php`; si el usuario abandona en `confirm.php` permanecen indefinidamente.

## Por qué no es un defecto

RN-CART-020 documenta el comportamiento actual. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

No persistir datos personales en el cliente o limpiarlos al abandonar el flujo; revisar con el área de protección de datos.
