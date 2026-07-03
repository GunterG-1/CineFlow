import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from '@/auth/dto/auth.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  getAllUsers() {
    return this.usuariosService.getAllUsers();
  }

  @Get('estadisticas')
  getStatistics() {
    return this.usuariosService.getStatistics();
  }

  @Get('correo/:correo')
  getUserByEmail(@Param('correo') correo: string) {
    return this.usuariosService.getUserByEmail(correo);
  }

  @Get('existe-correo/:correo')
  emailExists(@Param('correo') correo: string) {
    return this.usuariosService.emailExists(correo);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usuariosService.getUserById(+id);
  }

  @Post('registrar')
  register(@Body() registerDto: RegisterDto) {
    return this.usuariosService.register(registerDto);
  }

  @Post('registrar-completo')
  registerComplete(@Body() payload: Record<string, unknown>) {
    return this.usuariosService.registerComplete(payload);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usuariosService.login(loginDto.email, loginDto.password);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() payload: Record<string, unknown>) {
    return this.usuariosService.updateUser(+id, payload);
  }

  @Put(':id/actualizar')
  updateProfile(@Param('id') id: string, @Body() updateDto: UpdateProfileDto) {
    return this.usuariosService.updateProfile(+id, updateDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usuariosService.deleteUser(+id);
  }
}