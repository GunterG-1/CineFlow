package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateFunctionRequest(
        @JsonAlias("idPelicula") Long movieId,
        @JsonAlias("idSala") Long roomId,
        @JsonAlias("formato") String format,
        @JsonAlias("fechaInicio") LocalDateTime startsAt,
        @JsonAlias("precio") BigDecimal price
) {
}