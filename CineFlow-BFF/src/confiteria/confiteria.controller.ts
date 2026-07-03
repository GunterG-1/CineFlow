import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ConfiteriaService } from './confiteria.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { CreateOrderDto } from './dto/confiteria.dto';

@Controller('confiteria')
export class ConfiteriaController {
  constructor(private readonly confiteriaService: ConfiteriaService) {}

  @Get('menu') // ANTES: 'combos'
  getAllCombos(
    @Query('type') type?: string,
    @Query('priceRange') priceRange?: string
  ) {
    return this.confiteriaService.getAllCombos({ type, priceRange });
  }

  @Get('menu/:comboId') // ANTES: 'combos/:comboId'
  getComboById(@Param('comboId') comboId: string) {
    return this.confiteriaService.getComboById(+comboId);
  }
  // Añade este método a tu clase ConfiteriaController
  @Get('promociones')
  getPromotions() {
    return this.confiteriaService.getPromotions();
  }
  // Alias en inglés para compatibilidad con frontends
  @Get('promotions')
  getPromotionsEn() {
    return this.confiteriaService.getPromotions();
  }

  @Get('items')
  getItems() {
    return this.confiteriaService.getItems();
  }

  

  @Post('ordenar') // ANTES: 'orders'
  @UseGuards(JwtAuthGuard)
  createOrder(@GetUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.confiteriaService.createOrder(user.userId, createOrderDto);
  }

  @Get('pedidos') // ANTES: 'orders'
  @UseGuards(JwtAuthGuard)
  getOrdersByUser(@GetUser() user: any) {
    return this.confiteriaService.getOrdersByUser(user.userId);
  }

  @Get('pedidos/:orderId') // ANTES: 'orders/:orderId'
  @UseGuards(JwtAuthGuard)
  getOrderById(@Param('orderId') orderId: string) {
    return this.confiteriaService.getOrderById(+orderId);
  }
}