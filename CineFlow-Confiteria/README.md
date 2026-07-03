# 🍿 CineFlow-Confiteria

Microservicio responsable del catálogo de snacks/combos, promociones y órdenes de confitería asociadas a una compra.

## Responsabilidades

- Exponer el catálogo de ítems de confitería disponibles
- Exponer promociones activas
- Registrar órdenes de confitería (asociadas o no a una compra de entradas)

## Endpoints principales (consumidos desde `front_user`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/confiteria/items` | Lista de snacks/combos disponibles (nombre, descripción, precio) |
| `GET` | `/confiteria/promotions` | Lista de promociones activas |
| `POST` | `/confiteria/ordenar` | Crea una orden de confitería |

### Payload esperado en `/confiteria/ordenar`

```json
{
  "comboId": 1,
  "cantidad": 2,
  "idUsuario": 123,
  "observaciones": "Sin hielo"
}
```

> El frontend (`front_user`) actualmente mapea IDs de snacks internos a `comboId` mediante una tabla de mapeo manual (`mapSnackToComboId`). Revisar si conviene exponer directamente el `comboId` desde este microservicio para evitar mantener ese mapeo duplicado en el frontend.

## Modelo de datos (sugerido / a confirmar)

- **`items`** — snacks/combos: `id`, `nombre`, `descripcion`, `precio`, `emoji`
- **`promotions`** — promociones: `id`, `title`, `description`, `discount`, `emoji`
- **`ordenes`** — órdenes generadas: `comboId`, `cantidad`, `idUsuario`, `observaciones`, `precioTotal`

## Tecnologías

- Java / Spring Boot
- MySQL (`confiteria`)

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
