package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.cartelera.service.SeatSettlementService;
import com.backend.CineFlow.CineFlow.event.TicketReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketReservedEventListener {

    private final SeatSettlementService seatSettlementService;

    @RabbitListener(queues = "${app.events.ticket-reserved.cartelera-queue:ticket.reserved.cartelera.queue}")
    public void onTicketReserved(TicketReservedEvent event) {
        log.info("Evento Ticket.Reserved recibido en Cartelera. eventId={}", event.getEventId());
        seatSettlementService.marcarButacasReservadas(event);
    }
}