package com.backend.CineFlow.CineFlow.cartelera.service;

import com.backend.CineFlow.CineFlow.cartelera.dto.*;
import java.util.List;
import java.util.Map;

public interface CatalogService {
    List<BillboardMovieResponse> obtenerCartelera();
    List<BillboardMovieResponse> obtenerTodasLasPeliculas();
    List<FunctionResponse> obtenerTodasLasFunciones();
    List<RoomResponse> obtenerTodasLasSalas();
    BillboardMovieResponse obtenerPeliculaPorId(Long id);
    List<FunctionResponse> obtenerFuncionesPorPelicula(Long peliculaId);
    FunctionSeatsResponse obtenerButacasFuncion(Long functionId);
    FunctionResponse crearFuncion(CreateFunctionRequest request);
    // Reservar una butaca (marca como RESERVED si está AVAILABLE)
    boolean reservarButaca(Long funcionId, String fila, Integer numero);
    // Liberar una butaca reservada (marca como AVAILABLE si está RESERVED)
    boolean liberarButaca(Long funcionId, String fila, Integer numero);
    BillboardMovieResponse crearPelicula(Map<String, Object> request);
    String guardarArchivo(String type, String originalFilename, byte[] content);
    BillboardMovieResponse actualizarPelicula(Long id, Map<String, Object> request);
    void eliminarPelicula(Long id);
    BillboardMovieResponse toggleVisibilidadPelicula(Long id);
    boolean sembrarButacasSiFaltan(Long funcionId);
     FunctionResponse obtenerFuncionPorId(Long id); 
    
    
}