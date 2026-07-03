package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.cartelera.service.SeatSettlementService;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketPaidEventListener {

    private final SeatSettlementService seatSettlementService;

    @RabbitListener(queues = "${app.events.ticket-paid.cartelera-queue:ticket.paid.cartelera.queue}")
    public void onTicketPaid(TicketPaidEvent event) {
        log.info("Evento Ticket.Paid recibido en Cartelera. eventId={}", event.getEventId());
        seatSettlementService.descontarButacasPorPago(event);
    }
}
