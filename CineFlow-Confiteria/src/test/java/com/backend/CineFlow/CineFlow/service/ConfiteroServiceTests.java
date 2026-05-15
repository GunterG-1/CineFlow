package com.backend.CineFlow.CineFlow.service;


import com.backend.CineFlow.CineFlow.dto.PedidoDTO;
import com.backend.CineFlow.CineFlow.model.Combo;
import com.backend.CineFlow.CineFlow.model.Pedido;
import com.backend.CineFlow.CineFlow.repository.ComboRepositorio;
import com.backend.CineFlow.CineFlow.repository.PedidoRepositorio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfiiteroServicioTest {

    @Mock
    private ComboRepositorio comboRepositorio;

    @Mock
    private PedidoRepositorio pedidoRepositorio;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ConfiiteroServicio confiiteroServicio;

    @Test
    void crearPedidoDescuentaInventarioYDevuelveDto() {
        Combo combo = Combo.builder()
                .id(1L)
                .nombre("Combo Clasico")
                .precio(13.99)
                .cantidadDisponible(10)
                .activo(true)
                .build();

        when(comboRepositorio.findById(1L)).thenReturn(Optional.of(combo));
        when(pedidoRepositorio.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido pedido = invocation.getArgument(0);
            pedido.setId(99L);
            return pedido;
        });
        when(modelMapper.map(any(Pedido.class), eq(PedidoDTO.class))).thenAnswer(invocation -> {
            Pedido pedido = invocation.getArgument(0);
            return PedidoDTO.builder()
                    .id(pedido.getId())
                    .numeroTicket(pedido.getNumeroTicket())
                    .idUsuario(pedido.getIdUsuario())
                    .comboId(pedido.getCombo().getId())
                    .cantidad(pedido.getCantidad())
                    .estado(pedido.getEstado().name())
                    .precioTotal(pedido.getPrecioTotal())
                    .fechaCreacion(pedido.getFechaCreacion())
                    .observaciones(pedido.getObservaciones())
                    .build();
        });

        PedidoDTO request = PedidoDTO.builder()
                .comboId(1L)
                .cantidad(2)
                .idUsuario(7L)
                .observaciones("sin hielo")
                .build();

        PedidoDTO response = confiiteroServicio.crearPedido(request);

        assertNotNull(response.getNumeroTicket());
        assertEquals(99L, response.getId());
        assertEquals(1L, response.getComboId());
        assertEquals(2, response.getCantidad());
        assertEquals(8, combo.getCantidadDisponible());
        verify(comboRepositorio).save(combo);
        verify(pedidoRepositorio).save(any(Pedido.class));
    }

    @Test
    void cancelarPedidoDevuelveElStockAlCombo() {
        Combo combo = Combo.builder()
                .id(3L)
                .nombre("Snacks Salados")
                .precio(6.99)
                .cantidadDisponible(5)
                .activo(true)
                .build();

        Pedido pedido = Pedido.builder()
                .id(10L)
                .numeroTicket("TKT-1")
                .idUsuario(7L)
                .combo(combo)
                .cantidad(2)
                .estado(Pedido.EstadoPedido.PENDIENTE)
                .precioTotal(13.98)
                .fechaCreacion(LocalDateTime.now())
                .build();

        when(pedidoRepositorio.findById(10L)).thenReturn(Optional.of(pedido));
        when(pedidoRepositorio.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));

        when(modelMapper.map(any(Pedido.class), eq(PedidoDTO.class))).thenAnswer(invocation -> {
            Pedido p = invocation.getArgument(0);
            return PedidoDTO.builder()
                .id(p.getId())
                .numeroTicket(p.getNumeroTicket())
                .idUsuario(p.getIdUsuario())
                .comboId(p.getCombo().getId())
                .cantidad(p.getCantidad())
                .estado(p.getEstado().name())
                .precioTotal(p.getPrecioTotal())
                .fechaCreacion(p.getFechaCreacion())
                .observaciones(p.getObservaciones())
                .build();
        });

        PedidoDTO response = confiiteroServicio.cancelarPedido(10L);

        assertEquals("CANCELADO", response.getEstado());
        assertEquals(7, combo.getCantidadDisponible());
        verify(comboRepositorio).save(combo);
        verify(pedidoRepositorio).save(pedido);
    }
}