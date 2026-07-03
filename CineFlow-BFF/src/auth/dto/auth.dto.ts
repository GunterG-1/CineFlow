import { IsDateString, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @MinLength(3)
  apellido: string;

  @IsDateString()
  fechaNacimiento: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  apellido?: string;

  @IsOptional()
  @IsString()
  contrasena?: string; // Nota: Asegúrate de que esto coincida con el nombre que recibe el servicio

  // RENOMBRADO de 'paymentMethod' a 'metodoPago' para que coincida con tu servicio
  @IsOptional()
  @IsString()
  @MinLength(2)
  metodoPago?: string; 
}