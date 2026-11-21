# Reglas de negocio - Autenticación: Inicio de sesión

> Todas las reglas fueron observadas en la UI el 2026-11-20 y contrastadas con el JavaScript de `index.php`.

### RN-AUTH-001: Email obligatorio

- **Type**: Validation
- **Trigger**: Clic en "Login" con el email vacío o compuesto solo por espacios.
- **Behavior**: No se inicia sesión; se muestra el error bajo el campo email y no se evalúa ningún otro campo.
- **Error message**: "Please enter your email."
- **Notes**: El valor se recorta (`trim`) antes de evaluar, por lo que "   " se considera vacío.

### RN-AUTH-002: Contraseña obligatoria

- **Type**: Validation
- **Trigger**: Clic en "Login" con email no vacío y contraseña vacía o solo espacios.
- **Behavior**: No se inicia sesión; error bajo el campo contraseña.
- **Error message**: "Please enter your password."

### RN-AUTH-003: Orden de validación y un solo error a la vez

- **Type**: Validation
- **Trigger**: Clic en "Login".
- **Behavior**: Las validaciones se evalúan en este orden y se detienen en la primera que falla: (1) email vacío, (2) contraseña vacía, (3) formato de email, (4) longitud mínima de contraseña, (5) credenciales. Antes de evaluar se ocultan los tres mensajes de error; solo se muestra uno.
- **Notes**: Con ambos campos vacíos se muestra únicamente "Please enter your email.".

### RN-AUTH-004: Formato de email

- **Type**: Validation
- **Trigger**: Clic en "Login" con un email no vacío que no cumple el patrón `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- **Behavior**: No se inicia sesión; error bajo el campo email.
- **Error message**: "Please enter a valid email address."
- **Notes**: Valores probados y rechazados: `abc`, `abc@x`, `a b@x.com`. No hay validación HTML5 nativa activa (sin `required`, el botón no está en un `<form>`).

### RN-AUTH-005: Longitud mínima de contraseña

- **Type**: Validation
- **Trigger**: Clic en "Login" con email válido y contraseña recortada de menos de 4 caracteres.
- **Behavior**: No se inicia sesión; error bajo el campo contraseña.
- **Error message**: "Password must be at least 4 characters long."
- **Notes**: La longitud se mide después del `trim` (" ab " cuenta 2 caracteres). No se observó longitud máxima.

### RN-AUTH-006: Credenciales aceptadas

- **Type**: Access Control
- **Trigger**: Clic en "Login" superadas las validaciones de formato.
- **Behavior**: El login es exitoso si (a) email y contraseña coinciden con la cuenta demo publicada en la página, o (b) existe en `localStorage.users` un registro con el mismo email y contraseña. La comparación es exacta y distingue mayúsculas y minúsculas.
- **Notes**: `DEMO@DEMO.COM` con la contraseña correcta es rechazado (ANOM-AUTH-07). Credenciales de la cuenta demo: variables `QA_USER_EMAIL` / `QA_USER_PASSWORD`.

### RN-AUTH-007: Credenciales inválidas con mensaje genérico

- **Type**: Validation
- **Trigger**: Email y contraseña con formato válido que no corresponden a ninguna cuenta (contraseña incorrecta o email inexistente).
- **Behavior**: Se permanece en `/index.php`; se muestra un mensaje genérico que no revela cuál de los dos datos es incorrecto. No se crea `isLoggedIn`.
- **Error message**: "Invalid email or password!"

### RN-AUTH-008: Recorte de espacios en las credenciales

- **Type**: Validation
- **Trigger**: Clic en "Login".
- **Behavior**: Email y contraseña se recortan (espacios al inicio y al final) antes de validar y comparar. Credenciales válidas rodeadas de espacios inician sesión correctamente.

### RN-AUTH-009: Limpieza de errores al escribir

- **Type**: Validation
- **Trigger**: Evento `input` en el campo email o contraseña mientras hay un error visible.
- **Behavior**: Se ocultan todos los mensajes de error (email, contraseña y general).

### RN-AUTH-010: Remember me

- **Type**: State Machine
- **Trigger**: Clic en "Login" (cualquier resultado) y carga de `index.php`.
- **Behavior**: Al hacer clic en "Login", si el checkbox está marcado se guarda el email recortado en `localStorage.rememberedEmail`; si está desmarcado se elimina esa clave. Al cargar `index.php`, si existe `rememberedEmail`, se precarga el email y el checkbox aparece marcado. La contraseña nunca se precarga.
- **Notes**: El email se guarda incluso si el login falla (ANOM-AUTH-05). El email recordado sobrevive al logout.

### RN-AUTH-011: Mostrar/ocultar contraseña

- **Type**: State Machine
- **Trigger**: Clic en `login-password-toggle`.
- **Behavior**: Alterna el `type` del campo entre `password` y `text`; el `title`/`aria-label` del botón alterna entre "Show password" y "Hide password" y el icono entre ojo y ojo tachado.

### RN-AUTH-012: Autocompletar credenciales demo

- **Type**: State Machine
- **Trigger**: Clic en "Autofill demo credentials".
- **Behavior**: Reemplaza el contenido de email y contraseña por las credenciales de la cuenta demo y oculta los errores visibles. No envía el formulario.

### RN-AUTH-013: Usuarios registrados dependen de `localStorage.users`

- **Type**: Dependency
- **Depends on**: Registro de usuarios en `register.php` (fuera del alcance de los módulos AUTH/CAT/CART), que persiste en `localStorage.users` del mismo origen y navegador.
- **Scoping field**: Origen y perfil de navegador (`localStorage` no se comparte entre navegadores ni contextos).
- **Upstream validity condition**: Un registro cuenta si su `email` y `password` coinciden exactamente (tras `trim` de la entrada) con lo ingresado. `register.php` rechaza registrar el email de la cuenta demo y emails duplicados.
- **Real endpoint observed**: Ninguno (no hay red); lectura de `localStorage.getItem("users")` en el clic de "Login".
- **Values tried**: (1) cuenta demo: acceso concedido; (2) usuario sembrado en `localStorage.users` con contraseña correcta: acceso concedido; (3) el mismo usuario con contraseña incorrecta: "Invalid email or password!".
- **Notes**: Las contraseñas se almacenan en texto plano (ANOM-AUTH-03).
