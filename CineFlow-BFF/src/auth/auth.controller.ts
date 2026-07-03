import { Body, Controller, HttpCode, HttpStatus, Post, Put, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto'; // Asegúrate de importar UpdateProfileDto
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.login(loginDto, response);
  }

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.register(registerDto, response); 
  }
  
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('authToken', { path: '/' });
    return { success: true, message: 'Logout exitoso' };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: any, // Necesitamos @Req para obtener el userId del token
    @Body() updateDto: UpdateProfileDto
  ) {
    // Extraemos el id del usuario que viene en el token decodificado por el Guard
    const userId = req.user.id; 
    return await this.authService.updateProfile(userId, updateDto);
  }
}