# 🎬 front_user

Aplicación web para el cliente final de CineFlow: explorar la cartelera, ver horarios, agregar entradas y confitería al carrito, seleccionar asientos, pagar y ver sus pedidos/favoritos.

## Funcionalidades principales

- Home con cartelera de películas y carrusel de destacados
- Modal de horarios/funciones por película
- Carrito de compras (entradas + confitería)
- Selección visual de asientos por función, con estados **Disponible / Seleccionado / Ocupado**
- Resumen de pedido con revisión de pago, promociones y carrusel de extras (snacks)
- Registro, login y perfil de usuario (incluye método de pago guardado)
- Favoritos
- Confirmación de pedido tras el pago

## Estructura relevante

```
src/
├── api.js                     # Cliente HTTP hacia el BFF
├── contexts/
│   ├── AuthContext.jsx        # Sesión y perfil de usuario
│   ├── carritoContext.jsx     # Estado del carrito de compras
│   └── favoritosContext.jsx   # Películas favoritas
├── components/
│   ├── navbar.jsx / footer.jsx
│   ├── carousel.jsx
│   └── horariosModal.jsx
├── pages/
│   ├── homeUser.jsx
│   ├── cineFlow.jsx
│   ├── carrito.jsx
│   ├── confiteria.jsx
│   ├── promociones.jsx
│   ├── login.jsx / register.jsx / profile.jsx
│   └── pedidoConfirmado.jsx    # Resumen de pedido (selección de asientos, pago)
└── database/                  # Datos estáticos/mock (horarios, movies, promotions, snacks)
```

## Flujo de compra (resumen)

1. El usuario navega la cartelera y agrega entradas/confitería al carrito (`carritoContext`).
2. En el resumen de pedido, se consulta disponibilidad de asientos vía `GET /entradas/disponibilidad` (usando `idFuncion` de la función seleccionada).
3. El usuario selecciona sus asientos y confirma términos y condiciones.
4. Se revisa el pedido (promociones, extras, método de pago) antes de confirmar.
5. Se procesa el pago vía `PATCH /entradas/reservar` + `POST /entradas/pagar`, o `POST /confiteria/ordenar` si el pedido es solo de confitería.
6. Se navega a la pantalla de confirmación del pedido.

## Comunicación con el backend

Todas las peticiones pasan por el **BFF** (`CineFlow-BFF`), nunca directo a los microservicios. La URL base del BFF se configura vía variable de entorno.

## Tecnologías

- React
- React Router
- CSS

## Ejecución

```bash
npm install
npm start
```

## Variables de entorno relevantes

Copia `.env.example` a `.env`:

```
REACT_APP_API_URL=http://localhost:3000
```

(ajustar nombre real de la variable según cómo esté configurado `api.js`)
