# 🚀 CineFlow BFF - Inicio Rápido

Bienvenido al Backend for Frontend (BFF) de CineFlow. Esta guía te llevará a través de los pasos necesarios para ejecutar el BFF en menos de 5 minutos.

---

## ⚡ En 5 Minutos

### 1️⃣ Instalar Dependencias (1 min)

```bash
cd CineFlow-BFF
npm install
```

### 2️⃣ Configurar Variables de Entorno (1 min)

```bash
cp .env.example .env
```

Edita `.env` y asegúrate de que los puertos sean correctos:

```env
PORT=3000
USUARIOS_SERVICE_URL=http://localhost:8081
CARTELERA_SERVICE_URL=http://localhost:8082
CONFITERIA_SERVICE_URL=http://localhost:8083
ENTRADAS_SERVICE_URL=http://localhost:8084
```

### 3️⃣ Iniciar Microservicios (2 min)

En diferentes terminales:

```bash
# Terminal 1: Usuarios
cd CineFlow-Usuarios && ./mvnw spring-boot:run

# Terminal 2: Cartelera
cd CineFlow-Cartelera && ./mvnw spring-boot:run

# Terminal 3: Confitería
cd CineFlow-Confiteria && ./mvnw spring-boot:run

# Terminal 4: Entradas
cd CineFlow-Entradas && ./mvnw spring-boot:run
```

### 4️⃣ Iniciar el BFF (1 min)

```bash
npm run dev
```

✅ **¡Listo!** El BFF está corriendo en `http://localhost:3000`

---

## ✅ Validar Instalación

```bash
npm run validate
```

O prueba manualmente:

```bash
# Health check
curl http://localhost:3000/api/health

# Debería retornar:
# {
#   "success": true,
#   "status": "healthy",
#   "timestamp": "...",
#   "uptime": 5.234
# }
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Información general del proyecto |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Documentación completa de todos los endpoints |
| [ARQUITECTURA.md](ARQUITECTURA.md) | Explicación de la arquitectura y componentes |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Guía para desarrolladores |

---

## 🧪 Probar un Endpoint

### Opción 1: cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "Password123",
    "nombre": "Juan",
    "apellido": "Pérez"
  }'
```

### Opción 2: Postman

1. Abre Postman
2. `POST` → `http://localhost:3000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw):
```json
{
  "email": "usuario@test.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

### Opción 3: JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@test.com',
    password: 'Password123',
    nombre: 'Juan',
    apellido: 'Pérez'
  })
});

