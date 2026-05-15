# Uso general y guía rápida de despliegue

Requisitos previos:
- Java 17
- Maven
- Node.js + npm (para frontend)
- MySQL local o contenedor
- RabbitMQ (se recomienda levantar con Docker Compose)

Arranque mínimo recomendado (local):
1. Levantar RabbitMQ (usando docker-compose): docker compose up -d rabbitmq
2. Levantar microservicios en el orden sugerido: Usuarios -> Cartelera -> Confitería -> Entradas -> Gateway
   - Para cada microservicio: `cd <servicio> && mvn spring-boot:run`
3. Levantar frontend: `cd front_user && npm install && npm start`

Verificación rápida:
- Gateway en http://localhost:8080
- Swagger UI de microservicios en los puertos 8081..8084 según README de cada servicio
