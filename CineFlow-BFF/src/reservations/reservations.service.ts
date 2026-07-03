import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@/common/services/http.service';
import { CreateReservationDto, ProcessPaymentDto, ValidateTicketDto } from './dto/reservations.dto';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger('ReservationsService');
  private readonly gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8080';

  constructor(private readonly httpService: HttpService) {}

  // 1. Corrección para Disponibilidad
  async getAvailability(claveFuncion: string) {
    try {
      this.logger.log(`Obteniendo disponibilidad para función: ${claveFuncion}`);
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/entradas/disponibilidad`,
        { params: { claveFuncion } }
      );
      return response.data;
    } catch (error) {
      // Corrección de tipo para TypeScript
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error en getAvailability: ${message}`);
      throw error;
    }
  }

  // 2. Corrección para Reservar (PATCH)
  async createReservation(userId: number, createReservationDto: CreateReservationDto) {
  try {
    // 1. Traemos la función completa desde Cartelera (incluye precio)
    const funcionResp = await this.httpService.get(
      `${this.gatewayUrl}/api/cartelera/funciones/${createReservationDto.idFuncion}`
    );
    const funcion = funcionResp.data;

    // 2. Armamos el payload para Entradas con el precio real
    const payload = {
  idFuncion: createReservationDto.idFuncion,
  asientosSeleccionados: createReservationDto.asientosSeleccionados,
  numeroPelicula: String(funcion.peliculaId),
  nombrePelicula: funcion.tituloPelicula,
  horaPelicula: funcion.hora,
  sala: funcion.nombreSala,
  precio: funcion.precio,
};
    const response = await this.httpService.patch(
      `${this.gatewayUrl}/api/entradas/reservar`,
      payload
    );
    return response.data;
  } catch (error) {
    this.logger.error(`Error creando reserva: ${error}`);
    throw error;
  }
}

  async processPayment(userId: number, paymentDto: ProcessPaymentDto) {
    try {
      this.logger.log(`Procesando pago para usuario ${userId}`);
      // CORRECCIÓN: Ahora usa /api/entradas/pagar (Como en Java)
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/entradas/pagar`,
        { ...paymentDto, idUsuario: userId }
      );
      return { success: true, data: response.data || response, message: 'Pago procesado' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error procesando pago: ${message}`);
      throw error;
    }
  }

  async getTickets(reservationId: number) {
    try {
      this.logger.log(`Obteniendo código QR de reserva ${reservationId}`);
      // CORRECCIÓN: Ahora usa /api/entradas/{id}/codigoqr (Como en Java)
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/entradas/${reservationId}/codigoqr`
      );
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo tickets: ${message}`);
      throw error;
    }
  }

  async getUserReservations(userId: number) {
    try {
      this.logger.log(`Obteniendo reservas de usuario ${userId}`);
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/entradas/usuarios/${userId}/reservas`
      );
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo reservas: ${message}`);
      throw error;
    }
  }

  async getReservationById(reservationId: number) {
    try {
      this.logger.log(`Obteniendo reserva ${reservationId}`);
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/entradas/reservas/${reservationId}`
      );
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo reserva: ${message}`);
      throw error;
    }
  }

  async cancelReservation(reservationId: number) {
    try {
      this.logger.log(`Cancelando reserva ${reservationId}`);
      const response = await this.httpService.delete(
        `${this.gatewayUrl}/api/entradas/reservas/${reservationId}`
      );
      return { success: true, data: response.data || response, message: 'Reserva cancelada' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error cancelando reserva: ${message}`);
      throw error;
    }
  }
  

  async validateTicket(validateDto: ValidateTicketDto) {
    try {
      this.logger.log('Validando ticket');
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/entradas/tickets/validar`,
        validateDto
      );
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error validando ticket: ${message}`);
      throw error;
    }
  }
}