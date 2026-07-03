# 🚪 CineFlow-Gateway

Punto de entrada único que enruta las peticiones del `CineFlow-BFF` hacia los microservicios de dominio (`Cartelera`, `Entradas`, `Confiteria`, `Usuarios`).

## Responsabilidades

- Enrutar peticiones HTTP hacia el microservicio correspondiente según el path (`/api/entradas/**`, `/api/cartelera/**`, `/api/confiteria/**`, `/api/usuarios/**`)
- Centralizar configuración de red entre servicios (host/puerto de cada microservicio)
- (Opcional, a confirmar) Aplicar políticas transversales: rate limiting, logging centralizado, CORS

## Rutas conocidas enrutadas

| Prefijo | Microservicio destino |
|---|---|
| `/api/entradas/**` | CineFlow-Entradas |
| `/api/cartelera/**` | CineFlow-Cartelera |
| `/api/confiteria/**` | CineFlow-Confiteria |
| `/api/usuarios/**` | CineFlow-Usuarios |

> ✏️ Completar con la configuración real de rutas/proxy del Gateway (ej. `application.yml` de Spring Cloud Gateway, o configuración equivalente).

## Tecnologías

- Java / Spring (Spring Cloud Gateway o equivalente — confirmar)

## Ejecución

```bash
mvn spring-boot:run
```

## Variables de entorno relevantes

```
CARTELERA_SERVICE_URL=
ENTRADAS_SERVICE_URL=
CONFITERIA_SERVICE_URL=
USUARIOS_SERVICE_URL=
```
