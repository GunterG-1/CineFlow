package com.backend.CineFlow.CineFlow.cartelera.service;

import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import com.backend.CineFlow.CineFlow.cartelera.model.EstadoButaca;
import com.backend.CineFlow.CineFlow.cartelera.repository.SeatRepository;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.event.TicketReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatSettlementService {

    private final SeatRepository seatRepository;

    @Transactional
    public void marcarButacasReservadas(TicketReservedEvent event) {
        Long funcionId = resolveFuncionId(event.getIdFuncion(), event.getNumeroPelicula());
        if (funcionId == null) {
            log.warn("No se pudo interpretar numeroPelicula={} como id de funcion", event.getNumeroPelicula());
            return;
        }

        List<String> asientos = event.getAsientos();
        if (asientos == null || asientos.isEmpty()) {
            return;
        }

        for (String asiento : asientos) {
            SeatRef seatRef = parseSeatRef(asiento);
            if (seatRef == null) {
                log.warn("No se pudo interpretar el asiento '{}' para funcion {}", asiento, funcionId);
                continue;
            }

            seatRepository.findByFuncionIdFuncionAndFilaAndNumero(funcionId, seatRef.fila(), seatRef.numero())
                .ifPresentOrElse(
                    seat -> marcarComoReservada(seat, event.getEventId()),
                    () -> log.warn("No existe butaca {}{} en funcion {}", seatRef.fila(), seatRef.numero(), funcionId)
                );
        }
    }

    @Transactional
    public void descontarButacasPorPago(TicketPaidEvent event) {
        Long funcionId = resolveFuncionId(event.getIdFuncion(), event.getNumeroPelicula());
        if (funcionId == null) {
            log.warn("No se pudo interpretar numeroPelicula={} como id de funcion", event.getNumeroPelicula());
            return;
        }

        List<String> asientos = event.getAsientos();
        if (asientos == null || asientos.isEmpty()) {
            return;
        }

        for (String asiento : asientos) {
            SeatRef seatRef = parseSeatRef(asiento);
            if (seatRef == null) {
                log.warn("No se pudo interpretar el asiento '{}' para funcion {}", asiento, funcionId);
                continue;
            }

            seatRepository.findByFuncionIdFuncionAndFilaAndNumero(funcionId, seatRef.fila(), seatRef.numero())
                .ifPresentOrElse(
                    seat -> marcarComoVendida(seat, event.getEventId()),
                    () -> log.warn("No existe butaca {}{} en funcion {}", seatRef.fila(), seatRef.numero(), funcionId)
                );
        }
    }

    private void marcarComoVendida(Butaca seat, String eventId) {
        if (seat.getEstado() != EstadoButaca.SOLD) {
            seat.setEstado(EstadoButaca.SOLD);
            seatRepository.save(seat);
            log.info("Butaca marcada como SOLD. eventId={}, idButaca={}", eventId, seat.getIdButaca());
        }
    }

    private void marcarComoReservada(Butaca seat, String eventId) {
        if (seat.getEstado() == EstadoButaca.AVAILABLE) {
            seat.setEstado(EstadoButaca.RESERVED);
            seatRepository.save(seat);
            log.info("Butaca marcada como RESERVED. eventId={}, idButaca={}", eventId, seat.getIdButaca());
        }
    }

    private Long resolveFuncionId(Long idFuncion, String numeroPelicula) {
        if (idFuncion != null) {
            return idFuncion;
        }

        return parseFuncionId(numeroPelicula);
    }

    private Long parseFuncionId(String numeroPelicula) {
        try {
            return Long.parseLong(numeroPelicula);
        } catch (Exception e) {
            return null;
        }
    }

    private SeatRef parseSeatRef(String raw) {
        if (raw == null) {
            return null;
        }

        String cleaned = raw.trim().toUpperCase(Locale.ROOT).replace("-", "").replace("_", "").replace(" ", "");
        if (cleaned.isEmpty()) {
            return null;
        }

        int index = 0;
        while (index < cleaned.length() && Character.isLetter(cleaned.charAt(index))) {
            index++;
        }

        if (index == 0 || index == cleaned.length()) {
            return null;
        }

        String fila = cleaned.substring(0, index);
        try {
            Integer numero = Integer.parseInt(cleaned.substring(index));
            return new SeatRef(fila, numero);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private record SeatRef(String fila, Integer numero) {
    }
}
