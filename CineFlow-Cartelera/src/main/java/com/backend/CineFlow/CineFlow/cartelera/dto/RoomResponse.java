package com.backend.CineFlow.CineFlow.cartelera.dto;

import java.math.BigDecimal;

public record RoomResponse(
    Long id,
    String nombre,
    String tipo,
    BigDecimal precioBase
) {}