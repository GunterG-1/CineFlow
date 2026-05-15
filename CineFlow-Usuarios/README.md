# CineFlow - Usuarios (Microservicio)

Descripción
-----------
Registro, autenticación y gestión de perfiles de usuarios.

Ejecutar localmente
-------------------
Requisitos: Java 17, Maven y MySQL.

```bash
cd CineFlow-Usuarios
./mvnw spring-boot:run
```

Propiedades
- Puerto: `8081`.
- Endpoints importantes: actualización de perfil `PUT /usuarios/{id}/actualizar`.

Tests
-----
```bash
./mvnw test
```
# CineFlow-Usuarios

Microservicio de gestión de usuarios y autenticación.

Ejecutar:

```
cd CineFlow-Usuarios
./mvnw spring-boot:run
```

Construir:

```
./mvnw clean package
```
# CineFlow-Usuarios

Microservicio de usuarios de CineFlow construido con Spring Boot, JPA, MySQL, Lombok y Bean Validation.

## Resumen

Este servicio administra usuarios del sistema y expone endpoints para:

- registrar usuarios
- iniciar sesión
- consultar usuarios por id o correo
- obtener perfil sin exponer contraseña
- actualizar usuarios
- eliminar usuarios
- verificar si un correo ya existe

## Tecnologías usadas

- Java 17
- Spring Boot 3.5.13
- Spring Web
- Spring Data JPA
- Spring Validation
- Lombok
- MySQL Connector

## Requisitos

- Java 17 instalado
- Maven instalado
- MySQL 8 o Laragon con MySQL activo
- Postman, Insomnia o cURL para probar endpoints

## Configuración de base de datos

El proyecto se conecta a una base de datos llamada `usuarios`.

Crear la base de datos:

```sql
CREATE DATABASE usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configuración actual en `src/main/resources/application.properties`:

- host: `localhost`
- puerto: `3306`
- base de datos: `usuarios`
- usuario: `root`
- contraseña: vacía
- puerto de la aplicación: `8081`

Si usas otra configuración local, ajusta ese archivo antes de iniciar la app.

## Ejecutar el proyecto

Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

Si quieres compilar antes de ejecutar:

```bash
mvn clean compile
```

Para correr las pruebas:

```bash
mvn test
```

## Estructura del proyecto

- `src/main/java/com/backend/CineFlow/CineFlow/CineFlowApplication.java` -> clase principal
- `src/main/java/com/backend/CineFlow/CineFlow/model/Usuario.java` -> entidad JPA
- `src/main/java/com/backend/CineFlow/CineFlow/repository/UsuarioRepository.java` -> acceso a datos
- `src/main/java/com/backend/CineFlow/CineFlow/service/UsuarioService.java` -> lógica de negocio
- `src/main/java/com/backend/CineFlow/CineFlow/controller/UsuarioController.java` -> endpoints REST
- `src/main/java/com/backend/CineFlow/CineFlow/dto/` -> objetos para login y perfil
- `src/test/java/com/backend/CineFlow/CineFlow/CineFlowApplicationTests.java` -> prueba de contexto

## Modelo de usuario

La entidad `Usuario` maneja estos campos:

- `idUsuario`
- `nombreUsuario`
- `apellidoUsuario`
- `correo`
- `contrasena`
- `fechaNacimiento`
- `metodoPago`

## Endpoints

Base URL:

```bash
http://localhost:8081/api/usuarios
```

### 1. Obtener todos los usuarios

**GET** `/api/usuarios`

Ejemplo de respuesta:

```json
[
  {
    "idUsuario": 1,
    "nombreUsuario": "Juan",
    "apellidoUsuario": "Pérez",
    "correo": "juan.perez@example.com",
    "contrasena": "123456",
    "fechaNacimiento": "1990-05-15",
    "metodoPago": "tarjeta"
  }
]
```

### 2. Obtener usuario por ID

**GET** `/api/usuarios/{id}`

Ejemplo:

```bash
http://localhost:8080/api/usuarios/1
```

### 3. Obtener usuario por correo

**GET** `/api/usuarios/correo/{correo}`

Ejemplo:

```bash
http://localhost:8080/api/usuarios/correo/juan.perez@example.com
```

### 4. Registrar usuario

**POST** `/api/usuarios/registrar`

Body JSON:

```json
{
  "nombreUsuario": "Juan",
  "apellidoUsuario": "Pérez",
  "correo": "juan.perez@example.com",
  "contrasena": "MiPassword123!",
  "fechaNacimiento": "1990-05-15",
  "metodoPago": "tarjeta"
}
```

Respuesta esperada:

```json
{
  "idUsuario": 1,
  "nombreUsuario": "Juan",
  "apellidoUsuario": "Pérez",
  "correo": "juan.perez@example.com",
  "fechaNacimiento": "1990-05-15",
  "metodoPago": "tarjeta"
}
```

### 5. Iniciar sesión

**POST** `/api/usuarios/login`

Body JSON:

```json
{
  "correo": "juan.perez@example.com",
  "contrasena": "MiPassword123!"
}
```

Respuesta exitosa:

```json
{
  "iniciadoSesion": true,
  "mensaje": "Login exitoso",
  "usuario": {
    "idUsuario": 1,
    "nombreUsuario": "Juan",
    "apellidoUsuario": "Pérez",
    "correo": "juan.perez@example.com",
    "fechaNacimiento": "1990-05-15",
    "metodoPago": "tarjeta"
  }
}
```

Respuesta fallida:

```json
{
  "iniciadoSesion": false,
  "mensaje": "Credenciales invalidas",
  "usuario": null
}
```

### 6. Obtener perfil por correo

**GET** `/api/usuarios/perfil?correo={correo}`

Ejemplo:

```bash
http://localhost:8080/api/usuarios/perfil?correo=juan.perez@example.com
```

### 7. Actualizar usuario

**PUT** `/api/usuarios/{id}`

Body JSON:

```json
{
  "nombreUsuario": "Juan",
  "apellidoUsuario": "Pérez",
  "correo": "juan.perez@example.com",
  "contrasena": "NuevaPassword123!",
  "fechaNacimiento": "1990-05-15",
  "metodoPago": "paypal"
}
```

### 8. Eliminar usuario

**DELETE** `/api/usuarios/{id}`

Ejemplo:

```bash
http://localhost:8080/api/usuarios/1
```

### 9. Verificar si existe un correo

**GET** `/api/usuarios/existe-correo/{correo}`

Ejemplo:

```bash
http://localhost:8080/api/usuarios/existe-correo/juan.perez@example.com
```

Respuesta:

```json
true
```

## Ejemplos rápidos con cURL

Registrar usuario:

```bash
curl -X POST http://localhost:8080/api/usuarios/registrar ^
  -H "Content-Type: application/json" ^
  -d "{\"nombreUsuario\":\"Juan\",\"apellidoUsuario\":\"Pérez\",\"correo\":\"juan.perez@example.com\",\"contrasena\":\"MiPassword123!\",\"fechaNacimiento\":\"1990-05-15\",\"metodoPago\":\"tarjeta\"}"
```

Iniciar sesión:

```bash
curl -X POST http://localhost:8080/api/usuarios/login ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"juan.perez@example.com\",\"contrasena\":\"MiPassword123!\"}"
```

## Notas importantes

- La entidad `Usuario` usa validaciones con `jakarta.validation`.
- El login actual valida correo y contraseña contra la base de datos.
- El proyecto está preparado para trabajar con MySQL en entorno local.
- Si cambias el puerto o credenciales, actualiza `application.properties`.