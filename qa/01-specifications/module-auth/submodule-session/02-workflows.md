# Flujos - Autenticación: Sesión y cierre de sesión

### FL-AUTH-004: Acceso a una página protegida sin sesión

**Actor**: Visitante sin sesión
**Trigger**: Navegación directa (URL, marcador o enlace) a una página protegida.
**Precondition**: `localStorage.isLoggedIn` no existe.

**Flow**:
```
[GET /shop.php (u otra página protegida)]
    |
    v
[Servidor responde 200 con el HTML completo]   (ANOM-AUTH-02)
    |
    v
[Guard JS: isLoggedIn ausente?]
    |
    +- [Sí] --> [location.href = index.php] --> [Fin: formulario de login]
    |
    +- [No, cualquier valor] --> [Página protegida visible]  (ANOM-AUTH-01 si el valor no proviene de un login)
```

**Postcondition**: El visitante termina en `/index.php` sin sesión.

### FL-AUTH-005: Cierre de sesión

**Actor**: Comprador autenticado
**Trigger**: Clic en el botón de logout del encabezado.
**Precondition**: Sesión activa (FL-AUTH-001), en una página protegida.

**Flow**:
```
[Página protegida con header-logout-btn visible]
    |
    v
[Clic en header-logout-btn]
    |
    v
[localStorage.removeItem("isLoggedIn")]
    |
    v
[Redirección a /index.php]
    |
    +- [Botón Atrás o URL directa a página protegida] --> [Guard redirige a /index.php]
    |
    v
[Fin: sin sesión; rememberedEmail se conserva]
```

**Postcondition**: No hay sesión; las páginas protegidas redirigen al login.

### FL-AUTH-006: Pérdida de la sesión durante la navegación (ruta de error)

**Actor**: Comprador autenticado
**Trigger**: `isLoggedIn` desaparece del `localStorage` (limpieza de datos del sitio, otra pestaña hace logout, contexto nuevo).
**Precondition**: Sesión activa.

**Flow**:
```
[Sesión activa en pestaña A]
    |
    v
[isLoggedIn eliminado (logout en pestaña B o limpieza de datos)]
    |
    v
[Siguiente navegación a página protegida en pestaña A]
    |
    v
[Guard redirige a /index.php]
    |
    v
[Fin: el usuario debe volver a iniciar sesión]
```

**Postcondition**: Sin sesión en ninguna pestaña del contexto.
