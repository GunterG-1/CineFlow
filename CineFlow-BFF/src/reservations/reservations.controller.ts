import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { CreateReservationDto, ProcessPaymentDto, ValidateTicketDto } from './dto/reservations.dto';

@Controller('entradas') // ANTES: 'reservations'
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Patch('reservar')
@UseGuards(JwtAuthGuard)
createReservation(@GetUser() user: any, @Body() createReservationDto: CreateReservationDto) {
  return this.reservationsService.createReservation(user.userId, createReservationDto);
}

  @Post('pagar') // ANTES: @Post('payment')
  @UseGuards(JwtAuthGuard)
  processPayment(@GetUser() user: any, @Body() paymentDto: ProcessPaymentDto) {
    return this.reservationsService.processPayment(user.userId, paymentDto);
  }

  @Get('disponibilidad') // ¡NUEVO! Para que funcione tu resumenPedido.jsx
  obtenerDisponibilidad(@Query('claveFuncion') claveFuncion: string) {
    // Asegúrate de que tu reservationsService tenga este método
    return this.reservationsService.getAvailability(claveFuncion);
  }

  @Get('usuario') // ANTES: @Get()
  @UseGuards(JwtAuthGuard)
  getUserReservations(@GetUser() user: any) {
    return this.reservationsService.getUserReservations(user.userId);
  }

  @Get(':reservationId')
  getReservationById(@Param('reservationId') reservationId: string) {
    return this.reservationsService.getReservationById(+reservationId);
  }
  
  @Get(':reservationId/codigoqr') // ANTES: /tickets
  getTickets(@Param('reservationId') reservationId: string) {
    return this.reservationsService.getTickets(+reservationId);
  }

  @Delete(':reservationId')
  cancelReservation(@Param('reservationId') reservationId: string) {
    return this.reservationsService.cancelReservation(+reservationId);
  }

  @Post('verificar-ticket') // ANTES: validate-ticket
  validateTicket(@Body() validateDto: ValidateTicketDto) {
    return this.reservationsService.validateTicket(validateDto);
  }
}
