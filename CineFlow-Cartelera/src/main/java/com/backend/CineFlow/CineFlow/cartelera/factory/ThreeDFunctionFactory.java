package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;



public class ThreeDFunctionFactory extends CinemaFunctionFactory {

    @Override
    protected FormatoProyeccion format() {
        return FormatoProyeccion._3D;
    }

}