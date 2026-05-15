package com.backend.CineFlow.CineFlow.cartelera.model;

import java.util.Arrays;

public enum FormatoProyeccion {
    TWO_D,
    THREE_D,
    IMAX;

    public static FormatoProyeccion fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("El formato de la función es obligatorio");
        }

        String normalized = value.trim().toUpperCase();
        return Arrays.stream(values())
                .filter(format -> format.name().equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Formato no soportado: " + value));
    }
}