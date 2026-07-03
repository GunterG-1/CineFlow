# CineFlow BFF - Backend for Frontend

Servidor BFF (Backend for Frontend) construido con Node.js y Express para la aplicación CineFlow.

## 📋 Características

- ✅ Express.js para gestión de rutas
- ✅ CORS habilitado para comunicación frontend
- ✅ Validación de datos con Joi
- ✅ Manejo centralizado de errores
- ✅ Logger personalizado
- ✅ Middleware de validación
- ✅ Cliente HTTP con Axios
- ✅ JWT para autenticación (listo para implementar)
- ✅ Estructura modular y escalable

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- npm 

### Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Edita .env con tus valores
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Verificar que está funcionando
```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-06-02T10:00:00.000Z",
  "uptime": 1.234
}
```

## 📁 Estructura del Proyecto

```
CineFlow-BFF/
├── config/              # Configuraciones (DB, logger, etc)
│   ├── database.js      # Configuración de base de datos
│   └── logger.js        # Sistema de logging
├── src/
│   ├── controllers/     # Lógica de controladores
│   ├── middleware/      # Middlewares personalizados
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/          # Definición de rutas
│   │   ├── index.js
│   │   └── health.js
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   │   └── http.js      # Cliente HTTP
│   └── server.js        # Punto de entrada
├── .env                 # Variables de entorno (gitignored)
├── .env.example         # Plantilla de variables
├── .gitignore           # Archivos ignorados por git
├── package.json         # Dependencias del proyecto
└── README.md            # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Pruebas
npm test

# Linting
npm run lint
```

## 📦 Dependencias Principales

- **Express**: Framework web
- **CORS**: Manejo de CORS
- **Dotenv**: Variables de entorno
- **Axios**: Cliente HTTP
- **Joi**: Validación de datos
- **JSONWebToken**: Autenticación JWT
- **bcryptjs**: Hash de contraseñas

## 🛠️ Próximos Pasos

### 1. Conectar Base de Datos
Edita `config/database.js` con tu librería preferida:
- PostgreSQL (con `pg` o `prisma`)
- MongoDB (con `mongoose`)
- MySQL (con `mysql2`)

### 2. Agregar Rutas
Crea nuevas rutas en `src/routes/`:

```javascript
// src/routes/movies.js
import express from 'express';
import { getMovies, createMovie } from '../controllers/moviesController.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();
const schema = Joi.object({ /* ... */ });

router.get('/', getMovies);
router.post('/', validateRequest(schema), createMovie);

export default router;
```

### 3. Agregar Controladores
Crea controladores en `src/controllers/`:

```javascript
export const getMovies = async (req, res, next) => {
  try {
    // Lógica aquí
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
```

### 4. Agregar Servicios
Crea servicios en `src/services/` para lógica de negocio.

## 🔐 Seguridad

- CORS configurado
- Validación de entrada con Joi
- Manejo de errores centralizado
- Variables sensibles en `.env`
- JWT ready (requiere implementación)

## 📝 Notas

- Reemplaza los valores en `.env` antes de desplegar
- Implementa la conexión real a base de datos
- Agrega autenticación JWT donde sea necesario
- Configura CORS_ORIGIN con tu frontend

## 📄 Licencia

ISC

## 🤝 Contribución

Para agregar features, sigue la estructura establecida y mantén la consistencia con el patrón MVC.
