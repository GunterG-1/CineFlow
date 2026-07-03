package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Representa una entrada de la bandeja de mensajes: combina la informacion
 * cruda del evento consumido de RabbitMQ (cola, tipo, payload) con el
 * resultado de la notificacion asociada (si aplica).
 *
 * Se guarda solo en memoria (ver MensajeBandejaService), por lo tanto
 * se pierde al reiniciar la aplicacion.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensajeBandeja {

    private String id;

    // --- Datos del evento / cola ---
    private String cola;
    private String tipoEvento;
    private String eventId;
    private String payloadEvento;

    // --- Datos de la notificacion (si el evento genera una) ---
    // Valores usados en estadoNotificacion: NO_APLICA, ENVIADO, FALLIDO, SIN_DESTINATARIO
    private String estadoNotificacion;
    private String destinatario;
    private String asunto;
    private String cuerpoNotificacion;
    private String errorNotificacion;

    private LocalDateTime recibidoEn;
}
