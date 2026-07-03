import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * Interceptor que normaliza los nombres de propiedades español → inglés
 * antes de que lleguen al ValidationPipe.
 * 
 * Mapeos:
 * - correo → email
 * - contrasena → password
 * - nombre (sin cambios)
 * - apellido (sin cambios)
 */
@Injectable()
export class NormalizeAliasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: any): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Solo procesar POST, PUT, PATCH requests con body
    if (!['POST', 'PUT', 'PATCH'].includes(request.method) || !request.body) {
      return next.handle();
    }

    // Normalizar el body
    const body = request.body as Record<string, any>;
    
    // Mapear alias de campos españoles a ingleses
    if (body.correo !== undefined && body.email === undefined) {
      body.email = body.correo;
      delete body.correo;
    }

    if (body.contrasena !== undefined && body.password === undefined) {
      body.password = body.contrasena;
      delete body.contrasena;
    }

    if (body.confirmarContrasena !== undefined && body.confirmPassword === undefined) {
      body.confirmPassword = body.confirmarContrasena;
      delete body.confirmarContrasena;
    }

    if (body.fechaNacimiento !== undefined && body.birthDate === undefined) {
      body.birthDate = body.fechaNacimiento;
      delete body.fechaNacimiento;
    }

    
    return next.handle();
  }
}
