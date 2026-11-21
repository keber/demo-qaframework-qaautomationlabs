# Datos de prueba - Inicio de sesión

## Prerrequisitos

| Elemento | Descripción | Fuente |
|----------|-------------|--------|
| Cuenta demo | Cuenta pública fija de la tienda | Variables `QA_USER_EMAIL` / `QA_USER_PASSWORD` |
| Contexto de navegador limpio | `localStorage` vacío para el origen (sin `isLoggedIn`, `rememberedEmail` ni `users`) | Contexto nuevo de Playwright por test |

## Dependencias upstream

| Entidad upstream (módulo) | Condición de validez | Consumida por | Regla |
|---|---|---|---|
| Usuario registrado (`register.php`, fuera de alcance) | Registro en `localStorage.users` con `email` y `password` que coinciden exactamente con la entrada recortada | Campos email y contraseña de `/index.php` | RN-AUTH-013 |

Provisión recomendada: antes de navegar, `page.addInitScript` o `page.evaluate` que escriba
`localStorage.users = JSON.stringify([{ email, password }])` con valores generados por EXEC_IDX.

## Formas de datos por escenario

### Escenario: login exitoso (cuenta demo)
- Email: `process.env.QA_USER_EMAIL`
- Contraseña: `process.env.QA_USER_PASSWORD`

### Escenario: login exitoso (usuario registrado)
- Email: `qa.auth.${EXEC_IDX}@example.test`
- Contraseña: cadena de 8 caracteres generada en el test (no es secreta, solo existe en el `localStorage` del contexto)

### Escenario: validaciones de formato (parametrizado)
| Caso | Email | Contraseña | Mensaje esperado |
|------|-------|------------|------------------|
| Ambos vacíos | `` | `` | "Please enter your email." |
| Email vacío | `` | `abcd` | "Please enter your email." |
| Solo espacios | `   ` | `   ` | "Please enter your email." |
| Contraseña vacía | `QA_USER_EMAIL` | `` | "Please enter your password." |
| Sin arroba | `abc` | `abcd` | "Please enter a valid email address." |
| Sin dominio con punto | `abc@x` | `abcd` | "Please enter a valid email address." |
| Con espacio interno | `a b@x.com` | `abcd` | "Please enter a valid email address." |
| Contraseña corta | `QA_USER_EMAIL` | `abc` | "Password must be at least 4 characters long." |
| Contraseña corta tras trim | `QA_USER_EMAIL` | ` ab ` | "Password must be at least 4 characters long." |

### Escenario: credenciales inválidas
- Contraseña incorrecta: `QA_USER_EMAIL` + `wrongpass`
- Email no registrado: `qa.noexiste.${EXEC_IDX}@example.test` + `QA_USER_PASSWORD`
- Email en mayúsculas: `QA_USER_EMAIL.toUpperCase()` + `QA_USER_PASSWORD`
- Resultado esperado: "Invalid email or password!"

## Generación de datos dinámicos (EXEC_IDX)

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const regEmail = `qa.auth.${EXEC_IDX}@example.test`;
```

## Reglas de aislamiento

1. Cada test usa un contexto de navegador nuevo: `localStorage` es la única fuente de sesión y no debe compartirse entre tests.
2. Los tests de "Remember me" verifican y limpian `rememberedEmail` dentro del mismo contexto.
3. Los usuarios sembrados en `localStorage.users` desaparecen con el contexto; no requieren limpieza.
4. La cuenta demo no tiene estado en servidor, por lo que puede usarse en paralelo sin invalidar sesiones.
