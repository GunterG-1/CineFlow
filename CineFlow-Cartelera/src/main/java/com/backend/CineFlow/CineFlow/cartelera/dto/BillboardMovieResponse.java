package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BillboardMovieResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("titulo") String title,
        @JsonProperty("descripcion") String description,
        @JsonProperty("genero") String genre,
        @JsonProperty("duracionMinutos") Integer durationMinutes,
        @JsonProperty("calificacion") String rating
) {
}