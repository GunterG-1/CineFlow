package com.backend.CineFlow.CineFlow.cartelera.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record FunctionResponse(
    Long id,
    Long peliculaId,
    String tituloPelicula,
    Long salaId,
    String nombreSala,
    String tipoSala,     // "2D", "3D", "IMAX"
    String formato,      // "TWO_D", etc.
    LocalDate fecha,     // <-- CAMBIO PRINCIPAL (Antes LocalDateTime)
    Integer diaSemana,
    LocalTime hora,      // <-- CAMBIO PRINCIPAL (Antes String)
    BigDecimal precio,   
    int totalButacas
) {}