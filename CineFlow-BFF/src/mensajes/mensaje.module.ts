import { Module } from '@nestjs/common';
import { MensajesController } from './mensaje.controller';
import { MensajesService } from './mensaje.service';

@Module({
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}