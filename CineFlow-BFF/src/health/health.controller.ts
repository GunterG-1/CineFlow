import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      success: true,
      message: 'BFF está funcionando correctamente',
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      runtime: 'NestJS'
    };
  }

  @Get('version')
  getVersion() {
    return {
      success: true,
      version: '2.0.0',
      framework: 'NestJS',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