const data = await response.json();
console.log(data);
```

---

## 🏗️ Qué Incluye el BFF

✅ **6 Dominios de API:**
- 🔐 Autenticación (login, registro)
- 🎬 Películas (catálogo, funciones, butacas)
- 👤 Perfil de usuario
- 🍿 Confitería (combos, pedidos)
- 🎟️ Reservas (entradas, tickets)
- ❤️ Favoritos (pendiente de integración)

✅ **Características Implementadas:**
- Validación automática con Joi
- Autenticación JWT
- Manejo centralizado de errores
- Logging estructurado
- CORS configurado
- Integración con microservicios

---

## 🚨 Troubleshooting

### ❌ "Connection refused" (ECONNREFUSED)

**Problema:** No puedes conectar a un microservicio

**Solución:**
1. Verifica que el microservicio está corriendo en el puerto correcto
2. Comprueba `.env` con los puertos correctos
3. Verifica que no hay firewall bloqueando

### ❌ "Token inválido" (401)

**Problema:** No puedes autenticarte

**Solución:**
1. Crea un nuevo token con login
2. Incluye el header: `Authorization: Bearer <token>`
3. Verifica que el token no está expirado

### ❌ "CORS error"

**Problema:** Desde el frontend no puedes llamar al BFF

**Solución:**
```env
# .env
CORS_ORIGIN=http://localhost:3001
```

### ❌ Port 3000 ya está en uso

**Problema:** Otro proceso usa el puerto

**Solución:**
```bash
# Cambiar puerto en .env
PORT=3001
```

---

## 📝 Endpoints Disponibles

### Autenticación

```
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login       # Login
```

### Películas

```
GET    /api/movies                      # Obtener todas
GET    /api/movies/search?q=...         # Buscar
GET    /api/movies/:movieId             # Detalles
GET    /api/movies/:movieId/showtimes   # Funciones
GET    /api/movies/showtimes/:id/seats  # Butacas
```

### Perfil (⚠️ Requiere autenticación)

```
GET    /api/profile          # Obtener perfil
PUT    /api/profile          # Actualizar perfil
```

### Confitería

```
GET    /api/confiteria/combos           # Todos los combos
GET    /api/confiteria/promotions       # Promociones
POST   /api/confiteria/orders           # Crear pedido
GET    /api/confiteria/orders           # Mis pedidos
```

### Reservas (⚠️ Requiere autenticación)

```
POST   /api/reservations                # Crear reserva
GET    /api/reservations                # Mis reservas
GET    /api/reservations/:id            # Detalles
POST   /api/reservations/payment        # Pagar
```

---

## 🔐 Headers Requeridos

### Sin Autenticación
```
Content-Type: application/json
```

### Con Autenticación
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Estructura del Proyecto

```
CineFlow-BFF/
├── src/
│   ├── controllers/       # Lógica de negocio por dominio
│   ├── middleware/        # Autenticación, validación, errores
│   ├── routes/            # Definición de rutas
│   ├── services/          # Llamadas a microservicios
│   ├── utils/             # Cliente HTTP
│   └── server.js          # Punto de entrada
├── config/
│   ├── logger.js          # Logger personalizado
│   └── database.js        # Config BD (placeholder)
├── scripts/
│   └── validate.js        # Validación de config
├── .env                   # Variables de entorno
├── package.json           # Dependencias
└── README.md              # Documentación principal
```

---

## 🎯 Próximos Pasos

1. **Lee la documentación:**
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Todos los endpoints
   - [ARQUITECTURA.md](ARQUITECTURA.md) - Cómo funciona
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Para desarrolladores

2. **Prueba los endpoints:**
   - Usa Postman o cURL
   - Registra un usuario
   - Crea una reserva
   - Explora todas las funcionalidades

3. **Integra con frontend:**
   - El frontend está en `../front_user`
   - Asegúrate de que CORS_ORIGIN es correcto
   - Usa el token en requests autenticados

4. **Despliega a producción:**
   - Configura `.env` con valores de producción
   - Usa Docker para empaquetar
   - Despliega en tu servidor

---

## ✨ Características Principales

| Característica | Descripción |
|---|---|
| 🔐 JWT Auth | Autenticación segura con tokens |
| ✅ Validación | Validación automática con Joi |
| 🐛 Error Handling | Manejo centralizado de errores |
| 📊 Logging | Logs estructurados de todas las operaciones |
| 🔗 Microservicios | Integración con múltiples servicios |
| 📚 Documentación | Documentación completa y ejemplos |
| 🚀 Modular | Fácil de extender y mantener |

---

## 💡 Tips

- **Usa `npm run dev`** durante desarrollo (hot reload con nodemon)
- **Usa `npm run lint`** para verificar código
- **Usa `npm run validate`** para verificar configuración
- **Revisa logs** en consola para debug
- **Usa Postman** para probar endpoints rápidamente

---

## 📞 Ayuda

- 📖 Lee [DEVELOPMENT.md](DEVELOPMENT.md) para problemas comunes
- 🔍 Revisa logs en consola
- 📝 Verifica que `.env` está configurado correctamente
- 💬 Pregunta al equipo de desarrollo

---

## 🎉 ¡Listo!

Ya tienes el BFF corriendo. Ahora:

1. Abre http://localhost:3000/api/health en tu navegador
2. Prueba los endpoints con Postman o cURL
3. Lee la [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para aprender todos los endpoints
4. ¡Crea algo increíble! 🚀

---

**Última actualización:** Junio 2024  
**Versión:** 1.0.0
