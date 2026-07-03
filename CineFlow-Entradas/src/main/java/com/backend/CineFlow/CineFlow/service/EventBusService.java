package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.event.TicketReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventBusService {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.events.exchange:cineflow.events.exchange}")
    private String exchange;

    @Value("${app.events.ticket-paid.routing-key:ticket.paid}")
    private String ticketPaidRoutingKey;

    @Value("${app.events.ticket-reserved.routing-key:ticket.reserved}")
    private String ticketReservedRoutingKey;

    public void publicarTicketPaid(TicketPaidEvent event) {
        log.info("Publicando evento Ticket.Paid. eventId={}, exchange={}, routingKey={}",
            event != null ? event.getEventId() : "N/A", exchange, ticketPaidRoutingKey);
        rabbitTemplate.convertAndSend(exchange, ticketPaidRoutingKey, event);
    }

    public void publicarTicketReserved(TicketReservedEvent event) {
        log.info("Publicando evento Ticket.Reserved. eventId={}, exchange={}, routingKey={}",
            event != null ? event.getEventId() : "N/A", exchange, ticketReservedRoutingKey);
        rabbitTemplate.convertAndSend(exchange, ticketReservedRoutingKey, event);
    }
}
