# 🎬 CineFlow

Plataforma de venta de entradas de cine con arquitectura de microservicios. Permite a los usuarios explorar la cartelera, reservar asientos, comprar entradas, pedir confitería y gestionar su perfil; incluye además un panel de administración para gestionar películas, funciones y contenido.

## 📐 Arquitectura

El proyecto está compuesto por **6 microservicios backend** y **2 aplicaciones frontend**, orquestados a través de un Gateway y un BFF (Backend For Frontend).

```
                     ┌─────────────────┐        ┌──────────────────┐
                     │   front_user     │        │   Front-Admin    │
                     │  (Cliente final) │        │ (Panel de admin) │
                     └────────┬─────────┘        └─────────┬────────┘
                              │                              │
                              ▼                              ▼
                     ┌─────────────────────────────────────────────┐
                     │              CineFlow-BFF (NestJS)           │
                     │     Backend For Frontend / capa de agregación│
                     └────────────────────┬──────────────────────--┘
                                           ▼
                     ┌─────────────────────────────────────────────┐
                     │           CineFlow-Gateway                   │
                     │        Enrutamiento hacia microservicios      │
                     └───┬───────────┬───────────┬───────────┬─────┘
                         ▼           ▼           ▼           ▼
                  ┌──────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐
                  │Cartelera │ │ Entradas  │ │Confitería│ │ Usuarios │
                  │(Spring)  │ │ (Spring)  │ │(Spring)  │ │(Spring)  │
                  └──────────┘ └───────────┘ └─────────┘ └──────────┘
```

### Servicios

| Servicio | Stack | Responsabilidad |
|---|---|---|
| **CineFlow-Gateway** | Spring / Java | Punto de entrada único hacia los microservicios backend |
| **CineFlow-BFF** | NestJS / TypeScript | Capa intermedia entre los frontends y el Gateway; adapta y agrega respuestas |
| **CineFlow-Cartelera** | Spring / Java | Gestión de películas, funciones, salas y butacas |
| **CineFlow-Entradas** | Spring / Java | Reserva y venta de tickets, disponibilidad de asientos por función, generación de códigos QR |
| **CineFlow-Confiteria** | Spring / Java | Catálogo de snacks/combos, promociones y órdenes de confitería |
| **CineFlow-Usuarios** | Spring / Java | Autenticación, perfiles y datos de usuario |
| **front_user** | React | Aplicación para el cliente final: explorar cartelera, comprar entradas, confitería |
| **Front-Admin** | React | Panel de administración para gestionar películas, funciones y contenido |

## 🚀 Requisitos previos

- **Node.js** (v18 o superior) y **npm**
- **Java 17+** y **Maven**
- **MySQL** (una base de datos por microservicio: `cartelera`, `entradas`, `confiteria`, `usuarios`)

## ⚙️ Configuración

Cada servicio maneja su propia configuración mediante variables de entorno. Ninguno de los archivos `.env` reales está incluido en este repositorio por seguridad — cada carpeta que lo requiere trae un `.env.example` como plantilla.

```bash
# Dentro de cada servicio que lo requiera:
cp .env.example .env
# luego completa los valores reales (URLs, credenciales de BD, etc.)
```

## 📦 Instalación y ejecución

### Backend (microservicios Spring)

Cada microservicio (`CineFlow-Gateway`, `CineFlow-Cartelera`, `CineFlow-Entradas`, `CineFlow-Confiteria`, `CineFlow-Usuarios`) se ejecuta de forma independiente:

```bash
cd CineFlow-<nombre-servicio>
mvn spring-boot:run
```

> Asegúrate de tener la base de datos MySQL correspondiente creada y accesible antes de levantar cada servicio.

### BFF (NestJS)

```bash
cd CineFlow-BFF
npm install
npm run start:dev
```

### Frontends (React)

```bash
cd front_user      # o Front-Admin
npm install
npm start
```

## 🗂️ Orden de arranque recomendado

1. Bases de datos MySQL (`cartelera`, `entradas`, `confiteria`, `usuarios`)
2. Microservicios backend: `Cartelera`, `Entradas`, `Confiteria`, `Usuarios`
3. `CineFlow-Gateway`
4. `CineFlow-BFF`
5. Frontends: `front_user` y/o `Front-Admin`

## 🧩 Flujo de compra (resumen)

1. El usuario selecciona película, función y agrega entradas/confitería al carrito.
2. En la pantalla de resumen de pedido, se consulta la disponibilidad de asientos para la función seleccionada.
3. El usuario elige sus asientos y confirma el método de pago.
4. Se envía la solicitud de reserva y luego de pago al microservicio de **Entradas**, que gestiona el ciclo de vida del ticket (`DISPONIBLE → BLOQUEADO → VENDIDO`) y genera el código QR de la entrada.
5. Si hay ítems de confitería, se genera una orden en el microservicio de **Confitería**.

## 🛠️ Tecnologías principales

- **Frontend:** React, CSS
- **BFF:** NestJS, TypeScript
- **Microservicios:** Java, Spring Boot
- **Base de datos:** MySQL
- **Control de versiones:** Git / GitHub

## 📁 Estructura del repositorio

```
CineFlow/
├── CineFlow-BFF/           # Backend For Frontend (NestJS)
├── CineFlow-Gateway/       # Gateway de enrutamiento
├── CineFlow-Cartelera/     # Microservicio de películas y funciones
├── CineFlow-Entradas/      # Microservicio de reservas y tickets
├── CineFlow-Confiteria/    # Microservicio de confitería
├── CineFlow-Usuarios/      # Microservicio de usuarios
├── Front-Admin/            # Panel de administración (React)
├── front_user/             # App del cliente final (React)
└── .gitignore
```

## 🤝 Contribuir

1. Crea una rama a partir de `main`: `git checkout -b feature/nombre-de-la-mejora`
2. Realiza tus cambios y haz commit
3. Sube tu rama y abre un Pull Request

## 📄 Licencia

Proyecto de uso académico/personal. Ajustar esta sección según corresponda.
