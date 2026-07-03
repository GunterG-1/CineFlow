import { Injectable, BadRequestException, UnauthorizedException, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@/common/services/http.service';
import { RegisterDto, UpdateProfileDto } from '@/auth/dto/auth.dto';
import { JwtService } from '@/common/services/jwt.service';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');
  private readonly gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8080';

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log(`Registrando usuario: ${registerDto.email}`);

      const response = await this.httpService.post(`${this.gatewayUrl}/api/usuarios/registrar`, {
        correo: registerDto.email,
        contrasena: registerDto.password,
        confirmarContrasena: registerDto.password,
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
        fechaNacimiento: registerDto.fechaNacimiento
      });

      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error en registro: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar usuario');
    }
  }

  async registerComplete(payload: Record<string, unknown>) {
    try {
      this.logger.log('Registrando usuario completo');
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/usuarios/registrar-completo`,
        payload
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error en registro completo: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar usuario completo');
    }
  }

  async getAllUsers() {
    try {
      this.logger.log('Obteniendo usuarios');
      const response = await this.httpService.get(`${this.gatewayUrl}/api/usuarios`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo usuarios: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudieron obtener los usuarios');
    }
  }

  async getStatistics() {
    try {
      this.logger.log('Obteniendo estadisticas de usuarios');
      const response = await this.httpService.get(`${this.gatewayUrl}/api/usuarios/estadisticas`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo estadisticas: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudieron obtener las estadisticas de usuarios');
    }
  }

  async getUserById(userId: number) {
    try {
      this.logger.log(`Obteniendo usuario: ${userId}`);
      const response = await this.httpService.get(`${this.gatewayUrl}/api/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo usuario: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo obtener el usuario');
    }
  }

  async getUserByEmail(email: string) {
    try {
      this.logger.log(`Obteniendo usuario por correo: ${email}`);
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/usuarios/correo/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo usuario por correo: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo obtener el usuario por correo');
    }
  }

  async emailExists(email: string) {
    try {
      this.logger.log(`Verificando correo: ${email}`);
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/usuarios/existe-correo/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error verificando correo: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo verificar el correo');
    }
  }

  async login(email: string, password: string) {
    try {
      this.logger.log(`Login de usuario: ${email}`);

      const response = await this.httpService.post(`${this.gatewayUrl}/api/usuarios/login`, {
        correo: email,
        contrasena: password
      });

      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error en login: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async getProfile(userId: number) {
    try {
      this.logger.log(`Obteniendo perfil de usuario: ${userId}`);

      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/usuarios/${userId}`
      );

      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo perfil: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo obtener el perfil');
    }
  }

  async updateProfile(userId: number, updateDto: UpdateProfileDto) {
  try {
    this.logger.log(`Actualizando perfil de usuario: ${userId}`);
    
    // Construimos el payload usando los nombres que el DTO de Java sí reconoce
    const javaPayload: any = {
      nombre: updateDto.nombre,
      apellido: updateDto.apellido,
    };

    // Solo enviamos contrasena si el usuario realmente la escribió
    if (updateDto.contrasena) {
        javaPayload.contrasena = updateDto.contrasena;
    }

    // CAMBIO AQUÍ: Usamos 'metodoPago' que coincide con el @JsonAlias de Java
    if (updateDto.metodoPago) {
      javaPayload.metodoPago = updateDto.metodoPago;
    }

    this.logger.log('JSON enviado a Java: ' + JSON.stringify(javaPayload));

    const response = await this.httpService.put(
      `${this.gatewayUrl}/api/usuarios/${userId}/actualizar`,
      javaPayload
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      this.logger.error(`Error detallado de Java: ${JSON.stringify(error.response.data)}`);
    }
    throw new BadRequestException('No se pudo actualizar el perfil');
  }
}

  async updateUser(userId: number, payload: Record<string, unknown>) {
    try {
      this.logger.log(`Actualizando usuario: ${userId}`);
      const response = await this.httpService.put(
        `${this.gatewayUrl}/api/usuarios/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error actualizando usuario: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo actualizar el usuario');
    }
  }

  async deleteUser(userId: number) {
    try {
      this.logger.log(`Eliminando usuario: ${userId}`);
      await this.httpService.delete(`${this.gatewayUrl}/api/usuarios/${userId}`);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error eliminando usuario: ${message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }
}
