package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.SolicitudReserva;
import com.backend.CineFlow.CineFlow.service.ServicioEntradas;
import com.backend.CineFlow.CineFlow.dto.SolicitudCompra;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/entradas")
@Tag(name = "Entradas", description = "Operaciones de compra, reserva y disponibilidad de tickets")
public class ControladorEntradas {
    
    @Autowired
    private ServicioEntradas servicioEntradas;
    
    @PatchMapping("/reservar")
    @Operation(summary = "Reservar asientos", description = "Marca temporalmente los asientos enviados como reservados para una función.")
    public ResponseEntity<Map<String, Object>> reservarAsientos(@RequestBody SolicitudReserva solicitud) {
        Map<String, Object> respuesta = servicioEntradas.reservarAsientos(solicitud);
        return ResponseEntity.ok(respuesta);
    }
    
    @PostMapping("/pagar")
    @Operation(summary = "Procesar pago", description = "Confirma la compra de entradas, genera códigos QR y publica eventos de pago.")
    public ResponseEntity<Map<String, Object>> procesarPago(@RequestBody SolicitudCompra solicitud) {
        Map<String, Object> respuesta = servicioEntradas.procesarPago(solicitud);
        if ((Boolean) respuesta.get("exito")) {
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }
    }

    @PostMapping("/reclamar-cumpleanos")
    @Operation(summary = "Reclamar entradas de cumpleaños", description = "Entrega entradas gratis cuando el usuario cumple años y cumple con las reglas de negocio.")
    public ResponseEntity<Map<String, Object>> reclamarCumpleanos(@RequestBody Map<String, Object> body) {
        Long idUsuario = body.get("idUsuario") == null ? null : Long.parseLong(body.get("idUsuario").toString());
        Map<String, Object> respuesta = servicioEntradas.reclamarCumpleanos(idUsuario);
        if ((Boolean) respuesta.getOrDefault("exito", false)) {
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }
    }
    
    @GetMapping("/{id}/codigoqr")
    @Operation(summary = "Obtener código QR", description = "Consulta el código QR asociado a una entrada vendida.")
    public ResponseEntity<Map<String, Object>> obtenerCodigoQR(@PathVariable Long id) {
        Map<String, Object> respuesta = servicioEntradas.obtenerCodigoQR(id);
        if ((Boolean) respuesta.get("exito")) {
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        }
    }

    @GetMapping("/disponibilidad")
    @Operation(summary = "Consultar disponibilidad", description = "Devuelve los asientos no disponibles para una función, por clave, id de función o número de película.")
    public ResponseEntity<Map<String, Object>> obtenerDisponibilidad(
        @RequestParam(required = false) String claveFuncion,
        @RequestParam(required = false) Long idFuncion,
        @RequestParam(required = false) String numeroPelicula
    ) {
        return ResponseEntity.ok(servicioEntradas.obtenerAsientosNoDisponibles(claveFuncion, idFuncion, numeroPelicula));
    }
}
