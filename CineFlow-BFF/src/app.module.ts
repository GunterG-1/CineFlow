import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ConfiteriaModule } from './confiteria/confiteria.module';
import { ReservationsModule } from './reservations/reservations.module';
import { HealthModule } from './health/health.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProfileModule } from './profile/profile.module';
import { MensajesModule } from './mensajes/mensaje.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    CommonModule,
    AuthModule,
    ProfileModule,
    UsuariosModule,
    MoviesModule,
    ConfiteriaModule,
    ReservationsModule,
    HealthModule,
     MensajesModule,
  ]
})
export class AppModule {}
