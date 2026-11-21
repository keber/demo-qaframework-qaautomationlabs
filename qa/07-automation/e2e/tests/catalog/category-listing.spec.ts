// INSPECTION: 2026-11-20 (from qa/01-specifications/module-catalog/submodule-category-listing/00-inventory.md)
// Pages: mens-wear (20, ids 21-40), womens-wear (20, 1-20), kids-wear (20, 41-60), electronics (25, 61-85).
// Filters (Bootstrap custom-control, label intercepts clicks -> toggleFilter clicks the label):
//   filter-type-*, filter-price-{0-100|101-200|201-300|301-400|401-500}, filter-size-*, filter-brand-*, filter-color-*.
// Toolbar: search-input (input event), sort-select, results-count ("N products" / "1 product").
// Cards: product-card-{id}, product-image-{id}, product-name-{id}, product-price-{id}, product-meta-{id},
//   product-category-{id}, add-to-cart-{id}; empty state: no-products-message.
// Known harmless JS error: loadProducts is not defined (H-CAT-01).

import { test, expect } from '@playwright/test';
import {
  EXEC_IDX, NO_SESSION, expectRedirectToLogin, expectResults, openCategory, productIds,
  productNames, productPrices, toggleFilter,
} from '../../fixtures/shop-helpers';

const CATEGORIES = [
  { path: '/mens-wear.php', label: 'Men', count: 20, from: 21, to: 40 },
  { path: '/womens-wear.php', label: 'Women', count: 20, from: 1, to: 20 },
  { path: '/kids-wear.php', label: 'Kids', count: 20, from: 41, to: 60 },
  { path: '/electronics.php', label: 'Electronics', count: 25, from: 61, to: 85 },
];

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

test.describe('CAT - Listado, filtros y búsqueda (sin sesión)', () => {
  test.use({ storageState: NO_SESSION });

  test('[TC-CAT-LIST-001] Usuario sin sesión es redirigido al login al abrir una categoría @P0', async ({ page }) => {
    for (const cat of CATEGORIES) {
      await test.step(`Categoría ${cat.path}`, async () => {
        await page.goto(cat.path);
        await expectRedirectToLogin(page);
        await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(0);
      });
    }
  });
});

