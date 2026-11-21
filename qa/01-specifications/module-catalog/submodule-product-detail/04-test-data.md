# Datos de prueba - Detalle de producto (DETAIL)

## Prerrequisitos

| Elemento | Descripción | Fuente |
|------|-------------|--------|
| Sesión | `storageState` con `isLoggedIn` | Setup de Playwright con `QA_USER_EMAIL` / `QA_USER_PASSWORD` (`<PLACEHOLDER>`) |
| Catálogo | Productos con ids 1-85 | `js/products.js` |

## Dependencias upstream

No hay reglas de tipo "Dependency" propias; el detalle consume el mismo catálogo estático descrito en RN-CAT-024.

## Datos por escenario

| Escenario | id | Esperado |
|---|---|---|
| Ropa (Men) | 21 | "Black T-Shirt", $150 |
| Ropa (Men) | 23 | "Green Shirt", $200 |
| Electronics | 70 | "LG UHD AI TV", $180, imagen `products/Electronics/e-10.jpg` |
| Inexistente | 99999 | "Product not found" |
| No numérico | abc | "Product not found" |
| Sin parámetro | (sin `id`) | "Product not found" |

Preferir leer el esperado desde `window.PRODUCTS` en la página para no fijar valores.

## Generación de datos dinámicos (patrón EXEC_IDX)

No se crean datos. Para un id inexistente se puede usar un valor fuera de 1-85:

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const missingId = 100_000 + Number(EXEC_IDX);
```

## Reglas de aislamiento

1. Los tests que agregan al carrito limpian `localStorage.cart` al terminar.
2. Cada test usa su propio contexto de navegador.
