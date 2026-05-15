package com.backend.CineFlow.CineFlow.cartelera.controller;

import com.backend.CineFlow.CineFlow.cartelera.dto.BillboardMovieResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.CreateFunctionRequest;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionSeatsResponse;
import com.backend.CineFlow.CineFlow.cartelera.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/funciones/{id}/butacas")
    @Operation(summary = "Consultar butacas de función", description = "Devuelve la disponibilidad de butacas para una función específica.")
    public FunctionSeatsResponse getFunctionSeats(@PathVariable Long id) {
        return catalogService.obtenerButacasFuncion(id);
    }

    @PostMapping("/funciones")
    @Operation(summary = "Crear función", description = "Registra una nueva función en cartelera.")
    public ResponseEntity<FunctionResponse> createFunction(@RequestBody CreateFunctionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.crearFuncion(request));
    }
}