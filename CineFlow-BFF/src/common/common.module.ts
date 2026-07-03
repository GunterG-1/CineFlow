import { Global, Module } from '@nestjs/common';
import { HttpService } from './services/http.service';
import { JwtService } from './services/jwt.service';

@Global()
@Module({
  providers: [HttpService, JwtService],
  exports: [HttpService, JwtService]
})
export class CommonModule {}
