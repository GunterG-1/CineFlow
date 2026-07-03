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
 * Bandeja de mensajes en memoria: guarda los ultimos eventos consumidos
 * de RabbitMQ junto con el resultado de su notificacion asociada.
 *
 * No persiste en base de datos: es una lista acotada que vive mientras
 * la aplicacion esta corriendo (se pierde al reiniciar).
 */
@Service
@Slf4j
public class MensajeBandejaService {

    private static final int CAPACIDAD_MAXIMA = 200;

    private final Deque<MensajeBandeja> mensajes = new ConcurrentLinkedDeque<>();

    /**
     * Registra un nuevo mensaje al inicio de la bandeja (el mas reciente primero).
     * Si se supera la capacidad maxima, se descarta el mas antiguo.
     */
    public MensajeBandeja registrar(MensajeBandeja mensaje) {
        mensaje.setId(UUID.randomUUID().toString());
        mensaje.setRecibidoEn(LocalDateTime.now());

        mensajes.addFirst(mensaje);
        while (mensajes.size() > CAPACIDAD_MAXIMA) {
            mensajes.removeLast();
        }

        log.debug("Mensaje registrado en bandeja: cola={}, tipoEvento={}, eventId={}",
            mensaje.getCola(), mensaje.getTipoEvento(), mensaje.getEventId());

        return mensaje;
    }

    /**
     * Devuelve todos los mensajes, del mas reciente al mas antiguo.
     */
    public List<MensajeBandeja> obtenerTodos() {
        return List.copyOf(mensajes);
    }

    public int contar() {
        return mensajes.size();
    }

    public void limpiar() {
        mensajes.clear();
        log.info("Bandeja de mensajes limpiada manualmente.");
    }
}
