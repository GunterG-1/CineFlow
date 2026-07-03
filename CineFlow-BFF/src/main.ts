import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { NormalizeAliasInterceptor } from './common/interceptors/normalize-alias.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const corsOrigin = process.env.CORS_ORIGIN;
  const parsedCorsOrigins = corsOrigin
    ? corsOrigin
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  const defaultCorsOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ];
  const allowedOrigins = parsedCorsOrigins.length > 0 ? parsedCorsOrigins : defaultCorsOrigins;

  // CORS Configuration
  if (!corsOrigin) {
    console.warn(
      'CORS_ORIGIN no está definido. Se usarán los orígenes por defecto para permitir el frontend local.'
    );
  }

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.enableCors(corsOptions);

  // Cookie Parser
  app.use(cookieParser());

  // Global Interceptors (ANTES de ValidationPipe para normalizar aliases)
  app.useGlobalInterceptors(new NormalizeAliasInterceptor());

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors (DESPUÉS de ValidationPipe para logging)
  app.useGlobalInterceptors(new LoggerInterceptor());

  // Prefix
  app.setGlobalPrefix('api');

  await app.listen(PORT, () => {
    console.log(`\n🚀 BFF (NestJS) ejecutándose en http://localhost:${PORT}`);
    console.log(`⚙️  Entorno: ${process.env.NODE_ENV}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});