test.describe('CAT - Listado, filtros y búsqueda', () => {
  test('[TC-CAT-LIST-002] Cada categoría lista solo sus productos con el total correcto @P0', async ({ page }) => {
    for (const cat of CATEGORIES) {
      await test.step(`Categoría ${cat.label}`, async () => {
        await openCategory(page, cat.path, cat.count);
        const ids = await productIds(page);
        expect(ids).toHaveLength(cat.count);
        expect([...ids].sort((a, b) => a - b)).toEqual(range(cat.from, cat.to));
        const categories = await page.locator('[data-testid^="product-category-"]').allInnerTexts();
        expect(categories).toHaveLength(cat.count);
        for (const text of categories) expect(text.trim().startsWith(cat.label)).toBe(true);
      });
    }
  });

  test('[TC-CAT-LIST-003] La tarjeta de producto muestra nombre, precio, categoría, meta y botón @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const name = page.getByTestId('product-name-21');
    await expect(name).toHaveText('Black T-Shirt');
    await expect(name).toHaveAttribute('href', 'product.php?id=21');
    await expect(page.getByTestId('product-price-21')).toHaveText('$150');
    await expect(page.getByTestId('product-category-21')).toHaveText('Men - Formal');
    await expect(page.getByTestId('product-meta-21')).toHaveText(/Size:\s*S\s*\|\s*Color:\s*Black/);
    const add = page.getByTestId('add-to-cart-21');
    await expect(add).toBeVisible();
    await expect(add).toHaveText(/Add to Cart/);
  });

  test('[TC-CAT-LIST-004] Todas las imágenes de producto cargan y tienen texto alternativo @P1', async ({ page }) => {
    for (const cat of CATEGORIES) {
      await test.step(`Imágenes ${cat.label}`, async () => {
        await openCategory(page, cat.path, cat.count);
        const report = await page.evaluate(async () => {
          const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('[data-testid^="product-image-"]'));
          const results = await Promise.all(
            imgs.map(
              (img) =>
                new Promise<{ id: string; ok: boolean; alt: string; name: string }>((resolve) => {
                  const id = (img.getAttribute('data-testid') ?? '').replace('product-image-', '');
                  const nameEl = document.querySelector(`[data-testid="product-name-${id}"]`);
                  const base = { id, alt: img.getAttribute('alt') ?? '', name: (nameEl?.textContent ?? '').trim() };
                  const probe = new Image();
                  probe.onload = () => resolve({ ...base, ok: probe.naturalWidth > 0 });
                  probe.onerror = () => resolve({ ...base, ok: false });
                  probe.src = img.currentSrc || img.src;
                })
            )
          );
          return results;
        });
        expect(report).toHaveLength(cat.count);
        expect(report.filter((r) => !r.ok).map((r) => r.id), 'broken images').toEqual([]);
        expect(report.filter((r) => r.alt !== r.name).map((r) => r.id), 'alt different from name').toEqual([]);
      });
    }
  });

  test('[TC-CAT-LIST-005] Filtrar por un tipo muestra solo productos de ese tipo @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-type-footwear', true);
    await expectResults(page, 10);
    expect([...(await productIds(page))].sort((a, b) => a - b)).toEqual(range(31, 40));
    const categories = await page.locator('[data-testid^="product-category-"]').allInnerTexts();
    for (const c of categories) expect(c.trim()).toBe('Men - Footwear');
  });

  test('[TC-CAT-LIST-006] Dos rangos de precio se combinan con OR @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-price-0-100', true);
    await expectResults(page, 2);
    expect(await productPrices(page)).toEqual([100, 100]);
    await toggleFilter(page, 'filter-price-101-200', true);
    await expectResults(page, 5);
    for (const p of await productPrices(page)) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(200);
    }
  });

  test('[TC-CAT-LIST-007] Filtros de grupos distintos se combinan con AND @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-type-footwear', true);
    await expectResults(page, 10);
    await toggleFilter(page, 'filter-color-white', true);
    await expectResults(page, 4);
    expect([...(await productNames(page))].sort()).toEqual(
      ['White Canvas Shoes', 'White Sport Shoes', 'White Sports Shoes', 'White Sports Shoes'].sort()
    );
    const metas = await page.locator('[data-testid^="product-meta-"]').allInnerTexts();
    for (const m of metas) expect(m).toMatch(/Color:\s*White/);
    const categories = await page.locator('[data-testid^="product-category-"]').allInnerTexts();
    for (const c of categories) expect(c.trim()).toBe('Men - Footwear');
  });

  test('[TC-CAT-LIST-008] Combinación sin coincidencias muestra "No products found" @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-type-footwear', true);
    await toggleFilter(page, 'filter-color-white', true);
    await toggleFilter(page, 'filter-size-s', true);
    await expect(page.getByTestId('no-products-message')).toHaveText(/No products found/);
    await expectResults(page, 0);
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(0);
  });

  test('[TC-CAT-LIST-009] Desmarcar todos los filtros restaura el listado completo @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-price-0-100', true);
    await toggleFilter(page, 'filter-price-101-200', true);
    await expectResults(page, 5);
    await toggleFilter(page, 'filter-price-0-100', false);
    await toggleFilter(page, 'filter-price-101-200', false);
    await expectResults(page, 20);
    await expect(page.getByTestId('no-products-message')).toBeHidden();
  });

  test('[TC-CAT-LIST-010] Búsqueda sin distinción de mayúsculas y con recorte de espacios @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const search = page.getByTestId('search-input');
    await search.fill('black');
    await expectResults(page, 8);
    const first = await productIds(page);
    for (const n of await productNames(page)) expect(n).toMatch(/Black/i);
    await search.fill('  BLACK  ');
    await expectResults(page, 8);
    expect(await productIds(page)).toEqual(first);
  });

  test('[TC-CAT-LIST-011] La búsqueda se limita a la categoría actual @P2', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const search = page.getByTestId('search-input');
    for (const term of ['Frock', `zz-${EXEC_IDX}`]) {
      await search.fill(term);
      await expectResults(page, 0);
      await expect(page.getByTestId('no-products-message')).toHaveText(/No products found/);
    }
  });

  test('[TC-CAT-LIST-012] Limpiar la búsqueda restaura el listado @P2', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const search = page.getByTestId('search-input');
    await search.fill('pant');
    await expectResults(page, 6);
    await search.fill('');
    await expectResults(page, 20);
  });

  test('[TC-CAT-LIST-013] Ordenar por precio ascendente y descendente @P1', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const sort = page.getByTestId('sort-select');
    await sort.selectOption({ label: 'Price: Low to High' });
    await expect.poll(async () => (await productPrices(page)).slice(0, 3)).toEqual([100, 100, 150]);
    const asc = await productPrices(page);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    await sort.selectOption({ label: 'Price: High to Low' });
    await expect.poll(async () => (await productPrices(page)).slice(0, 3)).toEqual([500, 500, 485]);
    const desc = await productPrices(page);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    await expectResults(page, 20);
  });

  test('[TC-CAT-LIST-014] Ordenar por nombre A-Z, Z-A y volver al orden original @P2', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    const sort = page.getByTestId('sort-select');
    await sort.selectOption({ label: 'Name: A to Z' });
    await expect.poll(async () => (await productNames(page))[0]).toBe('Black Flotter');
    const az = await productNames(page);
    expect(az).toEqual([...az].sort((a, b) => a.localeCompare(b)));
    await sort.selectOption({ label: 'Name: Z to A' });
    await expect.poll(async () => (await productNames(page))[0]).toBe('White T-Shirt');
    const za = await productNames(page);
    expect(za).toEqual([...za].sort((a, b) => b.localeCompare(a)));
    await sort.selectOption({ value: '' });
    await expect.poll(async () => (await productNames(page)).slice(0, 3)).toEqual([
      'Black T-Shirt', 'White T-Shirt', 'Green Shirt',
    ]);
    expect(await productIds(page)).toEqual(range(21, 40));
  });

  test('[TC-CAT-LIST-015] Búsqueda, filtro y orden combinados @P2', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('search-input').fill('shoes');
    await expect.poll(async () => (await productNames(page)).every((n) => /shoes/i.test(n))).toBe(true);
    await toggleFilter(page, 'filter-color-white', true);
    await expectResults(page, 4);
    await page.getByTestId('sort-select').selectOption({ label: 'Price: Low to High' });
    await expect
      .poll(async () => {
        const names = await productNames(page);
        const prices = await productPrices(page);
        return names.map((n, i) => `${n} $${prices[i]}`);
      })
      .toEqual([
        'White Canvas Shoes $445',
        'White Sports Shoes $450',
        'White Sports Shoes $475',
        'White Sport Shoes $485',
      ]);
  });

  test('[TC-CAT-LIST-016] Electronics ofrece filtros de tipo y marca y no de color @P1', async ({ page }) => {
    await openCategory(page, '/electronics.php', 25);
    for (const t of ['mobile', 'laptop', 'fridge', 'tv', 'monitor']) {
      await expect(page.getByTestId(`filter-type-${t}`)).toHaveCount(1);
    }
    for (const b of ['samsung', 'lg', 'panasonic', 'toshiba', 'sony']) {
      await expect(page.getByTestId(`filter-brand-${b}`)).toHaveCount(1);
    }
    await expect(page.locator('[data-testid^="filter-color-"]')).toHaveCount(0);
    await toggleFilter(page, 'filter-brand-sony', true);
    await expectResults(page, 5);
    for (const n of await productNames(page)) expect(n.startsWith('Sony')).toBe(true);
    await toggleFilter(page, 'filter-type-tv', true);
    await expectResults(page, 1);
    expect(await productNames(page)).toEqual(['Sony Bravia 2 TV']);
  });

  test('[TC-CAT-LIST-017] Los rangos de precio incluyen sus límites @P2', async ({ page }) => {
    await openCategory(page, '/electronics.php', 25);
    await toggleFilter(page, 'filter-price-0-100', true);
    await expectResults(page, 4);
    expect([...(await productPrices(page))].sort((a, b) => a - b)).toEqual([95, 99, 99, 100]);
    await toggleFilter(page, 'filter-price-0-100', false);
    await toggleFilter(page, 'filter-price-101-200', true);
    await expect.poll(async () => (await productPrices(page)).length).toBeGreaterThan(0);
    for (const p of await productPrices(page)) {
      expect(p).toBeGreaterThanOrEqual(101);
      expect(p).toBeLessThanOrEqual(200);
    }
  });

  test('[TC-CAT-LIST-018] El contador usa singular con un solo resultado @P2', async ({ page }) => {
    await openCategory(page, '/womens-wear.php', 20);
    await page.getByTestId('search-input').fill('Frock');
    await expect(page.getByTestId('results-count')).toHaveText('1 product');
  });

  test('[TC-CAT-LIST-019] Filtros, búsqueda y orden no persisten al recargar @P2', async ({ page }) => {
    await openCategory(page, '/mens-wear.php', 20);
    await toggleFilter(page, 'filter-type-footwear', true);
    await expectResults(page, 10);
    await page.reload();
    await expectResults(page, 20);
    await expect(page.getByTestId('filter-type-footwear')).not.toBeChecked();
    await expect(page.getByTestId('search-input')).toHaveValue('');
    await expect(page.getByTestId('sort-select')).toHaveValue('');
  });

  test('[TC-CAT-LIST-020] "Go To Back" y el nombre del producto navegan correctamente @P2', async ({ page }) => {
    await openCategory(page, '/kids-wear.php', 20);
    await page.getByTestId('go-back-btn').click();
    await expect(page).toHaveURL(/\/shop\.php$/);
    await openCategory(page, '/mens-wear.php', 20);
    await page.getByTestId('product-name-21').click();
    await expect(page).toHaveURL(/\/product\.php\?id=21$/);
    await expect(page.getByTestId('product-detail-name')).toHaveText('Black T-Shirt');
  });
});
