package com.backend.CineFlow.CineFlow.messaging;

import com.backend.CineFlow.CineFlow.dto.MensajeBandeja;
import com.backend.CineFlow.CineFlow.dto.NotificationRequest;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.service.MensajeBandejaService;
import com.backend.CineFlow.CineFlow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketPaidNotificationListener {

    private final NotificationService notificationService;
    private final MensajeBandejaService mensajeBandejaService;

    @Value("${app.events.ticket-paid.notifications-queue:ticket.paid.notifications.queue}")
    private String colaNotificaciones;

    @RabbitListener(queues = "${app.events.ticket-paid.notifications-queue:ticket.paid.notifications.queue}")
    public void onTicketPaid(TicketPaidEvent event) {
        String eventId = event != null ? event.getEventId() : "N/A";
        String payload = event != null ? event.toString() : "N/A";

        if (event == null || event.getEmailComprador() == null || event.getEmailComprador().isBlank()) {
            log.warn("Evento Ticket.Paid sin emailComprador. eventId={}", eventId);

            mensajeBandejaService.registrar(MensajeBandeja.builder()
                .cola(colaNotificaciones)
                .tipoEvento("TicketPaid")
                .eventId(eventId)
                .payloadEvento(payload)
                .estadoNotificacion("SIN_DESTINATARIO")
                .build());
            return;
        }

        NotificationRequest request = new NotificationRequest();
        request.setTo(event.getEmailComprador());
        request.setSubject("CineFlow - Compra confirmada");
        request.setBody(construirMensaje(event));

        try {
            notificationService.send(request);
            log.info("Correo de ticket enviado. eventId={}, email={}", event.getEventId(), event.getEmailComprador());

            mensajeBandejaService.registrar(MensajeBandeja.builder()
                .cola(colaNotificaciones)
                .tipoEvento("TicketPaid")
                .eventId(eventId)
                .payloadEvento(payload)
                .estadoNotificacion("ENVIADO")
                .destinatario(request.getTo())
                .asunto(request.getSubject())
                .cuerpoNotificacion(request.getBody())
                .build());
        } catch (Exception ex) {
            log.error("Fallo enviando correo para eventId={}: {}", event.getEventId(), ex.getMessage(), ex);

            mensajeBandejaService.registrar(MensajeBandeja.builder()
                .cola(colaNotificaciones)
                .tipoEvento("TicketPaid")
                .eventId(eventId)
                .payloadEvento(payload)
                .estadoNotificacion("FALLIDO")
                .destinatario(request.getTo())
                .asunto(request.getSubject())
                .errorNotificacion(ex.getMessage())
                .build());
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