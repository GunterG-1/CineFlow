# 🚀 Guía Rápida - BFF NestJS

Comenzar a usar el BFF en **5 minutos**.

---

## ⚡ Inicio Rápido

### 1️⃣ Instalar (1 min)
```bash
cd CineFlow-BFF
npm install
```

### 2️⃣ Configurar (1 min)
```bash
# Ya existe .env, solo verifica las URLs
cat .env
```

### 3️⃣ Compilar (1 min)
```bash
npm run build
```

### 4️⃣ Ejecutar (1 min)
```bash
npm run dev
```

### 5️⃣ Probar (1 min)
```bash
curl http://localhost:3000/api/health
```

✅ **Listo en 5 minutos**

---

## 🔍 URLs de Prueba

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123",
    "nombre": "Juan",
    "apellido": "Pérez"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123"
  }'
```

### Obtener Películas
```bash
curl http://localhost:3000/api/movies
```

### Obtener Perfil (requiere token)
```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📁 Estructura de Carpetas

```
src/
├── auth/                    # Autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│       └── auth.dto.ts
│
├── usuarios/                # Usuarios (Microservicio 8081)
│   ├── usuarios.service.ts
│   └── usuarios.module.ts
│
├── movies/                  # Películas (Microservicio 8082)
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   └── movies.module.ts
│
├── profile/                 # Perfil
│   ├── profile.controller.ts
│   ├── profile.service.ts
│   └── profile.module.ts
│
├── confiteria/              # Confitería (Microservicio 8083)
│   ├── confiteria.controller.ts
│   ├── confiteria.service.ts
│   ├── confiteria.module.ts
│   └── dto/
│       └── confiteria.dto.ts
│
├── reservations/            # Reservaciones (Microservicio 8084)
│   ├── reservations.controller.ts
│   ├── reservations.service.ts
│   ├── reservations.module.ts
│   └── dto/
│       └── reservations.dto.ts
│
├── health/                  # Health Check
│   ├── health.controller.ts
│   └── health.module.ts
│
├── common/                  # Código reutilizable
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── logger.interceptor.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── decorators/
│   │   └── get-user.decorator.ts
│   └── services/
│       ├── jwt.service.ts
│       └── http.service.ts
│
├── app.module.ts            # Módulo principal
└── main.ts                  # Punto de entrada
```

---

## 🎯 Características

### Autenticación
- ✅ JWT tokens
- ✅ Cookies httpOnly
- ✅ Guards automáticos
- ✅ Decorador @GetUser()

### Validación
- ✅ DTOs con class-validator
- ✅ Pipes automáticos
- ✅ Errores detallados

### Integración
- ✅ 4 microservicios
- ✅ HTTP client (Axios)
- ✅ Manejo de errores

### Seguridad
- ✅ CORS
- ✅ JWT
- ✅ Validación
- ✅ Logging

---

## 🔧 Comandos

```bash
npm run dev                 # Desarrollo
npm run build              # Compilar
npm start                  # Producción
npm test                   # Tests
npx nest generate module   # Generar módulo
npx nest generate service  # Generar servicio
npx nest generate guard    # Generar guard
```

---

## 📊 Versión

- **Framework**: NestJS 10.2.10
- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.2.2
- **API Version**: 2.0.0

---

## 📞 Troubleshooting

### Error: "Cannot find module"
```bash
npm install
npm run build
```

### Error: "Port 3000 in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: "Microservices not available"
```bash
# Verificar que los microservicios estén corriendo
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

---

## ✨ Próximos Pasos

1. ✅ Ejecutar `npm install`
2. ✅ Ejecutar `npm run dev`
3. ✅ Probar `/api/health`
4. 📋 Leer NESTJS_MIGRATION.md
5. 📋 Revisar endpoints en API_DOCUMENTATION.md

---

**¡BFF NestJS está listo! 🚀**
