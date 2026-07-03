package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.MensajeBandeja;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Deque;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Bandeja de mensajes en memoria del microservicio Cartelera: guarda los
 * ultimos eventos consumidos de RabbitMQ (ticket.paid / ticket.reserved)
 * que afectan la disponibilidad de butacas.
 *
 * No persiste en base de datos ni comparte estado con el microservicio
 * de Entradas: cada uno mantiene su propia bandeja en memoria.
 */
@Service
@Slf4j
public class MensajeBandejaService {

    private static final int CAPACIDAD_MAXIMA = 200;

    private final Deque<MensajeBandeja> mensajes = new ConcurrentLinkedDeque<>();

    public MensajeBandeja registrar(MensajeBandeja mensaje) {
        mensaje.setId(UUID.randomUUID().toString());
        mensaje.setRecibidoEn(LocalDateTime.now());

        mensajes.addFirst(mensaje);
        while (mensajes.size() > CAPACIDAD_MAXIMA) {
            mensajes.removeLast();
        }

        log.debug("Mensaje registrado en bandeja (Cartelera): cola={}, tipoEvento={}, eventId={}",
            mensaje.getCola(), mensaje.getTipoEvento(), mensaje.getEventId());

        return mensaje;
    }

    public List<MensajeBandeja> obtenerTodos() {
        return List.copyOf(mensajes);
    }

    public int contar() {
        return mensajes.size();
    }

    public void limpiar() {
        mensajes.clear();
        log.info("Bandeja de mensajes (Cartelera) limpiada manualmente.");
    }
}
