import { Controller, Get, Delete, HttpCode } from '@nestjs/common';
import { MensajesService } from './mensaje.service';

@Controller('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @Get()
  listar() {
    return this.mensajesService.listarMensajes();
  }

  @Delete()
  @HttpCode(204)
  limpiar() {
    return this.mensajesService.limpiarMensajes();
  }
}