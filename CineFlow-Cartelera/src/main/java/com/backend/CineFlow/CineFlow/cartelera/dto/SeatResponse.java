package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

public record SeatResponse(
        @JsonProperty("fila") String rowLabel,
        @JsonProperty("numero") Integer seatNumber,
        @JsonProperty("estado") @JsonSerialize(using = EstadoButacaSerializer.class) String status
) {
}