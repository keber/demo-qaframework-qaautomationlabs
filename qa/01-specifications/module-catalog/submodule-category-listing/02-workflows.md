# Flujos - Catálogo: Listado por categoría (LIST)

### FL-CAT-010: Explorar una categoría y refinar con filtros

**Actor**: Comprador con sesión (`user`)
**Trigger**: Llegar a una página de categoría desde `shop.php`.
**Precondition**: Sesión iniciada.

**Flow**:
```
[Inicio: categoría.php - todos los productos, results-count = total]
    |
    v
[Marcar filtro(s) de un grupo] -- OR dentro del grupo
    |
    v
[Marcar filtro(s) de otro grupo] -- AND entre grupos
    |
    +-- [Sin coincidencias] -> [no-products-message "No products found", "0 products"]
    |
    v
[Desmarcar filtros] -> [vuelve el listado completo]
    |
    v
[Fin: listado filtrado y contador consistente]
```

**Postcondition**: El listado y `results-count` reflejan los filtros activos. Nada se persiste.

### FL-CAT-011: Buscar y ordenar dentro de la categoría

**Actor**: Comprador con sesión
**Trigger**: Escribir en `search-input` o cambiar `sort-select`.
**Precondition**: En una página de categoría.

**Flow**:
```
[Inicio: listado de categoría]
    |
    v
[Escribir término] -> filtrado en cada tecla (trim + minúsculas)
    |
    +-- [Término sin coincidencias] -> "No products found"
    |
    v
[Elegir orden] -> price-asc | price-desc | name-asc | name-desc | Sort by
    |
    v
[Fin: resultados filtrados y ordenados]
```

**Postcondition**: El orden se aplica al conjunto ya filtrado. Al limpiar la búsqueda vuelve el total de la categoría.

### FL-CAT-012: Salir del listado

**Actor**: Comprador con sesión
**Trigger**: Clic en "Go To Back", en un nombre de producto o en "Home" del breadcrumb.
**Precondition**: En una página de categoría.

**Flow**:
```
[Inicio: categoría.php]
    |
    +-- [Go To Back]        -> shop.php
    +-- [Nombre producto]   -> product.php?id={id}
    +-- [Breadcrumb Home]   -> / (muestra login con sesión activa; H-CAT-03)
    |
    v
[Fin]
```

**Postcondition**: El estado de filtros se pierde (RN-CAT-020).

### FL-CAT-013: Ruta de error - acceso sin sesión a una categoría

**Actor**: Visitante sin sesión
**Trigger**: Abrir directamente `mens-wear.php` (u otra categoría).
**Precondition**: Sin `isLoggedIn` en `localStorage`.

**Flow**:
```
[GET categoría.php] -> [script del cliente] -> [redirección a index.php]
```

**Postcondition**: El listado no queda visible para el visitante.
