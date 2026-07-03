package com.backend.CineFlow.CineFlow.cartelera.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Representa una entrada de la bandeja de mensajes de este microservicio
 * (Cartelera): eventos de RabbitMQ consumidos aqui (ticket.paid / ticket.reserved
 * para actualizar butacas). Como Cartelera no envia notificaciones, el estado
 * de notificacion siempre sera NO_APLICA.
 *
 * Se guarda solo en memoria, por lo tanto se pierde al reiniciar la aplicacion.
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

    // --- Datos de la notificacion (no aplica en este microservicio) ---
    private String estadoNotificacion;
    private String destinatario;
    private String asunto;
    private String cuerpoNotificacion;
    private String errorNotificacion;

    private LocalDateTime recibidoEn;
}
