# Datos de prueba - Sesión y cierre de sesión

## Prerrequisitos

| Elemento | Descripción | Fuente |
|----------|-------------|--------|
| Cuenta demo | Credenciales para crear la sesión por UI | `QA_USER_EMAIL` / `QA_USER_PASSWORD` |
| Sesión autenticada | `localStorage.isLoggedIn = "true"` en el origen `{{QA_BASE_URL}}` | Login por UI en el test, o `storageState` `.auth/user-default.json` generado en `global-setup.ts` |
| Contexto sin sesión | Contexto de navegador nuevo, sin `storageState` | Playwright |

## Dependencias upstream

No hay reglas de tipo "Dependency" en este submódulo. La sesión depende del login (RN-AUTH-014), cubierto en `submodule-login`.

## Formas de datos por escenario

### Escenario: acceso sin sesión (parametrizado)
- Páginas: `/shop.php`, `/mens-wear.php`, `/womens-wear.php`, `/kids-wear.php`, `/electronics.php`, `/cart.php`
- Esperado: URL final `/index.php`

### Escenario: sesión falsificada
- `localStorage.isLoggedIn = "false"` (valor que no proviene de un login), sin login previo
- Esperado según RN-AUTH-015: redirección a `/index.php`

### Escenario: contenido servido sin sesión
- Petición HTTP GET a `/shop.php` sin cookies ni storage (por ejemplo `request.get` de Playwright)
- Esperado según RN-AUTH-015: el cuerpo no contiene contenido protegido (por ejemplo, `data-testid="category-card-men"`) o la respuesta es una redirección (3xx) / 401

## Generación de datos dinámicos (EXEC_IDX)

No se requieren datos únicos: la sesión no tiene estado en servidor.

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
```

## Reglas de aislamiento

1. Cada test parte de un contexto nuevo; los tests de logout no deben reutilizar el `storageState` compartido modificándolo en disco.
2. Para tests multipestaña usar `context.newPage()` dentro del mismo contexto.
3. Para el escenario de sesión falsificada, escribir `localStorage` con `page.addInitScript` o `page.evaluate` sobre el origen antes de navegar a la página protegida.
