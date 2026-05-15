package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;

import java.math.BigDecimal;

public class ImaxFunctionFactory extends CinemaFunctionFactory {

    @Override
    protected FormatoProyeccion format() {
        return FormatoProyeccion.IMAX;
    }

    @Override
    protected BigDecimal priceMultiplier() {
        return BigDecimal.valueOf(1.50);
    }
}