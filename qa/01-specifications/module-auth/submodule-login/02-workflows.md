# Flujos - Autenticación: Inicio de sesión

### FL-AUTH-001: Inicio de sesión exitoso

**Actor**: Comprador (cuenta demo o usuario registrado)
**Trigger**: El usuario abre `/index.php` para entrar a la tienda.
**Precondition**: Sin `isLoggedIn` en `localStorage`.

**Flow**:
```
[Inicio: /index.php]
    |
    v
[Ingresar email y contraseña]  (o clic en "Autofill demo credentials")
    |
    +- [Opcional: marcar "Remember me"]
    |
    v
[Clic en "Login"]   (Enter NO envía - ANOM-AUTH-04)
    |
    v
[Validaciones RN-AUTH-001..005 superadas]
    |
    v
[Credenciales coinciden (RN-AUTH-006)]
    |
    v
[localStorage.isLoggedIn = "true"; rememberedEmail según checkbox]
    |
    v
[Fin: redirección a /shop.php, header con logout y carrito visibles]
```

**Postcondition**: Sesión activa en el navegador; `/shop.php` muestra el breadcrumb "Shop" y 4 tarjetas de categoría.

### FL-AUTH-002: Inicio de sesión rechazado

**Actor**: Comprador
**Trigger**: Clic en "Login" con datos incompletos, mal formados o incorrectos.
**Precondition**: Usuario en `/index.php` sin sesión.

**Flow**:
```
[Clic en "Login"]
    |
    v
[Ocultar errores previos]
    |
    +- [Email vacío] -------------> ["Please enter your email."]
    +- [Contraseña vacía] --------> ["Please enter your password."]
    +- [Email mal formado] -------> ["Please enter a valid email address."]
    +- [Contraseña < 4] ----------> ["Password must be at least 4 characters long."]
    +- [Sin coincidencia] --------> ["Invalid email or password!"]
    |
    v
[Fin: permanece en /index.php, sin isLoggedIn]
    |
    v
[Usuario escribe en email/contraseña -> errores se ocultan (RN-AUTH-009)]
```

**Postcondition**: No se crea sesión. Si "Remember me" estaba marcado, el email queda guardado igualmente (ANOM-AUTH-05).

### FL-AUTH-003: Recordar email entre visitas

**Actor**: Comprador
**Trigger**: Login con "Remember me" marcado y posterior regreso a `/index.php`.
**Precondition**: Ninguna.

**Flow**:
```
[/index.php, marcar "Remember me"]
    |
    v
[Clic en "Login" -> rememberedEmail = email]
    |
    v
[Login exitoso -> /shop.php -> logout -> /index.php]
    |
    v
[Carga de index.php: email precargado, checkbox marcado, contraseña vacía]
    |
    +- [Desmarcar y hacer clic en "Login"] --> [rememberedEmail eliminado]
    |
    v
[Fin]
```

**Postcondition**: `rememberedEmail` refleja el último clic en "Login".
