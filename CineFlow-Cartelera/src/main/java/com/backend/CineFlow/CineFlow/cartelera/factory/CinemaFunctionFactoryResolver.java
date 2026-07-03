package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import org.springframework.stereotype.Component;

@Component
public class CinemaFunctionFactoryResolver {

    public CinemaFunctionFactory resolve(FormatoProyeccion format) {
        return switch (format) {
          case _2D -> new TwoDFunctionFactory();
            case _3D -> new ThreeDFunctionFactory();
            case IMAX -> new ImaxFunctionFactory();
        };
    }
}
        