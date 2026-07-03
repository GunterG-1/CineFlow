import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: any
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, path } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.debug(
          `${method} ${path} - ${duration}ms`
        );
      })
    );
  }
}
