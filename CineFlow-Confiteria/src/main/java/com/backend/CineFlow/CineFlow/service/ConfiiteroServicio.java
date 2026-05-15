package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.ComboDTO;
import com.backend.CineFlow.CineFlow.dto.PedidoDTO;
import com.backend.CineFlow.CineFlow.dto.VerificacionDTO;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.model.Combo;
import com.backend.CineFlow.CineFlow.model.Pedido;
import com.backend.CineFlow.CineFlow.repository.ComboRepositorio;
import com.backend.CineFlow.CineFlow.repository.PedidoRepositorio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConfiiteroServicio {
    
    private final ComboRepositorio comboRepositorio;
    private final PedidoRepositorio pedidoRepositorio;
    private final ModelMapper modelMapper;
    
    /**
     * Obtiene el menú de combos disponibles
     * GET /concessions/menu
     */
    public List<ComboDTO> obtenerMenu() {
        return comboRepositorio.findByActivoTrue()
            .stream()
            .map(combo -> modelMapper.map(combo, ComboDTO.class))
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un combo específico por ID
     */
    public ComboDTO obtenerComboPorId(@NonNull Long id) {
        Objects.requireNonNull(id, "id no puede ser null");

        Combo combo = comboRepositorio.findById(id)
            .orElseThrow(() -> new RuntimeException("Combo no encontrado con id: " + id));
        Objects.requireNonNull(combo, "Combo recuperado no puede ser null");
        return modelMapper.map(combo, ComboDTO.class);
    }
    
    /**
     * Obtiene combos disponibles (con cantidad > 0)
     */
    public List<ComboDTO> obtenerCombosDisponibles() {
        return comboRepositorio.findByCantidadDisponibleGreaterThan(0)
            .stream()
            .filter(combo -> combo.getActivo())
            .map(combo -> modelMapper.map(combo, ComboDTO.class))
            .collect(Collectors.toList());
    }
    
    /**
     * Crea un nuevo pedido
     */
    public PedidoDTO crearPedido(PedidoDTO pedidoDTO) {
        Objects.requireNonNull(pedidoDTO, "pedidoDTO no puede ser null");
        Objects.requireNonNull(pedidoDTO.getComboId(), "comboId no puede ser null");

        // Validar que el combo existe
        Combo combo = comboRepositorio.findById(pedidoDTO.getComboId())
            .orElseThrow(() -> new RuntimeException("Combo no encontrado con id: " + pedidoDTO.getComboId()));
        
        // Validar cantidad disponible
        if (combo.getCantidadDisponible() < pedidoDTO.getCantidad()) {
            throw new RuntimeException("Cantidad solicitada no disponible");
        }
        
        // Generar número de ticket único
        String numeroTicket = generarNumeroTicket();
        Objects.requireNonNull(numeroTicket, "numeroTicket no puede ser null");
        
        // Crear el pedido
        Pedido pedido = Pedido.builder()
            .numeroTicket(numeroTicket)
            .idUsuario(pedidoDTO.getIdUsuario())
            .combo(combo)
            .cantidad(pedidoDTO.getCantidad())
            .estado(Pedido.EstadoPedido.PENDIENTE)
            .precioTotal(combo.getPrecio() * pedidoDTO.getCantidad())
            .fechaCreacion(Objects.requireNonNull(LocalDateTime.now()))
            .observaciones(pedidoDTO.getObservaciones())
            .build();
        Objects.requireNonNull(pedido, "Pedido construido no puede ser null");
        
        Pedido pedidoGuardado = pedidoRepositorio.save(pedido);
        Objects.requireNonNull(pedidoGuardado, "Pedido guardado no puede ser null");
        
        // Actualizar cantidad disponible del combo
        combo.setCantidadDisponible(combo.getCantidadDisponible() - pedidoDTO.getCantidad());
        comboRepositorio.save(combo);
        
        return modelMapper.map(pedidoGuardado, PedidoDTO.class);
    }
    
    /**
     * Actualiza el estado de un pedido
     * PATCH /concessions/orders/{id}/status
     */
    public PedidoDTO actualizarEstadoPedido(@NonNull Long idPedido, @NonNull String nuevoEstado) {
        Objects.requireNonNull(idPedido, "idPedido no puede ser null");
        Objects.requireNonNull(nuevoEstado, "nuevoEstado no puede ser null");

        Pedido pedido = pedidoRepositorio.findById(idPedido)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + idPedido));
        
        try {
            Pedido.EstadoPedido estadoPedido = Pedido.EstadoPedido.valueOf(nuevoEstado.toUpperCase());
            pedido.setEstado(estadoPedido);
            pedido.setFechaActualizacion(Objects.requireNonNull(LocalDateTime.now()));
            
            // Si se marca como entregado, registrar la fecha de entrega
            if (estadoPedido == Pedido.EstadoPedido.ENTREGADO) {
                pedido.setFechaEntrega(Objects.requireNonNull(LocalDateTime.now()));
            }
            
            Pedido pedidoActualizado = pedidoRepositorio.save(pedido);
            return modelMapper.map(pedidoActualizado, PedidoDTO.class);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de pedido inválido: " + nuevoEstado);
        }
    }
    
    /**
     * Verifica un ticket digital para asegurar la entrega correcta
     * POST /concessions/verify
     */
    public VerificacionDTO verificarTicket(@NonNull String numeroTicket) {
        Objects.requireNonNull(numeroTicket, "numeroTicket no puede ser null");

        Pedido pedido = pedidoRepositorio.findByNumeroTicket(numeroTicket)
            .orElseThrow(() -> new RuntimeException("Ticket no encontrado: " + numeroTicket));
        
        boolean verificado = pedido.getEstado() != Pedido.EstadoPedido.CANCELADO;
        
        return VerificacionDTO.builder()
            .numeroTicket(numeroTicket)
            .idPedido(pedido.getId())
            .verificado(verificado)
            .mensaje(verificado ? "Ticket verificado correctamente" : "Ticket cancelado")
            .pedido(modelMapper.map(pedido, PedidoDTO.class))
            .build();
    }
    
    /**
     * Obtiene los pedidos de un usuario
     */
    public List<PedidoDTO> obtenerPedidosPorUsuario(@NonNull Long idUsuario) {
        Objects.requireNonNull(idUsuario, "idUsuario no puede ser null");

        return pedidoRepositorio.findByIdUsuario(idUsuario)
            .stream()
            .map(pedido -> modelMapper.map(pedido, PedidoDTO.class))
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene todos los pedidos en un estado específico
     */
    public List<PedidoDTO> obtenerPedidosPorEstado(@NonNull String estado) {
        Objects.requireNonNull(estado, "estado no puede ser null");

        try {
            Pedido.EstadoPedido estadoPedido = Pedido.EstadoPedido.valueOf(estado.toUpperCase());
            return pedidoRepositorio.findByEstado(estadoPedido)
                .stream()
                .map(pedido -> modelMapper.map(pedido, PedidoDTO.class))
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de pedido inválido: " + estado);
        }
    }
    
    /**
     * Obtiene un pedido por ID
     */
    public PedidoDTO obtenerPedidoPorId(@NonNull Long idPedido) {
        Objects.requireNonNull(idPedido, "idPedido no puede ser null");

        Pedido pedido = pedidoRepositorio.findById(idPedido)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + idPedido));
        Objects.requireNonNull(pedido, "Pedido recuperado no puede ser null");
        return modelMapper.map(pedido, PedidoDTO.class);
    }
    
    /**
     * Cancela un pedido
     */
    public PedidoDTO cancelarPedido(@NonNull Long idPedido) {
        Objects.requireNonNull(idPedido, "idPedido no puede ser null");

        Pedido pedido = pedidoRepositorio.findById(idPedido)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + idPedido));
        
        // Solo se pueden cancelar pedidos que no estén entregados
        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO) {
            throw new RuntimeException("No se puede cancelar un pedido ya entregado");
        }
        
        pedido.setEstado(Pedido.EstadoPedido.CANCELADO);
        pedido.setFechaActualizacion(Objects.requireNonNull(LocalDateTime.now()));
        
        // Devolver la cantidad disponible del combo
        Combo combo = pedido.getCombo();
        combo.setCantidadDisponible(combo.getCantidadDisponible() + pedido.getCantidad());
        comboRepositorio.save(combo);
        
        Pedido pedidoActualizado = pedidoRepositorio.save(pedido);
        return modelMapper.map(pedidoActualizado, PedidoDTO.class);
    }

    public void iniciarPreparacionPorPago(@NonNull TicketPaidEvent event) {
        Objects.requireNonNull(event, "event no puede ser null");

        Long idUsuario = event.getIdUsuario();
        if (idUsuario == null) {
            log.warn("Ticket.Paid recibido sin idUsuario. eventId={}", event.getEventId());
            return;
        }

        List<Pedido.EstadoPedido> estadosPendientes = Arrays.asList(
            Pedido.EstadoPedido.PENDIENTE,
            Pedido.EstadoPedido.CONFIRMADO
        );

        List<Pedido> pedidos = pedidoRepositorio.findByIdUsuarioAndEstadoIn(idUsuario, estadosPendientes);
        if (pedidos.isEmpty()) {
            log.info("Sin pedidos pendientes para idUsuario={} en eventId={}", idUsuario, event.getEventId());
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Pedido pedido : pedidos) {
            pedido.setEstado(Pedido.EstadoPedido.EN_PREPARACION);
            pedido.setFechaActualizacion(now);
        }

        pedidoRepositorio.saveAll(pedidos);
        log.info("Pedidos actualizados a EN_PREPARACION por Ticket.Paid. eventId={}, idUsuario={}, pedidos={}",
            event.getEventId(), idUsuario, pedidos.size());
    }
    
    /**
     * Genera un número de ticket único
     */
    private @NonNull String generarNumeroTicket() {
        String t = "TKT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return Objects.requireNonNull(t);
    }
}
