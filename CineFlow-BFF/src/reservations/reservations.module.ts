import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  providers: [ReservationsService],
  controllers: [ReservationsController]
})
export class ReservationsModule {}
