package com.backend.CineFlow.CineFlow.event;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class TicketReservedEvent {

    private String eventId;
    private String eventType;
    private Long idFuncion;
    private String numeroPelicula;
    private List<String> asientos;
    private LocalDateTime occurredAt;
}