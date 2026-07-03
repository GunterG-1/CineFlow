import { IsNumber, IsArray, IsString, IsOptional, Min } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  idFuncion: number;

  @IsArray()
  @IsString({ each: true })
  asientosSeleccionados: string[];
}

export class ProcessPaymentDto {
  @IsNumber()
  idFuncion: number;

  @IsArray()
  @IsString({ each: true })
  asientosSeleccionados: string[];

  @IsString()
  emailComprador: string;

  @IsString()
  metodoPago: string;

  @IsOptional()
  @IsString()
  codigoDescuento?: string;

  @IsOptional()
  @IsString()
  numeroTarjeta?: string;
}

export class ValidateTicketDto {
  @IsString()
  ticketCode: string;
}