# 👤 CineFlow-Usuarios

Microservicio responsable de la autenticación y gestión de perfiles de usuario.

## Responsabilidades

- Registro e inicio de sesión de usuarios
- Gestión de perfil (nombre, apellido, email, método de pago guardado, etc.)
- Emisión/validación de credenciales usadas por el resto de los microservicios (vía JWT)

## Endpoints principales (a confirmar / completar según implementación real)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/usuarios/registro` | Registrar nuevo usuario |
| `POST` | `/usuarios/login` | Iniciar sesión |
| `GET` | `/usuarios/perfil` | Obtener perfil del usuario autenticado |
| `PUT` | `/usuarios/perfil` | Actualizar perfil (ej. método de pago) |

> ✏️ Completar esta tabla con los endpoints reales del controller de este microservicio.

## Datos de perfil usados por otros servicios

Desde el frontend (`front_user`), el perfil de usuario expone al menos:

- `idUsuario`
- `nombreUsuario`, `apellidoUsuario`
- `email` / `correo`
- `metodoPago`

Estos campos son consumidos por `CineFlow-Entradas` al confirmar una compra (email del comprador) y por el BFF al actualizar el método de pago tras una compra.

## Tecnologías

- Java / Spring Boot
- MySQL (`usuarios`)
- JWT para autenticación

## Ejecución

```bash
mvn spring-boot:run
```

## Variables de entorno relevantes

```
DB_URL=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```
