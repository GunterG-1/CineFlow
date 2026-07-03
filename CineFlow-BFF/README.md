# 🔗 CineFlow-BFF

Backend For Frontend (BFF) construido en NestJS. Actúa como capa intermedia entre los frontends (`front_user`, `Front-Admin`) y el Gateway de microservicios, adaptando y reenviando las peticiones necesarias.

## Responsabilidades

- Exponer una API unificada y adaptada a las necesidades de los frontends
- Reenviar peticiones hacia `CineFlow-Gateway`, que a su vez enruta a los microservicios correspondientes
- Manejar autenticación de las rutas protegidas (`JwtAuthGuard`)
- Adaptar/enriquecer payloads antes de reenviarlos (ej. obtener precio real de una función desde Cartelera antes de crear una reserva)

## Módulo de reservas (`entradas`)

| Método | Ruta | Autenticación | Descripción |
|---|---|---|---|
| `PATCH` | `/entradas/reservar` | JWT | Crea una reserva de asientos |
| `POST` | `/entradas/pagar` | JWT | Procesa el pago de una reserva |
| `GET` | `/entradas/disponibilidad` | — | Consulta asientos no disponibles para una función |
| `GET` | `/entradas/usuario` | JWT | Reservas del usuario autenticado |
| `GET` | `/entradas/:reservationId` | — | Detalle de una reserva |
| `GET` | `/entradas/:reservationId/codigoqr` | — | Código QR de una reserva |
| `DELETE` | `/entradas/:reservationId` | — | Cancela una reserva |
| `POST` | `/entradas/verificar-ticket` | — | Valida un ticket (ej. en boletería) |

> El BFF actúa como *pass-through* hacia el Gateway: no aplica lógica de negocio propia sobre disponibilidad o precios, solo reenvía la petición y devuelve la respuesta del microservicio correspondiente. La excepción es `createReservation`, que primero consulta el detalle de la función en Cartelera (para obtener el precio real) antes de armar el payload hacia Entradas.

## Tecnologías

- NestJS
- TypeScript
- HTTP Service interno para comunicación con el Gateway (`GATEWAY_URL`)

## Ejecución

```bash
npm install
npm run start:dev
```

## Variables de entorno relevantes

Copia `.env.example` a `.env`:

```
GATEWAY_URL=http://localhost:8080
JWT_SECRET=
```

⚠️ No subir el `.env` real con secretos al repositorio.
