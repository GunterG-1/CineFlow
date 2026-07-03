# CineFlow - Confitería (Microservicio)

Descripción
-----------
Servicio que administra combos, pedidos de confitería y verificación de tickets.

Ejecutar localmente
-------------------
Requisitos: Java 17, Maven, MySQL y RabbitMQ.

```bash
cd CineFlow-Confiteria
./mvnw spring-boot:run
```

Propiedades
- Puerto: `8083`.
- Base de datos: configurar en `src/main/resources/application.properties`.

Documentación API
- Swagger UI: `http://localhost:8083/swagger-ui.html`

Tests
-----
```bash
./mvnw test
```

Notas
-----
- Inicializa datos de combos en el arranque si la BD está vacía.
- Consume eventos `Ticket.Paid` para actualizar pedidos.
# CineFlow-Confiteria

Microservicio para gestión de productos de confitería (snacks, promociones).

Ejecutar:

```
cd CineFlow-Confiteria
./mvnw spring-boot:run
```

Construir:

```
./mvnw clean package
```
# CineFlow Confiteria

Microservicio de confiteria para CineFlow, construido con Spring Boot, JPA y MySQL.

## 1) Que hace este microservicio

- Gestiona menu de combos y su disponibilidad.
- Crea pedidos con ticket unico.
- Permite consultar pedidos por id, usuario y estado.
- Permite actualizar estado del pedido y verificar tickets.
- Incluye carga inicial de datos (alimentos y combos) al iniciar por primera vez.

## 2) Stack tecnico

- Java 17
- Spring Boot 3.5.13
- Spring Data JPA
- MySQL 8
- ModelMapper
- Maven

## 3) Estructura del proyecto

- Controlador REST: src/main/java/com/backend/CineFlow/CineFlow/controller/ConfiiteroControlador.java
- Servicio de negocio: src/main/java/com/backend/CineFlow/CineFlow/service/ConfiiteroServicio.java
- Entidades: src/main/java/com/backend/CineFlow/CineFlow/model
- DTOs: src/main/java/com/backend/CineFlow/CineFlow/dto
- Repositorios: src/main/java/com/backend/CineFlow/CineFlow/repository
- Carga de datos: src/main/java/com/backend/CineFlow/CineFlow/configuracion/DataInitializer.java
- Configuracion general: src/main/resources/application.properties

## 4) Requisitos para correrlo

- JDK 17 instalado.
- Maven (o usar mvnw/mvnw.cmd incluidos).
- MySQL corriendo y base de datos confiteria creada.

Ejemplo rapido para crear la base:

CREATE DATABASE confiteria;

## 5) Configuracion local

En application.properties se usa por defecto:

- Puerto: 8084
- URL MySQL: jdbc:mysql://localhost:3306/confiteria
- Usuario: root
- Password: vacio

Si necesitas otro usuario o password, actualiza:

- spring.datasource.username
- spring.datasource.password

## 6) Ejecutar el servicio

Compilar:

mvn -DskipTests clean compile

Ejecutar:

mvn spring-boot:run

Health check:

GET http://localhost:8084/api/productos/servicio

## 7) Endpoints principales

Base URL: http://localhost:8084/api/productos

- GET /menu
- GET /menu/disponibles
- GET /menu/{id}
- POST /ordenar
- GET /order/{id}
- PATCH /order/{id}/estado?estado=EN_PREPARACION
- POST /verificar?numeroTicket=...
- GET /order/usuario/{idUsuario}
- GET /order/estado/{estado}
- DELETE /order/{id}

Estados validos de pedido:

- PENDIENTE
- CONFIRMADO
- EN_PREPARACION
- LISTO
- ENTREGADO
- CANCELADO

## 8) Ejemplo rapido de uso

1. Consultar menu:
GET http://localhost:8084/api/productos/menu

2. Crear pedido:
POST http://localhost:8084/api/productos/ordenar

Body JSON sugerido:

{
	"idUsuario": 10,
	"comboId": 1,
	"cantidad": 2,
	"observaciones": "Sin hielo"
}

3. Consultar pedido:
GET http://localhost:8084/api/productos/order/1

4. Actualizar estado:
PATCH http://localhost:8084/api/productos/order/1/estado?estado=LISTO

5. Verificar ticket:
POST http://localhost:8084/api/productos/verificar?numeroTicket=TKT-... 

## 9) Guia breve: arquetipos para generar nuevos proyectos

Esta guia muestra dos caminos rapidos:

### Opcion A: usar un arquetipo Maven existente

Ejemplo con quickstart:

mvn archetype:generate -DgroupId=com.tuempresa.demo -DartifactId=mi-servicio -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

Resultado: crea un proyecto Java base listo para personalizar.

### Opcion B: crear un arquetipo desde este microservicio (recomendado)

Si quieres reutilizar esta misma estructura de confiteria como plantilla:

1. Generar arquetipo desde el proyecto actual:

mvn archetype:create-from-project

2. Ir al arquetipo generado e instalarlo localmente:

cd target/generated-sources/archetype
mvn install

3. Crear un nuevo proyecto desde ese arquetipo local:

mvn archetype:generate -DarchetypeCatalog=local -DarchetypeGroupId=com.backend.CineFlow -DarchetypeArtifactId=CineFlow-archetype -DarchetypeVersion=0.0.1-SNAPSHOT -DgroupId=com.tuempresa.nuevo -DartifactId=nuevo-servicio -Dversion=1.0.0-SNAPSHOT -Dpackage=com.tuempresa.nuevo -DinteractiveMode=false

Resultado: tendras un nuevo proyecto basado en esta plantilla, con estructura de paquetes y convenciones similares.

## 10) Notas operativas

- La inicializacion de datos solo corre si la tabla de alimentos esta vacia.
- La creacion de pedido descuenta stock del combo.
- La cancelacion devuelve stock al combo, excepto pedidos ya entregados.