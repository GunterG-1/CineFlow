# CineFlow - Entradas (Microservicio)

Descripción
-----------
Microservicio encargado de reservas, pago y generación de tickets (códigos QR).

Ejecutar localmente
-------------------
Requisitos: Java 17, Maven, MySQL y RabbitMQ locales.

```bash
cd CineFlow-Entradas
./mvnw spring-boot:run
```

Propiedades principales
- Puerto: `8084` (ver `src/main/resources/application.properties`).
- Base de datos: `spring.datasource.url` (MySQL).
- RabbitMQ: `spring.rabbitmq.*`.

Documentación API
- Swagger UI: `http://localhost:8084/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8084/v3/api-docs`

Tests
-----
```bash
./mvnw test
```

Notas
-----
- Usa eventos RabbitMQ (`Ticket.Paid`, `Ticket.Reserved`).
- Configuración de email en `application.properties`.
# CineFlow-Entradas

Microservicio responsable de la gestión de venta de entradas y pedidos.

Ejecutar:

```
cd CineFlow-Entradas
./mvnw spring-boot:run
```

Antes de arrancar el servicio, asegúrate de tener RabbitMQ activo. Desde la raíz del proyecto puedes levantarlo con:

```
docker compose up -d rabbitmq
```

Construir:

```
./mvnw clean package
```
# CineFlow-Entradas