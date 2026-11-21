# Recomendación - REC-DEMO-FRAMEWORK-001: Credenciales demo embebidas en el JavaScript y contraseñas en texto plano en localStorage

| Campo | Valor |
|-------|-------|
| ID | REC-DEMO-FRAMEWORK-001 |
| Título | Credenciales demo embebidas en el JavaScript y contraseñas en texto plano en localStorage |
| Categoría | Seguridad |
| Módulo | AUTH |
| Origen | ANOM-AUTH-03 |
| Reglas / flujos relacionados | RN-AUTH-006, RN-AUTH-013 |
| TCs que documentan el comportamiento | - |
| Fecha | 2026-11-20 |
| Estado | Abierta (pendiente de decisión del responsable de QA / negocio) |

## Observación

Las credenciales de la cuenta demo están en el JavaScript público de `index.php` y las contraseñas de usuarios registrados se guardan en texto plano en `localStorage.users`.

## Por qué no es un defecto

Ninguna regla exige otro mecanismo; las reglas documentan el comportamiento actual. Una recomendación no justifica `test.fail()` ni se abre como Bug.

## Recomendación

Aceptable en una tienda demo; en un sistema productivo nunca almacenar credenciales en el cliente ni en texto plano: autenticación en servidor con hash de contraseñas (bcrypt/argon2). Derivar al proceso formal de ciberseguridad.
