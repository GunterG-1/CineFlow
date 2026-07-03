# 🎥 CineFlow-Cartelera

Microservicio responsable del catálogo de películas, funciones, salas y butacas.

## Responsabilidades

- CRUD de películas (crear, listar, actualizar, ocultar/mostrar, eliminar)
- Gestión de funciones (horarios de proyección) por película
- Gestión de salas (tipo, capacidad, precio base)
- Gestión de butacas por función (reservar / liberar / sembrar butacas)
- Carga de archivos multimedia (imágenes, banners) asociados a películas

## Modelo de datos

Tablas principales:

- **`peliculas`** — catálogo de películas
- **`funciones`** — funciones (horario, sala, película asociada)
- **`salas`** — salas del cine (tipo, precio base)
- **`asientos`** — butacas por función, con columnas `estado` (`AVAILABLE`, `RESERVED`, `SOLD`), `fila`, `numero`, `function_id`

> ⚠️ **Nota de arquitectura**: este microservicio mantiene su propio modelo de butacas (`asientos`, por `fila`/`numero`/`function_id`), independiente del modelo de tickets del microservicio **CineFlow-Entradas** (que usa `clave_funcion`/`numero_asiento`). Actualmente **no están sincronizados automáticamente** — evaluar si conviene unificar ambos modelos o mantener un mecanismo de sincronización entre ellos.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/cartelera/peliculas/cartelera` | Películas visibles en cartelera |
| `GET` | `/api/cartelera/peliculas` | Todas las películas (visibles y ocultas) |
| `GET` | `/api/cartelera/peliculas/{id}` | Detalle de una película |
| `POST` | `/api/cartelera/peliculas` | Crear película |
| `PUT` | `/api/cartelera/peliculas/{id}` | Actualizar película |
| `DELETE` | `/api/cartelera/peliculas/{id}` | Eliminar película |
| `PATCH` | `/api/cartelera/peliculas/{id}/visibility` | Alternar visibilidad |
| `POST` | `/api/cartelera/media` | Subir imagen/banner |
| `GET` | `/api/cartelera/funciones` | Listar todas las funciones |
| `GET` | `/api/cartelera/funciones/{id}` | Detalle de una función (incluye precio y sala) |
| `POST` | `/api/cartelera/funciones` | Crear función |
| `GET` | `/api/cartelera/peliculas/{movieId}/funciones` | Funciones de una película |
| `GET` | `/api/cartelera/funciones/{id}/butacas` | Disponibilidad de butacas de una función |
| `POST` | `/api/cartelera/funciones/{id}/butacas/reserve` | Reservar una butaca |
| `POST` | `/api/cartelera/funciones/{id}/butacas/release` | Liberar una butaca |
| `POST` | `/api/cartelera/funciones/{id}/butacas/seed` | Generar butacas para funciones creadas antes del fix (idempotente) |
| `GET` | `/api/cartelera/salas` | Listar salas |

## Tecnologías

- Java / Spring Boot
- Spring Data JPA
- MySQL (`cartelera`)

## Ejecución

```bash
mvn spring-boot:run
```

## Variables de entorno relevantes

```
DB_URL=
DB_USER=
DB_PASSWORD=
```
