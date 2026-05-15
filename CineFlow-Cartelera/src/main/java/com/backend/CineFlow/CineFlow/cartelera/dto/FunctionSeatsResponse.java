package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.time.LocalDateTime;
import java.util.List;

public record FunctionSeatsResponse(
        @JsonProperty("idFuncion") Long functionId,
        @JsonProperty("tituloPelicula") String movieTitle,
        @JsonProperty("nombreSala") String roomName,
        @JsonProperty("formato") String format,
        @JsonProperty("fechaInicio") @JsonSerialize(using = ChileDateTimeSerializer.class) LocalDateTime startsAt,
        @JsonProperty("butacas") List<SeatResponse> seats
) {
}