package com.backend.CineFlow.CineFlow.cartelera.controller;

import com.backend.CineFlow.CineFlow.cartelera.dto.BillboardMovieResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.CreateFunctionRequest;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionSeatsResponse;
import com.backend.CineFlow.CineFlow.cartelera.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cartelera")
@Tag(name = "Cartelera", description = "Operaciones de cartelera, funciones y butacas")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/peliculas/cartelera")
    @Operation(summary = "Obtener cartelera", description = "Devuelve la lista de películas disponibles en cartelera.")
    public List<BillboardMovieResponse> getBillboard() {
        return catalogService.obtenerCartelera();
    }
    
    @GetMapping("/peliculas")
    @Operation(summary = "Obtener todas las películas", description = "Devuelve todas las películas registradas (visibles y ocultas).")
    public List<BillboardMovieResponse> getAllMovies() {
        return catalogService.obtenerTodasLasPeliculas();
    }
    
    @GetMapping("/peliculas/{id}")
    @Operation(summary = "Obtener película por ID", description = "Devuelve los detalles de una película específica.")
    public ResponseEntity<BillboardMovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.obtenerPeliculaPorId(id));
    }

    @PostMapping("/peliculas")
    @Operation(summary = "Crear película", description = "Registra una nueva película en cartelera.")
    public ResponseEntity<BillboardMovieResponse> createMovie(@RequestBody Map<String, Object> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.crearPelicula(request));
    }

    @PostMapping(value = "/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir archivo", description = "Guarda una imagen o banner y devuelve su URL pública.")
    public ResponseEntity<Map<String, Object>> uploadMovieMedia(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "type", defaultValue = "assets") String type
    ) {
        try {
            String url = catalogService.guardarArchivo(type, file.getOriginalFilename(), file.getBytes());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "url", url
            ));
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo leer el archivo cargado", exception);
        } catch (Exception e) {
            // ¡ESTO ES NUEVO! Atrapamos cualquier otro error e imprimimos la causa real en la consola
            System.err.println("🔥 ERROR CRÍTICO AL SUBIR IMAGEN: " + e.getMessage());
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PutMapping("/peliculas/{id}")
    @Operation(summary = "Actualizar película", description = "Actualiza los datos de una película existente.")
    public ResponseEntity<BillboardMovieResponse> updateMovie(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(catalogService.actualizarPelicula(id, request));
    }
    
    @DeleteMapping("/peliculas/{id}")
    @Operation(summary = "Eliminar película", description = "Elimina una película de la base de datos.")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        catalogService.eliminarPelicula(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/peliculas/{id}/visibility")
    @Operation(summary = "Cambiar visibilidad de película", description = "Alterna la visibilidad de una película en cartelera.")
    public ResponseEntity<BillboardMovieResponse> toggleMovieVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.toggleVisibilidadPelicula(id));
    }

    @GetMapping("/funciones/{id}/butacas")
    @Operation(summary = "Consultar butacas de función", description = "Devuelve la disponibilidad de butacas para una función específica.")
    public FunctionSeatsResponse getFunctionSeats(@PathVariable Long id) {
        return catalogService.obtenerButacasFuncion(id);
    }

    @PostMapping("/funciones/{id}/butacas/reserve")
    @Operation(summary = "Reservar butaca", description = "Marca una butaca como reservada para evitar que otros usuarios la seleccionen.")
    public ResponseEntity<Map<String, Object>> reserveSeat(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String fila = String.valueOf(request.get("fila"));
        Integer numero = Integer.valueOf(String.valueOf(request.get("numero")));
        boolean ok = catalogService.reservarButaca(id, fila, numero);
        if (ok) return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", "Butaca no disponible"));
    }

    @PostMapping("/funciones/{id}/butacas/release")
    @Operation(summary = "Liberar butaca", description = "Libera una butaca previamente reservada (ej: al cancelar selección).")
    public ResponseEntity<Map<String, Object>> releaseSeat(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String fila = String.valueOf(request.get("fila"));
        Integer numero = Integer.valueOf(String.valueOf(request.get("numero")));
        boolean ok = catalogService.liberarButaca(id, fila, numero);
        if (ok) return ResponseEntity.ok(Map.of("success", true));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", "No se pudo liberar la butaca"));
    }

    @PostMapping("/funciones")
    @Operation(summary = "Crear función", description = "Registra una nueva función en cartelera.")
    public ResponseEntity<FunctionResponse> createFunction(@RequestBody CreateFunctionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.crearFuncion(request));
    }
    @GetMapping("/peliculas/{movieId}/funciones")
public ResponseEntity<List<FunctionResponse>> obtenerFuncionesPorPelicula(@PathVariable Long movieId) {
    List<FunctionResponse> funciones = catalogService.obtenerFuncionesPorPelicula(movieId);
    return ResponseEntity.ok(funciones);
}
@GetMapping("/funciones")
@Operation(summary = "Obtener todas las funciones", description = "Lista todas las funciones disponibles.")
public ResponseEntity<List<FunctionResponse>> getAllFunctions() {
    // Nota: Necesitarías crear este método en tu CatalogService primero
    return ResponseEntity.ok(catalogService.obtenerTodasLasFunciones()); 
}
@GetMapping("/funciones/{id}")
@Operation(summary = "Obtener función por ID", description = "Devuelve los datos de una función específica, incluyendo precio y sala.")
public ResponseEntity<FunctionResponse> getFunctionById(@PathVariable Long id) {
    return ResponseEntity.ok(catalogService.obtenerFuncionPorId(id));
}

    @GetMapping("/salas")
    @Operation(summary = "Obtener salas", description = "Lista todas las salas registradas con su tipo y precio base.")
    public ResponseEntity<List<com.backend.CineFlow.CineFlow.cartelera.dto.RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(catalogService.obtenerTodasLasSalas());
    }
    @PostMapping("/funciones/{id}/butacas/seed")
@Operation(summary = "Sembrar butacas retroactivamente", description = "Genera las butacas de una función creada antes del fix. Idempotente.")
public ResponseEntity<Map<String, Object>> seedButacas(@PathVariable Long id) {
    boolean creadas = catalogService.sembrarButacasSiFaltan(id);
    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", creadas ? "Butacas generadas" : "La función ya tenía butacas"
    ));
}
}