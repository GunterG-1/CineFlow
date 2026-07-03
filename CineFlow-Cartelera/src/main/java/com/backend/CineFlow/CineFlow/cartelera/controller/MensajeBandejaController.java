package com.backend.CineFlow.CineFlow.cartelera.controller;

import com.backend.CineFlow.CineFlow.cartelera.dto.MensajeBandeja;
import com.backend.CineFlow.CineFlow.cartelera.service.MensajeBandejaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
import java.util.Map;

/**
 * Expone la bandeja de mensajes de este microservicio (Cartelera).
 * El BFF consulta este endpoint ademas del de Entradas y combina ambas listas.
 */
@RestController
@RequestMapping("/api/mensajes")
@RequiredArgsConstructor
public class MensajeBandejaController {

    private final MensajeBandejaService mensajeBandejaService;

    @GetMapping
    public ResponseEntity<List<MensajeBandeja>> listar() {
        return ResponseEntity.ok(mensajeBandejaService.obtenerTodos());
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumen() {
        return ResponseEntity.ok(Map.of("total", mensajeBandejaService.contar()));
    }

    @DeleteMapping
    public ResponseEntity<Void> limpiar() {
        mensajeBandejaService.limpiar();
        return ResponseEntity.noContent().build();
    }
}
