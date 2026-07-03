import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';



export interface MensajeBandeja {
  recibidoEn: string;
  [key: string]: unknown;
}

@Injectable()
export class MensajesService {
  constructor(private readonly configService: ConfigService) {}

  private async obtenerMensajesDe(nombreServicio: string, baseUrl: string): Promise<MensajeBandeja[]> {
    try {
      const response = await axios.get(`${baseUrl}/api/mensajes`, { timeout: 5000 });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`Error consultando bandeja en ${nombreServicio} (${baseUrl}):`, mensaje);
      return [];
    }
  }

  async listarMensajes() {
    const entradasUrl = this.configService.get<string>('ENTRADAS_SERVICE_URL', 'http://localhost:8084');
    const carteleraUrl = this.configService.get<string>('CARTELERA_SERVICE_URL', 'http://localhost:8082');

    const [mensajesEntradas, mensajesCartelera] = await Promise.all([
      this.obtenerMensajesDe('Entradas', entradasUrl),
      this.obtenerMensajesDe('Cartelera', carteleraUrl),
    ]);

    return [...mensajesEntradas, ...mensajesCartelera].sort(
      (a, b) => new Date(b.recibidoEn).getTime() - new Date(a.recibidoEn).getTime()
    );
  }

  async limpiarMensajes() {
    const entradasUrl = this.configService.get<string>('ENTRADAS_SERVICE_URL', 'http://localhost:8084');
    const carteleraUrl = this.configService.get<string>('CARTELERA_SERVICE_URL', 'http://localhost:8082');

    const resultados = await Promise.allSettled([
      axios.delete(`${entradasUrl}/api/mensajes`, { timeout: 5000 }),
      axios.delete(`${carteleraUrl}/api/mensajes`, { timeout: 5000 }),
    ]);

    const fallos = resultados.filter((r) => r.status === 'rejected');
    if (fallos.length > 0) {
      throw new HttpException(
        'No se pudo limpiar la bandeja en uno o mas microservicios.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}