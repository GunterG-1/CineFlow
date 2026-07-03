import { Module } from '@nestjs/common';
import { ConfiteriaController } from './confiteria.controller';
import { ConfiteriaService } from './confiteria.service';

@Module({
  providers: [ConfiteriaService],
  controllers: [ConfiteriaController]
})
export class ConfiteriaModule {}
