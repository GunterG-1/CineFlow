package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.dto.NotificationRequest;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketPaidNotificationListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${app.events.ticket-paid.notifications-queue:ticket.paid.notifications.queue}")
    public void onTicketPaid(TicketPaidEvent event) {
        if (event == null || event.getEmailComprador() == null || event.getEmailComprador().isBlank()) {
            log.warn("Evento Ticket.Paid sin emailComprador. eventId={}", event != null ? event.getEventId() : "N/A");
            return;
        }

        NotificationRequest request = new NotificationRequest();
        request.setTo(event.getEmailComprador());
        request.setSubject("CineFlow - Compra confirmada");
        request.setBody(construirMensaje(event));

        try {
            notificationService.send(request);
            log.info("Correo de ticket enviado. eventId={}, email={}", event.getEventId(), event.getEmailComprador());
        } catch (Exception ex) {
            log.error("Fallo enviando correo para eventId={}: {}", event.getEventId(), ex.getMessage(), ex);
        }
    }

    private String construirMensaje(TicketPaidEvent event) {
        String asientos = event.getAsientos() != null ? String.join(", ", event.getAsientos()) : "N/A";
        String codigos = event.getCodigosQR() != null ? String.join(", ", event.getCodigosQR()) : "N/A";

        return "Tu compra fue confirmada exitosamente.\n\n"
            + "Evento: " + event.getEventType() + "\n"
            + "ID de evento: " + event.getEventId() + "\n"
            + "Funcion: " + (event.getIdFuncion() != null ? event.getIdFuncion() : "N/A") + "\n"
            + "Asientos: " + asientos + "\n"
            + "Codigos QR: " + codigos + "\n\n"
            + "Gracias por preferir CineFlow.";
    }
}