package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.service.ConfiiteroServicio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketPaidEventListener {

    private final ConfiiteroServicio confiiteroServicio;

    @RabbitListener(queues = "${app.events.ticket-paid.confiteria-queue:ticket.paid.confiteria.queue}")
    public void onTicketPaid(TicketPaidEvent event) {
        log.info("Evento Ticket.Paid recibido en Confiteria. eventId={}, idUsuario={}", event.getEventId(), event.getIdUsuario());
        confiiteroServicio.iniciarPreparacionPorPago(event);
    }
}
