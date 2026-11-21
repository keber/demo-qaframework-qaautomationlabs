# Datos de prueba - Listado por categoría (LIST)

## Prerrequisitos

| Elemento | Descripción | Fuente |
|------|-------------|--------|
| Sesión | `storageState` con `isLoggedIn` | Setup de Playwright con `QA_USER_EMAIL` / `QA_USER_PASSWORD` (`<PLACEHOLDER>`) |
| Catálogo | 85 productos estáticos | `GET /js/products.js` (`window.PRODUCTS`) |

## Dependencias upstream

| Entidad upstream (módulo) | Condición de validez | Consumido por | Regla |
|---|---|---|---|
| Catálogo estático `window.PRODUCTS` (CAT, `js/products.js`) | El producto aparece solo si su `category` coincide con la página; es alcanzable por un filtro solo si su `subcategory`, `size`, `color` o `price` coincide con un valor de ese filtro | Listado, filtros, búsqueda y orden de las 4 páginas de categoría | RN-CAT-024 |

## Recuentos esperados (derivados de products.js el 2026-11-20)

Para evitar valores fijos frágiles, los tests deberían calcular el esperado leyendo `window.PRODUCTS` en la
página (`page.evaluate`) y aplicando el mismo criterio. Referencia observada:

| Categoría | Total | Precio 0-100 / 101-200 / 201-300 / 301-400 / 401-500 | Tipo | Talla o marca | Color |
|---|---|---|---|---|---|
| Men | 20 | 2 / 3 / 4 / 5 / 6 | Formal 10, Footwear 10 | 4 por talla | Black 8, White 6, Green 3, Blue 2, Red 1 |
| Women | 20 | 2 / 2 / 6 / 5 / 5 | Formal 10, Footwear 10 | 4 por talla | Black 5, White 5, Blue 4, Red 3, Green 2, Yellow 1 |
| Kids | 20 | 1 / 4 / 3 / 7 / 5 | Formal 10, Footwear 10 | 4 por talla | Red 6, Black 4, White 3, Green 3, Blue 3, Yellow 1 |
| Electronics | 25 | 4 / 6 / 4 / 7 / 4 | 5 por tipo | 5 por marca | (sin filtro) |

## Datos por escenario

### Escenario: filtro OR dentro del grupo (Men)
- Marcar `filter-price-0-100` -> 2; añadir `filter-price-101-200` -> 5.

### Escenario: filtro AND entre grupos (Men)
- `filter-type-footwear` -> 10; + `filter-color-white` -> 4; + `filter-size-s` -> 0 con "No products found".

### Escenario: búsqueda (Men)
- "black" -> 8; "  BLACK  " -> 8; "xyz123" -> 0; "Frock" (existe en Women/Kids) -> 0.

### Escenario: búsqueda con resultado singular (Women)
- "Frock" -> "1 product".

### Escenario: Electronics
- `filter-brand-sony` -> 5; + `filter-type-tv` -> 1 ("Sony Bravia 2 TV").

## Generación de datos dinámicos (patrón EXEC_IDX)

Para términos de búsqueda sin coincidencias garantizadas:

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const noMatchTerm = `zz-${EXEC_IDX}`;
```

## Reglas de aislamiento

1. Cada test parte de la página recién cargada (sin filtros: RN-CAT-020).
2. No se modifica ningún dato del servidor.
3. Si un test agrega productos al carrito, limpiar `localStorage.cart` al final.
