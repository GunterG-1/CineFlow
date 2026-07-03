import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MoviesService } from './movies.service';

@Controller('cartelera') // ANTES: 'movies'
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  
  @Get('peliculas/cartelera')
  getCarteleraPublica() {
    return this.moviesService.getCarteleraPublica();
  }

  @Get('peliculas') // ANTES: @Get()
  getAllMovies(
    @Query('genre') genre?: string,
    @Query('rating') rating?: string
  ) {
    return this.moviesService.getAllMovies({ genre, rating });
  }

  @Get('peliculas/buscar') // ANTES: @Get('search')
  searchMovies(@Query('q') query: string) {
    return this.moviesService.searchMovies(query);
  }

  @Get('peliculas/:movieId') // ANTES: @Get(':movieId')
  getMovieById(@Param('movieId') movieId: string) {
    return this.moviesService.getMovieById(+movieId);
  }

  @Post('peliculas') // ANTES: @Post()
  createMovie(@Body() movieData: Record<string, unknown>) {
    return this.moviesService.createMovie(movieData);
  }

  @Post('funciones') // ANTES: @Post('functions')
  createFunction(@Body() functionData: Record<string, unknown>) {
    return this.moviesService.createFunction(functionData);
  }

  @Put('peliculas/:movieId') // ANTES: @Put(':movieId')
  updateMovie(
    @Param('movieId') movieId: string, 
    @Body() movieData: Record<string, unknown>
  ) {
    return this.moviesService.updateMovie(+movieId, movieData);
  }

  @Delete('peliculas/:movieId') // ANTES: @Delete(':movieId')
  deleteMovie(@Param('movieId') movieId: string) {
    return this.moviesService.deleteMovie(+movieId);
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type?: string
  ) {
    return this.moviesService.uploadMedia(file, type);
  }

  @Get('funciones/:functionId/butacas')
  getButacas(@Param('functionId') functionId: string) {
    return this.moviesService.getShowtimeById(+functionId);
  }
  @Post('funciones/:functionId/butacas/reserve')
  reserveButaca(@Param('functionId') functionId: string, @Body() body: Record<string, unknown>) {
    return this.moviesService.reserveSeat(+functionId, String(body.fila), Number(body.numero));
  }

  @Post('funciones/:functionId/butacas/release')
  releaseButaca(@Param('functionId') functionId: string, @Body() body: Record<string, unknown>) {
    return this.moviesService.releaseSeat(+functionId, String(body.fila), Number(body.numero));
  }
  @Get('peliculas/:movieId/funciones')
  getShowtimes(@Param('movieId') movieId: string) {
    return this.moviesService.getShowtimes(+movieId);
  }
  @Get('funciones')
async getAllFunctions() {
  // Primero debes agregar el método en MoviesService para hacer esta llamada
  return this.moviesService.getAllFunctions();
}

  @Get('salas')
  getAllRooms() {
    return this.moviesService.getAllRooms();
  }

} 