# 🎟️ CineFlow-Entradas

Microservicio responsable de la reserva, venta y disponibilidad de tickets (entradas) para las funciones de cine. Es la fuente de verdad sobre el estado de cada asiento por función.

## Responsabilidades

- Consultar disponibilidad de asientos para una función (`/entradas/disponibilidad`)
- Reservar temporalmente asientos antes del pago (`/entradas/reservar`)
- Procesar el pago y confirmar la compra (`/entradas/pagar`)
- Generar y entregar códigos QR de las entradas compradas
- Publicar eventos de dominio (`Ticket.Reserved`, `Ticket.Paid`) a través de un bus de eventos
- Gestionar entradas de regalo por cumpleaños

## Modelo de datos

Tabla principal: **`tickets`**

| Campo | Descripción |
|---|---|
| `id` | Identificador del ticket |
| `clave_funcion` | Clave que identifica la función (formato `FUNCION-{idFuncion}` o clave personalizada) |
| `numero_asiento` | Asiento asociado (ej. `D8`) |
| `estado` | `DISPONIBLE`, `BLOQUEADO`, `RESERVADO`, `VENDIDO` |
| `codigo_qr` | Código QR generado al confirmar el pago |
| `email_comprador` | Email del comprador |
| `precio` | Precio del ticket |
| `descuento_aplicado` | Descuento aplicado, si corresponde |
| `fecha_compra` | Fecha/hora de confirmación de pago |

> ⚠️ **Importante**: la `clave_funcion` debe generarse de forma consistente en todos los endpoints (`disponibilidad`, `reservar`, `pagar`). Actualmente se resuelve con `resolverClaveFuncion(claveFuncion, idFuncion, numeroPelicula)`, que por defecto usa el formato `FUNCION-{idFuncion}` si no se envía una `claveFuncion` explícita. Los consumidores deben usar siempre el mismo identificador (preferentemente `idFuncion`) para evitar inconsistencias entre lo que se reserva/vende y lo que se consulta como disponible.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/entradas/disponibilidad` | Devuelve los asientos no disponibles para una función (`claveFuncion`, `idFuncion` o `numeroPelicula`) |
| `PATCH` | `/api/entradas/reservar` | Bloquea temporalmente los asientos seleccionados |
| `POST` | `/api/entradas/pagar` | Confirma la compra, marca tickets como `VENDIDO` y genera QR |
| `GET` | `/api/entradas/{id}/codigoqr` | Obtiene el código QR de una entrada |
| `POST` | `/api/entradas/reclamar-cumpleanos` | Genera entradas gratis de cumpleaños para un usuario |

## Estados de un ticket

```
DISPONIBLE → BLOQUEADO → VENDIDO
                 ↓
             (liberado / expirado)
```

> Actualmente los asientos `BLOQUEADO` no cuentan con expiración automática (`tiempoExpiracion: 0`). Se recomienda implementar un proceso de limpieza/expiración para evitar asientos bloqueados indefinidamente por pagos abandonados.

## Tecnologías

- Java / Spring Boot
- Spring Data JPA
- MySQL (`entradas`)
- Eventos de dominio vía `EventBusService`

## Ejecución

```bash
mvn spring-boot:run
```

Requiere la base de datos `entradas` creada y accesible según la configuración de `application.properties` / variables de entorno.

## Variables de entorno relevantes

Copia `.env.example` a `.env` (o configura `application.properties`) con al menos:

```
DB_URL=
DB_USER=
DB_PASSWORD=
```
