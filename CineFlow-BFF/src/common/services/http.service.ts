import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger('HttpService');
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`GET ${url}`);
      return await this.client.get<T>(url, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`GET ${url} - ${message}`);
      throw this.handleError(error);
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`POST ${url}`);
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`POST ${url} - ${message}`);
      throw this.handleError(error);
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`PUT ${url}`);
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`PUT ${url} - ${message}`);
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`DELETE ${url}`);
      return await this.client.delete<T>(url, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`DELETE ${url} - ${message}`);
      throw this.handleError(error);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`PATCH ${url}`);
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`PATCH ${url} - ${message}`);
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response;

      const resolvedMessage =
        data?.message ||
        data?.error ||
        data?.detail ||
        data?.data?.message ||
        data?.data?.error ||
        data?.data?.detail ||
        (typeof data === 'string' ? data : undefined) ||
        'Error en el microservicio';

      throw new HttpException(
        {
          message: resolvedMessage,
          data
        },
        status || HttpStatus.BAD_GATEWAY
      );
    } else if (error.request) {
      throw new HttpException('Microservicio no disponible', HttpStatus.SERVICE_UNAVAILABLE);
    }
    throw error;
  }
}
