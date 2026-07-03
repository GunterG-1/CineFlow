import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@/common/services/http.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger('MoviesService');
  private readonly gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8080';

  constructor(private readonly httpService: HttpService) {}

  async getAllMovies(filters: any) {
    try {
      this.logger.log('Obteniendo todas las películas via Gateway');
      // CORRECCIÓN: Faltaba el /api. Además, llamamos a /peliculas para traer todas (visibles e invisibles)
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas`);
      const movies = Array.isArray(response.data) ? response.data : [];
      const filtered = movies.filter((movie: any) => {
        if (filters.genre && String(movie.genero || movie.genre || '').toLowerCase() !== String(filters.genre).toLowerCase()) {
          return false;
        }
        if (filters.rating && String(movie.calificacion || movie.rating || '').toLowerCase() !== String(filters.rating).toLowerCase()) {
          return false;
        }
        return true;
      });

      return { success: true, data: filtered };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo películas: ${message}`);
      throw error;
    }
  }
  async getCarteleraPublica() {
    try {
      this.logger.log('Obteniendo cartelera pública (solo visibles) via Gateway');
      
      // Llamamos a la ruta específica que creaste en Spring Boot para las películas visibles
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas/cartelera`);
      const movies = Array.isArray(response.data) ? response.data : [];
      
      return { success: true, data: movies };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo cartelera pública: ${message}`);
      throw error;
    }
  }

  async searchMovies(query: string) {
    try {
      this.logger.log(`Buscando películas: ${query}`);
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas/cartelera`);
      const movies = Array.isArray(response.data) ? response.data : [];
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = movies.filter((movie: any) => {
        const text = [movie.titulo, movie.title, movie.descripcion, movie.description, movie.genero, movie.genre]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return text.includes(normalizedQuery);
      });
      return { success: true, data: filtered };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error buscando películas: ${message}`);
      throw error;
    }
  }

  async getMovieById(movieId: number) {
    try {
      this.logger.log(`Obteniendo película ${movieId}`);
      // OPTIMIZACIÓN: Usar el endpoint directo de Java en lugar de traer toda la cartelera
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas/${movieId}`);
      return { success: true, data: response.data ?? null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo película: ${message}`);
      throw error;
    }
  }

  async getShowtimes(movieId: number) {
    try {
      this.logger.log(`Obteniendo funciones para película ${movieId} vía nuevo endpoint`);
      // Llamamos al endpoint que definimos antes en Java para obtener el DTO 'FunctionResponse'
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas/${movieId}/funciones`);
      
      // Ahora response.data debería ser una lista de 'FunctionResponse' (con precio y sala incluidos)
      return { success: true, data: response.data };
    } catch (error) {
      this.logger.error(`Error obteniendo funciones detalladas: ${error}`);
      throw error;
    }
  }

  async getShowtimeById(showtimeId: number) {
    try {
      this.logger.log(`Obteniendo función ${showtimeId}`);
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/funciones/${showtimeId}/butacas`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error obteniendo función: ${message}`);
      throw error;
    }
  }

  async createMovie(movieData: any) {
    try {
      this.logger.log('Datos recibidos en BFF: ' + JSON.stringify(movieData));
      
      const javaPayload = {
         titulo: movieData.title || movieData.titulo,
         genero: movieData.genre || movieData.genero,
         calificacion: movieData.classification || movieData.calificacion || 'PG-13',
         duracionMinutos: Number(movieData.duration || movieData.duracionMinutos || 120),
         imagenUrl: movieData.imageSrc || movieData.imagenUrl || '',
         bannerUrl: movieData.bannerSrc || movieData.bannerUrl || '',
         sinopsis: movieData.description || movieData.sinopsis || 'Sin descripción',
         actores: movieData.actors || movieData.actores || [],
         enCartelera: Boolean(movieData.isVisible ?? movieData.enCartelera ?? true)
      };

      this.logger.log('Payload enviado a Java: ' + JSON.stringify(javaPayload));
      const response = await this.httpService.post(`${this.gatewayUrl}/api/cartelera/peliculas`, javaPayload);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error creando película: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Detalle del error de Java: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async createFunction(functionData: any) {
    try {
      this.logger.log('Datos de función recibidos desde React: ' + JSON.stringify(functionData));

      // Extraemos directamente los valores prioritarios
      const movieId = Number(functionData.movieId || functionData.peliculaId);
      const roomId = Number(functionData.roomId || functionData.salaId);
      
      // Tomamos la fecha y hora directa si vienen separadas
      let fecha = functionData.fecha || functionData.date;
      let hora = functionData.hora || functionData.time;

      // Respaldo: Si por alguna razón vienen juntas en 'startsAt' o 'fechaInicio'
      const startsAt = functionData.startsAt || functionData.fechaInicio;
      if (startsAt && !fecha) {
        const raw = String(startsAt);
        fecha = raw.includes('T') ? raw.split('T')[0] : raw.slice(0, 10);
        const timeMatch = raw.match(/T(\d{2}:\d{2})/);
        hora = timeMatch ? timeMatch[1] : '00:00';
      }

      // Validación final con mensaje detallado para depuración
      if (!movieId || !roomId || !fecha || !hora) {
        throw new Error(`Faltan datos. Recibido -> movieId: ${movieId}, roomId: ${roomId}, fecha: ${fecha}, hora: ${hora}`);
      }

      // Armamos el payload exacto que espera Spring Boot
      const normalizedPayload = {
        peliculaId: movieId, // <-- CAMBIADO: Antes era movieId
        salaId: roomId,      // <-- CAMBIADO: Antes era roomId
        formato: functionData.format || functionData.formato || '2D', // <-- CAMBIADO: Antes era format
        fecha,               // Ya está perfecto: "YYYY-MM-DD"
        hora,                // Ya está perfecto: "HH:mm"
      };

      this.logger.log('Payload enviado a Java: ' + JSON.stringify(normalizedPayload));
      
      const response = await this.httpService.post(`${this.gatewayUrl}/api/cartelera/funciones`, normalizedPayload);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error creando función: ${message}`);
      throw error;
    }
  }

  async updateMovie(movieId: number, movieData: any) {
    try {
      this.logger.log(`Actualizando película ${movieId}`);
      // Construir payload condicionalmente para evitar enviar cadenas vacías y sobreescribir campos no modificados
      const javaPayload: any = {};
      if (movieData.title || movieData.titulo) javaPayload.titulo = movieData.title || movieData.titulo;
      if (movieData.genre || movieData.genero) javaPayload.genero = movieData.genre || movieData.genero;
      javaPayload.calificacion = movieData.classification || movieData.calificacion || 'PG-13';
      javaPayload.duracionMinutos = Number(movieData.duration || movieData.duracionMinutos || 120);
      if (movieData.imageSrc || movieData.imagenUrl) javaPayload.imagenUrl = movieData.imageSrc || movieData.imagenUrl;
      if (movieData.bannerSrc || movieData.bannerUrl) javaPayload.bannerUrl = movieData.bannerSrc || movieData.bannerUrl;
      if (movieData.description || movieData.sinopsis) javaPayload.sinopsis = movieData.description || movieData.sinopsis;
      if (movieData.actors || movieData.actores) javaPayload.actores = movieData.actors || movieData.actores;
      if (movieData.enCartelera !== undefined) javaPayload.enCartelera = movieData.enCartelera; else if (movieData.isVisible !== undefined) javaPayload.enCartelera = movieData.isVisible;

      this.logger.log('Payload enviado a Java (PUT): ' + JSON.stringify(javaPayload));
      const response = await this.httpService.put(`${this.gatewayUrl}/api/cartelera/peliculas/${movieId}`, javaPayload);
      this.logger.log('Respuesta de Java al PUT: ' + JSON.stringify(response.data));
      // Hacer un GET inmediato para asegurarnos de devolver el registro persistido desde Java
      try {
        const fresh = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/peliculas/${movieId}`);
        this.logger.log('GET posterior al PUT (registro persistido): ' + JSON.stringify(fresh.data));
        return fresh.data;
      } catch (getErr) {
        this.logger.warn('No se pudo obtener el registro tras el PUT, devolviendo respuesta del PUT');
        return response.data;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error actualizando película: ${message}`);
      throw error;
    }
  }

  async deleteMovie(movieId: number) {
    try {
      this.logger.log(`Eliminando película ${movieId}`);
      const response = await this.httpService.delete(`${this.gatewayUrl}/api/cartelera/peliculas/${movieId}`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error eliminando película: ${message}`);
      throw error;
    }
  }

  async uploadMedia(file: Express.Multer.File, type?: string) {
    try {
      if (!file) throw new Error('El archivo es obligatorio');
      
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', file.buffer, { 
        filename: file.originalname, 
        contentType: file.mimetype 
      });
      formData.append('type', type || 'assets');

      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/cartelera/media`,
        formData,
        { headers: formData.getHeaders() }
      );

      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error subiendo media: ${message}`);
      throw error;
    }
  }
  async reserveSeat(functionId: number, fila: string, numero: number) {
    try {
      this.logger.log(`Reservando butaca ${fila}${numero} en función ${functionId}`);
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/cartelera/funciones/${functionId}/butacas/reserve`,
        { fila, numero }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error reservando butaca: ${error}`);
      throw error;
    }
  }

  async releaseSeat(functionId: number, fila: string, numero: number) {
    try {
      this.logger.log(`Liberando butaca ${fila}${numero} en función ${functionId}`);
      const response = await this.httpService.post(
        `${this.gatewayUrl}/api/cartelera/funciones/${functionId}/butacas/release`,
        { fila, numero }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error liberando butaca: ${error}`);
      throw error;
    }
  }
  async getAllFunctions() {
  try {
    const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/funciones`);
    return { success: true, data: response.data };
  } catch (error) {
    this.logger.error(`Error obteniendo todas las funciones: ${error}`);
    throw error;
  }
}

  async getAllRooms() {
    try {
      const response = await this.httpService.get(`${this.gatewayUrl}/api/cartelera/salas`);
      return { success: true, data: response.data };
    } catch (error) {
      this.logger.error(`Error obteniendo salas: ${error}`);
      throw error;
    }
  }
}