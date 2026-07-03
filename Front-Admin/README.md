# 🛠️ Front-Admin

Panel de administración de CineFlow para gestionar películas, funciones y contenido de la cartelera.

## Funcionalidades principales (a confirmar / completar)

- Listado y gestión de películas (crear, editar, ocultar/mostrar, eliminar)
- Carga de imágenes/banners de películas
- Gestión de funciones (horarios, salas, precios)
- Gestión de salas
- (Opcional) Gestión de promociones y confitería
- (Opcional) Visualización de reservas/ventas

> ✏️ Completar esta sección con las pantallas reales implementadas en este proyecto.

## Comunicación con el backend

Se comunica con los microservicios (principalmente `CineFlow-Cartelera`) a través del **BFF** o directamente del **Gateway**, según cómo esté configurado el cliente HTTP de este proyecto.

## Tecnologías

- React
- CSS

## Ejecución

```bash
npm install
npm start
```

## Variables de entorno relevantes

Copia `.env.example` a `.env` (⚠️ no subir el `.env` real con credenciales):

```
REACT_APP_API_URL=
```

(ajustar nombre real de la variable según configuración del proyecto)
