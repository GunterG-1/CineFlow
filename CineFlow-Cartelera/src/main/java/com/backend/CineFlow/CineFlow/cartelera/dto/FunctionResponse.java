package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FunctionResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("idPelicula") Long movieId,
        @JsonProperty("tituloPelicula") String movieTitle,
        @JsonProperty("idSala") Long roomId,
        @JsonProperty("nombreSala") String roomName,
        @JsonProperty("formato") String format,
        @JsonProperty("fechaInicio") @JsonSerialize(using = ChileDateTimeSerializer.class) LocalDateTime startsAt,
        @JsonProperty("precio") @JsonSerialize(using = PrecioSerializer.class) BigDecimal price,
        @JsonProperty("totalButacas") int totalSeats
) {
}