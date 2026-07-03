package com.backend.CineFlow.CineFlow.cartelera.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateFunctionRequest(
    Long peliculaId, // Al poner este nombre, Java genera automáticamente el método peliculaId()
    Long salaId,     // Java genera automáticamente el método salaId()
    String formato,
    LocalDate fecha,
    LocalTime hora
) {}