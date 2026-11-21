# Datos de prueba - Badge del carrito y Add to Cart (BADGE)

## Prerrequisitos

| Elemento | Descripción | Fuente |
|------|-------------|--------|
| Sesión | `storageState` con `isLoggedIn` | Setup de Playwright con `QA_USER_EMAIL` / `QA_USER_PASSWORD` (`<PLACEHOLDER>`) |
| Carrito vacío | `localStorage.cart` ausente o `[]` al iniciar cada test | `page.evaluate(() => localStorage.removeItem('cart'))` |

## Dependencias upstream

No hay reglas de tipo "Dependency". Los ids agregados deben existir en `js/products.js` (1-85).

## Datos por escenario

| Escenario | Acción | Esperado |
|---|---|---|
| Primer producto | Clic `add-to-cart-21` en Men | badge "1", `[{"id":21,"qty":1}]` |
| Mismo producto 2 veces | 2 clics `add-to-cart-21` | badge "1", `[{"id":21,"qty":2}]` |
| Dos productos | + `add-to-cart-22` | badge "2" |
| Otra categoría | + `add-to-cart-61` en Electronics | badge "3" |
| Desde listado filtrado | Footwear + `add-to-cart-35` | `[{"id":35,"qty":1}]` |
| Carrito precargado (móvil) | `cart = [{id:1,qty:1},{id:2,qty:3}]` | badge "2" |
| Carrito corrupto | `cart = "not-json"` | badge "0", 20 productos en Women |

## Generación de datos dinámicos (patrón EXEC_IDX)

No se crean datos persistentes. Si se necesita elegir un producto variable por ejecución:

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const productId = 21 + (Number(EXEC_IDX) % 20); // id de Men entre 21 y 40
```

## Reglas de aislamiento

1. Cada test inicia con `localStorage.cart` vacío y lo limpia al terminar.
2. No reutilizar el `storageState` con un carrito guardado: el `storageState` debe contener solo `isLoggedIn`.
3. Los tests de varias pestañas usan páginas del mismo contexto; los demás, contextos separados.
