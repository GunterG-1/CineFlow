package com.backend.CineFlow.CineFlow.event;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class TicketPaidEvent {

    private String eventId;
    private String eventType;
    private Long idFuncion;
    private String numeroPelicula;
    private Long idUsuario;
    private String emailComprador;
    private List<String> asientos;
    private List<Long> ticketIds;
    private List<String> codigosQR;
    private LocalDateTime occurredAt;
}
