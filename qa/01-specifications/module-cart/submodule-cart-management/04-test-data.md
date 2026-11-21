# Datos de prueba - Gestión del carrito

## Prerrequisitos

| Ítem | Descripción | Origen |
|------|-------------|--------|
| Sesión de comprador | `localStorage.isLoggedIn = "true"` tras login con `QA_USER_EMAIL` / `QA_USER_PASSWORD` | `storageState` del global setup |
| Catálogo | 85 productos estáticos en `js/products.js` | Aplicación (no requiere seed) |
| Carrito inicial | Vacío al inicio de cada test (`localStorage.removeItem('cart')`) | Preparado por el test |

## Dependencias upstream

| Entidad upstream (módulo) | Condición de validez | Consumida por | Regla |
|---------------------------|----------------------|---------------|-------|
| Producto de `window.PRODUCTS` (CAT) | El `id` existe en `js/products.js` (1 a 85) | `cart-item-name-{id}`, `cart-item-price-{id}`, subtotal y total; campo de alcance: `id` del elemento del carrito | RN-CART-012 |

## Formas de datos por escenario

### Escenario: camino feliz (FL-CART-001)
- Productos: id 21 ($150) x 2 y id 22 ($500) x 1, agregados desde `mens-wear.php`.
- Esperado: subtotales $300 y $500, "Total: $800", contador 2.
- Usuario: comprador, credenciales desde `QA_USER_EMAIL` / `QA_USER_PASSWORD` (`<PLACEHOLDER>`).

### Escenario: carrito precargado (atajo para tests de cantidad/eliminación)
```typescript
await page.evaluate(() => localStorage.setItem('cart', JSON.stringify([
  { id: 21, qty: 2 }, { id: 22, qty: 1 }, { id: 61, qty: 1 }, { id: 1, qty: 1 },
])));
await page.goto('/cart.php');
// Esperado: "Total: $1050"
```

### Escenario: cantidades límite (RN-CART-004 a RN-CART-006)
| Valor ingresado en `cart-qty-22` | Cantidad esperada | Subtotal esperado (id 22, $500) |
|----------------------------------|-------------------|---------------------------------|
| `3` | 3 | $1500 |
| `999` | 999 | $499500 |
| `-2` | 1 | $500 |
| `` (vacío) | 1 | $500 |
| `1.5` | 1 | $500 |
| `0` | 1 (spec) - la app guarda 0 (ANOM-CART-01) | $500 (spec) |

## Generación de datos dinámicos (patrón EXEC_IDX)

Este submódulo no crea entidades con nombre único: los productos son fijos. `EXEC_IDX` no aplica
salvo para etiquetar evidencias.

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
```

## Reglas de aislamiento

1. Cada test limpia `localStorage.cart` en `beforeEach`; no hay estado de servidor que limpiar.
2. Los tests pueden ejecutarse en paralelo con la misma cuenta demo: cada worker tiene su propio
   contexto y su propio `localStorage`.
3. Al finalizar, dejar el carrito vacío (`localStorage.removeItem('cart')`).
