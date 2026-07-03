package com.backend.CineFlow.CineFlow.cartelera.model;

import java.util.Arrays;

public enum FormatoProyeccion {
    _2D("2D"),
    _3D("3D"),
    IMAX("IMAX");

    private final String valorVisual;

    FormatoProyeccion(String valorVisual) {
        this.valorVisual = valorVisual;
    }

    public String getValorVisual() {
        return valorVisual;
    }

    public static FormatoProyeccion fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("El formato de la función es obligatorio");
        }

        String normalized = value.trim().toUpperCase();
        return Arrays.stream(values())
                // Ahora busca tanto el nombre del enum (_2D) como el texto visual (2D)
                .filter(format -> format.getValorVisual().equals(normalized) || format.name().equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Formato no soportado: " + value));
    }
}