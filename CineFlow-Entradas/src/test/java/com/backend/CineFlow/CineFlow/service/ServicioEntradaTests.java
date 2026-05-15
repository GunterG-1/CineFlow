package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.SolicitudCompra;
import com.backend.CineFlow.CineFlow.dto.SolicitudReserva;
import com.backend.CineFlow.CineFlow.model.EstadoTicket;
import com.backend.CineFlow.CineFlow.model.Ticket;
import com.backend.CineFlow.CineFlow.repository.RepositorioTicket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicioEntradasTest {

    @Mock
    private RepositorioTicket repositorioTicket;

    @Mock
    private EventBusService eventBusService;

    @InjectMocks
    private ServicioEntradas servicioEntradas;

    private Ticket seat;

    @BeforeEach
    void setUp() {
        seat = new Ticket();
        seat.setId(1L);
        seat.setNumeroAsiento("A1");
        seat.setNumeroPelicula("1");
        seat.setClaveFuncion("FUNCION-1");
        seat.setNombrePelicula("Prueba");
        seat.setHoraPelicula("20:00");
        seat.setSala("Sala 1");
        seat.setPrecio(5.99);
        seat.setEstado(EstadoTicket.DISPONIBLE);
    }

    @Test
    void reservarAsientos_whenSeatAvailable_reservesSeat() {
        SolicitudReserva solicitud = new SolicitudReserva(1L, "1", List.of("A1"));
        when(repositorioTicket.buscarPorFuncionYAsiento(anyString(), eq("A1")))
                .thenReturn(Optional.of(seat));
        when(repositorioTicket.save(any(Ticket.class))).thenAnswer(i -> i.getArgument(0));

        Map<String, Object> resp = servicioEntradas.reservarAsientos(solicitud);

        assertTrue((Boolean) resp.get("exito"));
        assertEquals(1, resp.get("asientosReservados"));
        verify(repositorioTicket, atLeastOnce()).save(any(Ticket.class));
        verify(eventBusService, atMostOnce()).publicarTicketReserved(any());
    }

    @Test
    void procesarPago_withMetodoPago_succeeds() {
        SolicitudCompra solicitud = new SolicitudCompra(1L, "1", 10L, List.of("A1"), "test@correo.com", null, "1234-****");
        solicitud.setMetodoPago("CARD");

        when(repositorioTicket.buscarPorFuncionYAsiento(anyString(), eq("A1")))
                .thenReturn(Optional.of(seat));
        when(repositorioTicket.save(any(Ticket.class))).thenAnswer(i -> {
            Ticket t = i.getArgument(0);
            if (t.getId() == null) t.setId(2L);
            return t;
        });

        Map<String, Object> resp = servicioEntradas.procesarPago(solicitud);

        assertTrue((Boolean) resp.get("exito"));
        assertEquals(1, resp.get("totalEntradas"));
        assertNotNull(resp.get("codigosQR"));
        verify(repositorioTicket, atLeastOnce()).save(any(Ticket.class));
        verify(eventBusService, atMostOnce()).publicarTicketPaid(any());
    }
}
