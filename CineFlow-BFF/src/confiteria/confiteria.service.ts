import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@/common/services/http.service';
import { CreateOrderDto } from './dto/confiteria.dto';

@Injectable()
export class ConfiteriaService {
  private readonly logger = new Logger('ConfiteriaService');
  private readonly gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8080';

  constructor(private readonly httpService: HttpService) {}

  async getAllCombos(filters: any) {
    try {
      this.logger.log('Obteniendo combos (menú)');
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.priceRange) queryParams.append('priceRange', filters.priceRange);

      const qs = queryParams.toString();
      // Construcción limpia: solo añade el ? si existen parámetros
      const url = qs 
        ? `${this.gatewayUrl}/api/confiteria/menu?${qs}` 
        : `${this.gatewayUrl}/api/confiteria/menu`;

      const response = await this.httpService.get(url);
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo combos: ${message}`);
      throw error;
    }
  }

  async getComboById(comboId: number) {
    try {
      this.logger.log(`Obteniendo combo ${comboId}`);
      const response = await this.httpService.get(`${this.gatewayUrl}/api/confiteria/menu/${comboId}`);
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo combo: ${message}`);
      throw error;
    }
  }

  // MODIFICACIÓN: Promociones ahora se obtienen filtrando el menú o desde el mismo endpoint
  async getPromotions() {
    try {
      this.logger.log('Obteniendo promociones desde microservicio de confitería');
      const response = await this.httpService.get(`${this.gatewayUrl}/api/confiteria/promotions`);
      const data = response.data || response;
      return { success: true, data: Array.isArray(data) ? data : (data?.data ?? []) };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo promociones: ${message}`);
      throw error;
    }
  }

  async getItems() {
    try {
      this.logger.log('Obteniendo items de confitería');
      const response = await this.httpService.get(`${this.gatewayUrl}/api/confiteria/items`);
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo items: ${message}`);
      throw error;
    }
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    try {
      this.logger.log(`Creando pedido para usuario ${userId}`);
      // CORRECCIÓN: Java usa /api/confiteria/ordenar y espera 'idUsuario'
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/confiteria/ordenar`,
        { ...createOrderDto, idUsuario: userId }
      );
      return { success: true, data: response.data || response, message: 'Pedido creado' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error creando pedido: ${message}`);
      throw error;
    }
    
  }

  async getOrdersByUser(userId: number) {
    try {
      this.logger.log(`Obteniendo pedidos de usuario ${userId}`);
      // CORRECCIÓN: Java usa /api/confiteria/order/usuario/{idUsuario}
      const response = await this.httpService.get(
        `${this.gatewayUrl}/api/confiteria/order/usuario/${userId}`
      );
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo pedidos: ${message}`);
      throw error;
    }
  }

  async getOrderById(orderId: number) {
    try {
      this.logger.log(`Obteniendo pedido ${orderId}`);
      // CORRECCIÓN: Java usa /api/confiteria/order/{id}
      const response = await this.httpService.get(`${this.gatewayUrl}/api/confiteria/order/${orderId}`);
      return { success: true, data: response.data || response };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo pedido: ${message}`);
      throw error;
    }
  }
}