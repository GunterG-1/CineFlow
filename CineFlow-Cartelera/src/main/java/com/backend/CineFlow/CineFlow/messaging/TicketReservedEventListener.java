package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.cartelera.service.SeatSettlementService;
import com.backend.CineFlow.CineFlow.cartelera.dto.MensajeBandeja;
import com.backend.CineFlow.CineFlow.event.TicketReservedEvent;
import com.backend.CineFlow.CineFlow.cartelera.service.MensajeBandejaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketReservedEventListener {

    private final SeatSettlementService seatSettlementService;
    private final MensajeBandejaService mensajeBandejaService;

    @Value("${app.events.ticket-reserved.cartelera-queue:ticket.reserved.cartelera.queue}")
    private String colaCartelera;

    @RabbitListener(queues = "${app.events.ticket-reserved.cartelera-queue:ticket.reserved.cartelera.queue}")
    public void onTicketReserved(TicketReservedEvent event) {
        log.info("Evento Ticket.Reserved recibido en Cartelera. eventId={}", event.getEventId());
        seatSettlementService.marcarButacasReservadas(event);

        mensajeBandejaService.registrar(MensajeBandeja.builder()
            .cola(colaCartelera)
            .tipoEvento("TicketReserved")
            .eventId(event.getEventId())
            .payloadEvento(event.toString())
            .estadoNotificacion("NO_APLICA")
            .build());
    }
}