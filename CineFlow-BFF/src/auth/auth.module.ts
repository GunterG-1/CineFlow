import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '@/usuarios/usuarios.module';
import { JwtService } from '@/common/services/jwt.service';

@Module({
  imports: [UsuariosModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService]
})
export class AuthModule {}
