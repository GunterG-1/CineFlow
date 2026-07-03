package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record FunctionSeatsResponse(
        @JsonProperty("idFuncion") Long functionId,
        @JsonProperty("tituloPelicula") String movieTitle,
        @JsonProperty("nombreSala") String roomName,
        @JsonProperty("tipoSala") String roomType,
        @JsonProperty("formato") String format,
        @JsonProperty("fecha") LocalDate fecha, // <-- Separado
        @JsonProperty("hora") LocalTime hora,   // <-- Separado
        @JsonProperty("butacas") List<SeatResponse> seats
) {
}