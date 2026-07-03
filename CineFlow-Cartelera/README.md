# CineFlow - Cartelera (Microservicio)

Descripción
-----------
Gestiona películas, funciones y butacas. Provee endpoints para consultar cartelera y disponibilidad.

Ejecutar localmente
-------------------
Requisitos: Java 17, Maven y MySQL.

```bash
cd CineFlow-Cartelera
./mvnw spring-boot:run
```

Propiedades
- Puerto: `8082`.
- Swagger UI: `http://localhost:8082/swagger-ui.html`

Tests
-----
```bash
./mvnw test
```
# CineFlow-Cartelera

Microservicio de cartelera: contiene entidades, repositorios y endpoints para películas, salas y funciones.

Ejecutar:

```
cd CineFlow-Cartelera
./mvnw spring-boot:run
```

Construir:

```
./mvnw clean package
```

Notas:

- Configuración en `src/main/resources/application.properties`.
- Contiene inicializador de datos: `DataInitializer`.
# MS-Cartelera (CineFlow)

> Microservicio `MS-Cartelera` para gestionar catálogo de películas, salas, funciones y butacas.

## Resumen
- Lenguaje: Java 17
- Framework: Spring Boot 3.5.x
- Persistencia: JPA (configurado para MySQL por defecto)
- Lombok: usado en modelos

## Requisitos
- Java 17
- Maven
- MySQL en `localhost:3306` (o actualizar en configuración)

## Archivos relevantes
- Configuración de aplicación: [src/main/resources/application.properties](src/main/resources/application.properties)
- Controlador REST principal: [src/main/java/com/backend/CineFlow/CineFlow/cartelera/controller/CatalogController.java](src/main/java/com/backend/CineFlow/CineFlow/cartelera/controller/CatalogController.java)
- DTOs: [src/main/java/com/backend/CineFlow/CineFlow/cartelera/dto](src/main/java/com/backend/CineFlow/CineFlow/cartelera/dto)
- Modelos JPA: [src/main/java/com/backend/CineFlow/CineFlow/cartelera/model](src/main/java/com/backend/CineFlow/CineFlow/cartelera/model)

## Configurar base de datos (MySQL)
1. Iniciar MySQL y crear la BD **`cartelera`**:

```sql
CREATE DATABASE IF NOT EXISTS cartelera CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. La aplicación usa las siguientes credenciales por defecto (actualizar en `application.properties` si es necesario):
   - **Usuario:** `root`
   - **Contraseña:** (vacía)
   - **Host:** `localhost`
   - **Puerto:** `3306`
   - **BD:** `cartelera`

> Nota: la propiedad `spring.jpa.hibernate.ddl-auto=create-drop` crea las tablas automáticamente (ideal para desarrollo).

## Ejecutar

```bash
mvn spring-boot:run
```

o compilar sin tests:

```bash
mvn -DskipTests compile
```

## Endpoints (paths en español)

- `GET /peliculas/cartelera` — Obtener cartelera de películas
- `GET /funciones/{id}/butacas` — Obtener butacas y estado de una función
- `POST /funciones` — Crear una nueva función

### Ejemplos POST /funciones (JSON)

2D:

```json
{
  "idPelicula": 1,
  "idSala": 1,
  "formato": "TWO_D",
  "fechaInicio": "2026-05-01T19:30:00",
  "precio": 9.50
}
```

3D:

```json
{
  "idPelicula": 2,
  "idSala": 2,
  "formato": "THREE_D",
  "fechaInicio": "2026-05-02T21:00:00",
  "precio": 14.00
}
```

### Curl de ejemplo

```bash
curl -X POST http://localhost:8080/funciones \
  -H "Content-Type: application/json" \
  -d '{"idPelicula":1,"idSala":1,"formato":"TWO_D","fechaInicio":"2026-05-01T19:30:00","precio":9.50}'
```

## Formatos y localización
- Los campos de las respuestas y peticiones están en español (`titulo`, `descripcion`, `genero`, `duracionMinutos`, `calificacion`, `idPelicula`, `idSala`, `fechaInicio`, `precio`, `butacas`, etc.).
- Los `precio` en respuestas se serializan en formato chileno (puntos como separador de miles y coma para decimales), p.ej. `"9,50"`.
- Las fechas (`fechaInicio`) se serializan en zona horaria de Chile (`America/Santiago`, UTC-4) usando el formato `yyyy-MM-dd'T'HH:mm:ss`.

## Notas adicionales
- Seeder de datos: [src/main/java/com/backend/CineFlow/CineFlow/cartelera/service/CatalogDataSeeder.java](src/main/java/com/backend/CineFlow/CineFlow/cartelera/service/CatalogDataSeeder.java) crea datos de ejemplo al iniciar si la base está vacía.
- Si quieres cambiar a H2 para pruebas rápidas, restaura la dependencia H2 en `pom.xml` y actualiza `application.properties` (originalmente venía con H2 en memoria).

Si quieres que añada instrucciones para Docker, Postman collection o tests automáticos, dímelo y lo preparo.
