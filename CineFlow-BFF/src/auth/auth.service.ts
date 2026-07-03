import { Injectable, BadRequestException, UnauthorizedException, Logger, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';
import { UsuariosService } from '@/usuarios/usuarios.service';
import { JwtService } from '@/common/services/jwt.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    try {
      this.logger.log(`Registrando usuario: ${registerDto.email}`);

      const user = await this.usuariosService.register(registerDto);
      const token = this.jwtService.generateToken(user.id, user.email);

      response.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          correo: user.email,
          nombre: user.nombre,
          apellido: user.apellido
        }
      };
    } catch (error: any) {
      this.logger.error(`Error en registro: ${error.message}`);
      throw new BadRequestException(error.response?.data?.message || error.message || 'Error al registrar usuario');
    }
  }

  async login(loginDto: LoginDto, response: Response) {
    try {
      this.logger.log(`Login de usuario: ${loginDto.email}`);

      const loginResult = await this.usuariosService.login(
        loginDto.email,
        loginDto.password
      );

      // Verificamos si la autenticación fue exitosa según la estructura de tu Java
      const authenticated = loginResult?.iniciadoSesion === true || loginResult?.success === true;
      const profile = loginResult?.usuario ?? loginResult?.user ?? loginResult?.data ?? loginResult;

      if (!authenticated || (!profile?.correo && !profile?.email)) {
        // Aquí lanzamos el mensaje específico que viene desde el Java
        throw new UnauthorizedException(loginResult?.mensaje || loginResult?.message || 'Credenciales inválidas');
      }

      const userId = profile.idUsuario ?? profile.id;
      const email = profile.correo ?? profile.email;
      const token = this.jwtService.generateToken(userId, email);

      response.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });

      return {
        success: true,
        message: 'Login exitoso',
        user: {
          id: userId,
          correo: email,
          nombre: profile.nombreUsuario ?? profile.nombre,
          apellido: profile.apellidoUsuario ?? profile.apellido,
          fechaNacimiento: profile.fecha_nacimiento ?? profile.fechaNacimiento ?? ''
        }
      };
    } catch (error: any) {
      this.logger.error(`Error en login: ${error.message}`);
      
      // Si el error viene de una respuesta del servidor (Java), pasamos el mensaje real
      if (error.response?.data) {
         const backendMessage = error.response.data.mensaje || error.response.data.message || 'Credenciales inválidas';
         throw new UnauthorizedException(backendMessage);
      }
      
      // Si es un error de nestjs ya lanzado, lo dejamos pasar
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async getProfile(userId: number) {
    try {
      const profile = await this.usuariosService.getProfile(userId);
      return { success: true, user: profile };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'No se pudo obtener el perfil');
    }
  }

  async updateProfile(userId: number, updateDto: UpdateProfileDto) {
  try {
    // Delegamos la lógica al servicio que realmente tiene acceso al HTTP
    return await this.usuariosService.updateProfile(userId, updateDto);
  } catch (error: any) {
    // Aquí gestionamos el error que viene del UsuariosService
    throw new BadRequestException(error.message || 'No se pudo actualizar el perfil');
  }
}
}