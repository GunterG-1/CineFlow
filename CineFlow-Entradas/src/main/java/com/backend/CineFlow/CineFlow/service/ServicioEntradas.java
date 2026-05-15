package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.repository.RepositorioTicket;
import com.backend.CineFlow.CineFlow.dto.SolicitudReserva;
import com.backend.CineFlow.CineFlow.model.EstadoTicket;
import com.backend.CineFlow.CineFlow.model.Ticket;
import com.backend.CineFlow.CineFlow.dto.SolicitudCompra;
import com.backend.CineFlow.CineFlow.event.TicketPaidEvent;
import com.backend.CineFlow.CineFlow.event.TicketReservedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ServicioEntradas {

    private static final double PRECIO_BASE_ENTRADA = 5.99;
    
    @Autowired
    private RepositorioTicket repositorioTicket;

    @Autowired
    private EventBusService eventBusService;
    
    @Transactional
    public Map<String, Object> reservarAsientos(SolicitudReserva solicitud) {
        Map<String, Object> respuesta = new HashMap<>();
        List<Ticket> asientosReservados = new ArrayList<>();
        List<String> asientosNoDisponibles = new ArrayList<>();
        String claveFuncion = resolverClaveFuncion(solicitud.getClaveFuncion(), solicitud.getIdFuncion(), solicitud.getNumeroPelicula());
        
        try {
            for (String numeroAsiento : solicitud.getAsientosSeleccionados()) {
                Ticket ticket = obtenerOCrearTicket(
                    claveFuncion,
                    solicitud.getNumeroPelicula(),
                    solicitud.getNombrePelicula(),
                    solicitud.getHoraPelicula(),
                    solicitud.getSala(),
                    numeroAsiento);

                if (ticket.getEstado() == EstadoTicket.DISPONIBLE) {
                    ticket.setEstado(EstadoTicket.BLOQUEADO);
                    repositorioTicket.save(ticket);
                    asientosReservados.add(ticket);
                } else {
                    asientosNoDisponibles.add(numeroAsiento);
                }
            }

            if (!asientosReservados.isEmpty()) {
                TicketReservedEvent event = construirEventoTicketReserved(solicitud, asientosReservados);
                try {
                    eventBusService.publicarTicketReserved(event);
                } catch (Exception ex) {
                    log.warn("No se pudo publicar el evento Ticket.Reserved. La reserva ya fue procesada: {}", ex.getMessage());
                }
            }
            
            respuesta.put("exito", true);
            respuesta.put("asientosReservados", asientosReservados.size());
            respuesta.put("asientosNoDisponibles", asientosNoDisponibles);
            respuesta.put("tiempoExpiracion", 0);
            
        } catch (Exception e) {
            respuesta.put("exito", false);
            respuesta.put("error", e.getMessage());
        }
        
        return respuesta;
    }
    
    @Transactional
    public Map<String, Object> procesarPago(SolicitudCompra solicitud) {
        Map<String, Object> respuesta = new HashMap<>();
        String claveFuncion = resolverClaveFuncion(solicitud.getClaveFuncion(), solicitud.getIdFuncion(), solicitud.getNumeroPelicula());
        
        try {
            List<Ticket> ticketsAComprar = new ArrayList<>();
            double precioTotal = 0;
            
            for (String numeroAsiento : solicitud.getAsientosSeleccionados()) {
                Ticket t = obtenerOCrearTicket(
                    claveFuncion,
                    solicitud.getNumeroPelicula(),
                    solicitud.getNombrePelicula(),
                    solicitud.getHoraPelicula(),
                    solicitud.getSala(),
                    numeroAsiento);
                if (t.getEstado() != EstadoTicket.BLOQUEADO && t.getEstado() != EstadoTicket.DISPONIBLE) {
                    throw new RuntimeException("Asiento " + numeroAsiento + " no está disponible");
                }
                
                ticketsAComprar.add(t);
                precioTotal += t.getPrecio();
            }
            
            double descuento = calcularDescuento(solicitud.getCodigoDescuento(), precioTotal);
            precioTotal -= descuento;
            
            if (!validarPago(solicitud)) {
                throw new RuntimeException("Debe proporcionar un método de pago válido");
            }
            
            List<String> codigosQR = new ArrayList<>();
            for (Ticket ticket : ticketsAComprar) {
                ticket.setEstado(EstadoTicket.VENDIDO);
                ticket.setFechaCompra(LocalDateTime.now());
                ticket.setEmailComprador(solicitud.getEmailComprador());
                ticket.setDescuentoAplicado(descuento / ticketsAComprar.size());
                String qr = generarCodigoQR(ticket);
                ticket.setCodigoQR(qr);
                codigosQR.add(qr);
                repositorioTicket.save(ticket);
            }

            TicketPaidEvent event = construirEventoTicketPaid(solicitud, ticketsAComprar, codigosQR);
            try {
                eventBusService.publicarTicketPaid(event);
            } catch (Exception ex) {
                log.warn("No se pudo publicar el evento Ticket.Paid. La compra ya fue procesada: {}", ex.getMessage());
            }
            
            respuesta.put("exito", true);
            respuesta.put("totalEntradas", ticketsAComprar.size());
            respuesta.put("precioTotal", precioTotal);
            respuesta.put("codigosQR", codigosQR);
            
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            respuesta.put("exito", false);
            respuesta.put("error", e.getMessage());
        }
        
        return respuesta;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerAsientosNoDisponibles(String claveFuncion, Long idFuncion, String numeroPelicula) {
        String funcionKey = resolverClaveFuncion(claveFuncion, idFuncion, numeroPelicula);
        List<EstadoTicket> estadosNoDisponibles = List.of(EstadoTicket.BLOQUEADO, EstadoTicket.RESERVADO, EstadoTicket.VENDIDO);
        List<String> asientos = repositorioTicket.findByClaveFuncionAndEstadoIn(funcionKey, estadosNoDisponibles)
            .stream()
            .map(Ticket::getNumeroAsiento)
            .distinct()
            .sorted()
            .collect(Collectors.toList());

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("exito", true);
        respuesta.put("claveFuncion", funcionKey);
        respuesta.put("asientosNoDisponibles", asientos);
        return respuesta;
    }
    
    public Map<String, Object> obtenerCodigoQR(Long idTicket) {
        Map<String, Object> respuesta = new HashMap<>();
        
        if (idTicket == null) {
            respuesta.put("exito", false);
            respuesta.put("error", "ID de ticket inválido");
            return respuesta;
        }
        
        Optional<Ticket> ticket = repositorioTicket.findById(idTicket);
        if (ticket.isPresent()) {
            respuesta.put("exito", true);
            respuesta.put("codigoQR", ticket.get().getCodigoQR());
            respuesta.put("asiento", ticket.get().getNumeroAsiento());
            respuesta.put("pelicula", ticket.get().getNumeroPelicula());
        } else {
            respuesta.put("exito", false);
            respuesta.put("error", "Ticket no encontrado");
        }
        
        return respuesta;
    }
    
    private double calcularDescuento(String codigoDescuento, double precioOriginal) {
        return 0;
    }
    
    private boolean validarPago(SolicitudCompra solicitud) {
        // Requerir que exista un método de pago en la solicitud o en el perfil del usuario
        if (solicitud == null) return false;
        if (solicitud.getMetodoPago() != null && !solicitud.getMetodoPago().isBlank()) return true;
        // Si no viene en la solicitud, el cliente debería usar la cuenta del usuario; no disponible aquí -> rechazar
        return false;
    }
    
    private String generarCodigoQR(Ticket ticket) {
        return UUID.randomUUID().toString();
    }

    private Ticket obtenerOCrearTicket(String claveFuncion,
                                       String numeroPelicula,
                                       String nombrePelicula,
                                       String horaPelicula,
                                       String sala,
                                       String numeroAsiento) {
        return repositorioTicket.buscarPorFuncionYAsiento(claveFuncion, numeroAsiento)
            .orElseGet(() -> {
                Ticket ticket = new Ticket();
                ticket.setNombrePelicula(resolverNombrePelicula(numeroPelicula, nombrePelicula));
                ticket.setHoraPelicula(resolverHoraPelicula(horaPelicula));
                ticket.setSala(resolverSala(sala));
                ticket.setNumeroPelicula(numeroPelicula);
                ticket.setClaveFuncion(claveFuncion);
                ticket.setNumeroAsiento(numeroAsiento);
                ticket.setPrecio(PRECIO_BASE_ENTRADA);
                ticket.setEstado(EstadoTicket.DISPONIBLE);
                ticket.setEmailComprador(null);
                ticket.setDescuentoAplicado(null);
                ticket.setCodigoQR(null);
                return repositorioTicket.save(ticket);
            });
    }

    private String resolverClaveFuncion(String claveFuncion, Long idFuncion, String numeroPelicula) {
        if (claveFuncion != null && !claveFuncion.isBlank()) {
            return claveFuncion.trim();
        }

        if (idFuncion != null) {
            return "FUNCION-" + idFuncion;
        }

        if (numeroPelicula != null && !numeroPelicula.isBlank()) {
            return "PELICULA-" + numeroPelicula.trim();
        }

        throw new RuntimeException("No se pudo resolver la función de la compra");
    }

    private TicketPaidEvent construirEventoTicketPaid(SolicitudCompra solicitud, List<Ticket> tickets, List<String> codigosQR) {
        TicketPaidEvent event = new TicketPaidEvent();
        event.setEventId(UUID.randomUUID().toString());
        event.setEventType("Ticket.Paid");
        event.setIdFuncion(resolverIdFuncion(solicitud.getIdFuncion(), solicitud.getNumeroPelicula()));
        event.setNumeroPelicula(solicitud.getNumeroPelicula());
        event.setIdUsuario(solicitud.getIdUsuario());
        event.setEmailComprador(solicitud.getEmailComprador());
        event.setAsientos(tickets.stream().map(Ticket::getNumeroAsiento).collect(Collectors.toList()));
        event.setTicketIds(tickets.stream().map(Ticket::getId).collect(Collectors.toList()));
        event.setCodigosQR(codigosQR);
        event.setOccurredAt(LocalDateTime.now());
        return event;
    }

    private TicketReservedEvent construirEventoTicketReserved(SolicitudReserva solicitud, List<Ticket> tickets) {
        TicketReservedEvent event = new TicketReservedEvent();
        event.setEventId(UUID.randomUUID().toString());
        event.setEventType("Ticket.Reserved");
        event.setIdFuncion(resolverIdFuncion(solicitud.getIdFuncion(), solicitud.getNumeroPelicula()));
        event.setNumeroPelicula(solicitud.getNumeroPelicula());
        event.setAsientos(tickets.stream().map(Ticket::getNumeroAsiento).collect(Collectors.toList()));
        event.setOccurredAt(LocalDateTime.now());
        return event;
    }

    private String resolverNombrePelicula(String numeroPelicula, String nombrePelicula) {
        if (nombrePelicula != null && !nombrePelicula.isBlank()) {
            return nombrePelicula.trim();
        }

        return numeroPelicula != null ? "Pelicula " + numeroPelicula.trim() : "Pelicula sin nombre";
    }

    private String resolverHoraPelicula(String horaPelicula) {
        return horaPelicula != null && !horaPelicula.isBlank() ? horaPelicula.trim() : "N/A";
    }

    private String resolverSala(String sala) {
        return sala != null && !sala.isBlank() ? sala.trim() : "N/A";
    }

    public Map<String, Object> reclamarCumpleanos(Long idUsuario) {
        Map<String, Object> respuesta = new HashMap<>();
        if (idUsuario == null) {
            respuesta.put("exito", false);
            respuesta.put("error", "ID de usuario inválido");
            return respuesta;
        }

        try {
            List<String> codigos = new ArrayList<>();
            List<Long> ids = new ArrayList<>();
            for (int i = 1; i <= 2; i++) {
                Ticket ticket = new Ticket();
                ticket.setNombrePelicula("Bono Cumpleaños");
                ticket.setHoraPelicula("N/A");
                ticket.setSala("N/A");
                ticket.setNumeroPelicula("0");
                ticket.setClaveFuncion("BIRTHDAY-" + idUsuario + "-" + UUID.randomUUID().toString());
                ticket.setNumeroAsiento("FREE-" + i);
                ticket.setPrecio(0.0);
                ticket.setEstado(EstadoTicket.RESERVADO);
                ticket.setEmailComprador(null);
                ticket.setDescuentoAplicado(0.0);
                ticket.setCodigoQR(generarCodigoQR(ticket));
                RepositorioTicket repo = this.repositorioTicket;
                Ticket saved = repo.save(ticket);
                codigos.add(saved.getCodigoQR());
                ids.add(saved.getId());
            }

            respuesta.put("exito", true);
            respuesta.put("ticketIds", ids);
            respuesta.put("codigosQR", codigos);
            respuesta.put("mensaje", "Se han generado 2 tickets de regalo para el usuario");
            return respuesta;
        } catch (Exception ex) {
            respuesta.put("exito", false);
            respuesta.put("error", ex.getMessage());
            return respuesta;
        }
    }

    private Long resolverIdFuncion(Long idFuncion, String numeroPelicula) {
        if (idFuncion != null) {
            return idFuncion;
        }

        if (numeroPelicula == null) {
            return null;
        }

        try {
            return Long.parseLong(numeroPelicula);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
