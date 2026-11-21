# Datos de prueba - Checkout y confirmación de orden

## Prerrequisitos

| Ítem | Descripción | Origen |
|------|-------------|--------|
| Sesión de comprador | `localStorage.isLoggedIn = "true"` tras login con `QA_USER_EMAIL` / `QA_USER_PASSWORD` | `storageState` del global setup |
| Carrito con productos | `[{ "id": 21, "qty": 2 }, { "id": 22, "qty": 1 }]` (total $800) | Preparado por el test vía UI o `localStorage` |
| Datos de facturación | Datos **ficticios** (nunca datos personales reales) | Constantes del test |

## Dependencias upstream

| Entidad upstream (módulo) | Condición de validez | Consumida por | Regla |
|---------------------------|----------------------|---------------|-------|
| Carrito `localStorage.cart` (CART-GEST) | Al menos una línea con `qty >= 1` y `id` existente en `js/products.js` | `order-total`, `checkout-cart-table`, `confirm-cart-table` | RN-CART-023, RN-CART-025 |
| Datos `localStorage.user` (CART-CHK) | Escritos por un checkout exitoso | `confirm-*` en `confirm.php` | RN-CART-021, RN-CART-026 |

## Formas de datos por escenario

### Escenario: camino feliz (FL-CART-004)
| Campo | Valor |
|-------|-------|
| First Name | `Prueba` |
| Middle Name | vacío (opcional) |
| Last Name | `QA-${EXEC_IDX}` |
| E-mail | `qa.test+${EXEC_IDX}@example.com` |
| Mobile No. | `9876543210` |
| Address | `Calle Falsa 123` |
| State | `Test State` |
| City | `Test City` |
| Pin Code | `12345` |

Esperado: `confirm.php` muestra los mismos valores y "$800"; `thanks.php` muestra el mensaje de éxito.

### Escenario: validaciones negativas (FL-CART-005)
| Campo | Valor inválido | Resultado esperado |
|-------|----------------|--------------------|
| First Name | `   ` | "Please enter your first name." |
| E-mail | `abc@x` | "Please enter a valid email address." |
| E-mail | `abc` | Bloqueo nativo, sin navegación |
| Mobile No. | `123456789` / `12345678901` | "Phone Number Should be 10 digit long." |
| Pin Code | `0` / `-5` | Bloqueo nativo, sin navegación |

### Escenario: carrito vacío (RN-CART-025)
- `localStorage.removeItem('cart')` antes de navegar a `checkout.php`.

## Generación de datos dinámicos (patrón EXEC_IDX)

```typescript
const EXEC_IDX = process.env.EXEC_IDX ?? String(Math.floor(Date.now() / 60_000) % 100_000);
const lastName = `QA-${EXEC_IDX}`;
const email = `qa.test+${EXEC_IDX}@example.com`;
```

## Reglas de aislamiento

1. Cada test prepara su propio carrito y limpia `cart` y `user` de `localStorage` en `afterEach`.
2. No hay datos de servidor que limpiar: la orden no se persiste fuera del navegador.
3. Usar solo dominios reservados (`example.com`) y datos ficticios; nunca datos de clientes reales.
