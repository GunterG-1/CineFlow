import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UpdateProfileDto } from '@/auth/dto/auth.dto';

@Controller('profile') 
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: any) {
    return this.authService.getProfile(user.userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: any,
    @Body() updateDto: UpdateProfileDto
  ) {
    return this.authService.updateProfile(user.userId, updateDto);
  }
}