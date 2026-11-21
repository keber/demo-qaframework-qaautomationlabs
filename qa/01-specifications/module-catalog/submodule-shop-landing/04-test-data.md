# Datos de prueba - Inicio de tienda y navegación (SHOP)

## Prerrequisitos

| Elemento | Descripción | Fuente |
|------|-------------|--------|
| Cuenta demo | Cuenta pública del sitio | `QA_USER_EMAIL` / `QA_USER_PASSWORD` (valor: `<PLACEHOLDER>`) |
| Sesión | `storageState` con `localStorage.isLoggedIn = "true"` generado por el login | Setup de Playwright (`.auth/user-default.json`) |

## Dependencias upstream

No hay reglas de tipo "Dependency" en este submódulo.

## Datos por escenario

### Escenario: navegación feliz
- Usuario: rol `user`, credenciales desde `QA_USER_EMAIL` / `QA_USER_PASSWORD`.
- Datos esperados (estáticos en el HTML): títulos "Men Fashion", "Women Fashion", "Kids Fashion", "Electronics".

### Escenario: acceso sin sesión
- Contexto de navegador nuevo, sin `storageState`.
- Esperado: URL final `/index.php`.

## Generación de datos dinámicos (patrón EXEC_IDX)

No se crean datos en este submódulo. Si se requiere un texto único (por ejemplo, para la búsqueda de cabecera):

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const uniqueTerm = `cat-${EXEC_IDX}`;
```

## Reglas de aislamiento

1. Cada test usa un contexto de navegador propio; `localStorage` no se comparte entre contextos.
2. Los tests de acceso sin sesión no deben cargar `storageState`.
3. No hay datos que limpiar en el servidor (la aplicación no persiste nada del lado del servidor).
