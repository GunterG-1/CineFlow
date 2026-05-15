package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;

public class TwoDFunctionFactory extends CinemaFunctionFactory {

    @Override
    protected FormatoProyeccion format() {
        return FormatoProyeccion.TWO_D;
    }
}