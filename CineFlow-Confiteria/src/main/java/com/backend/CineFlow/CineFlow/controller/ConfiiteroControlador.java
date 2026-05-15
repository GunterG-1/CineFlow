package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.ComboDTO;
import com.backend.CineFlow.CineFlow.dto.PedidoDTO;
import com.backend.CineFlow.CineFlow.dto.VerificacionDTO;
import com.backend.CineFlow.CineFlow.service.ConfiiteroServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/confiteria")
@RequiredArgsConstructor
@Tag(name = "Confitería", description = "Operaciones para menú, pedidos, verificación y estado de confitería")
public class ConfiiteroControlador {
    
    private final ConfiiteroServicio confiiteroServicio;
    
   
    @GetMapping("/menu")
    @Operation(summary = "Obtener menú", description = "Lista todos los combos disponibles en la confitería.")
    public ResponseEntity<List<ComboDTO>> obtenerMenu() {
        try {
            List<ComboDTO> combos = confiiteroServicio.obtenerMenu();
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
   
    @GetMapping("/menu/disponibles")
    @Operation(summary = "Obtener combos disponibles", description = "Devuelve solo los combos con stock disponible.")
    public ResponseEntity<List<ComboDTO>> obtenerCombosDisponibles() {
        try {
            List<ComboDTO> combos = confiiteroServicio.obtenerCombosDisponibles();
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
  
    @GetMapping("/menu/{id}")
    @Operation(summary = "Obtener combo por id", description = "Busca un combo por su identificador.")
    public ResponseEntity<?> obtenerComboPorId(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            ComboDTO combo = confiiteroServicio.obtenerComboPorId(id);
            return ResponseEntity.ok(combo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
   
    @PostMapping("/ordenar")
    @Operation(summary = "Crear pedido", description = "Crea un pedido de confitería a partir de un combo y cantidad.")
    public ResponseEntity<?> crearPedido(@RequestBody @NonNull PedidoDTO pedidoDTO) {
        try {
            Objects.requireNonNull(pedidoDTO, "pedidoDTO no puede ser null");
            PedidoDTO pedidoCreado = confiiteroServicio.crearPedido(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCreado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
  
    @GetMapping("/order/{id}")
    @Operation(summary = "Obtener pedido por id", description = "Consulta el detalle de un pedido de confitería.")
    public ResponseEntity<?> obtenerPedidoPorId(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            PedidoDTO pedido = confiiteroServicio.obtenerPedidoPorId(id);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
   
    @PatchMapping("/order/{id}/estado")
    @Operation(summary = "Actualizar estado de pedido", description = "Cambia el estado de un pedido de confitería.")
    public ResponseEntity<?> actualizarEstadoPedido(
            @PathVariable @NonNull Long id,
            @RequestParam @NonNull String estado) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            Objects.requireNonNull(estado, "estado no puede ser null");
            PedidoDTO pedidoActualizado = confiiteroServicio.actualizarEstadoPedido(id, estado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    
    @PostMapping("/verificar")
    @Operation(summary = "Verificar ticket", description = "Valida un ticket digital para entrega de confitería.")
    public ResponseEntity<?> verificarTicket(@RequestParam @NonNull String numeroTicket) {
        try {
            Objects.requireNonNull(numeroTicket, "numeroTicket no puede ser null");
            VerificacionDTO verificacion = confiiteroServicio.verificarTicket(numeroTicket);
            return ResponseEntity.ok(verificacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    
    @GetMapping("/order/usuario/{idUsuario}")
    @Operation(summary = "Pedidos por usuario", description = "Obtiene todos los pedidos de confitería de un usuario.")
    public ResponseEntity<List<PedidoDTO>> obtenerPedidosPorUsuario(@PathVariable @NonNull Long idUsuario) {
        try {
            Objects.requireNonNull(idUsuario, "idUsuario no puede ser null");
            List<PedidoDTO> pedidos = confiiteroServicio.obtenerPedidosPorUsuario(idUsuario);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
 
    @GetMapping("/order/estado/{estado}")
    @Operation(summary = "Pedidos por estado", description = "Filtra pedidos de confitería por estado.")
    public ResponseEntity<?> obtenerPedidosPorEstado(@PathVariable @NonNull String estado) {
        try {
            Objects.requireNonNull(estado, "estado no puede ser null");
            List<PedidoDTO> pedidos = confiiteroServicio.obtenerPedidosPorEstado(estado);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    
    @DeleteMapping("/order/{id}")
    @Operation(summary = "Cancelar pedido", description = "Cancela un pedido de confitería si todavía es posible.")
    public ResponseEntity<?> cancelarPedido(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            PedidoDTO pedidoCancelado = confiiteroServicio.cancelarPedido(id);
            return ResponseEntity.ok(pedidoCancelado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
   
    @GetMapping("/servicio")
    @Operation(summary = "Estado del servicio", description = "Devuelve un pequeño healthcheck del microservicio de confitería.")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("servicio", "Confitería");
        return ResponseEntity.ok(response);
    }
}
