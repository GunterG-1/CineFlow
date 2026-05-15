package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import com.backend.CineFlow.CineFlow.cartelera.model.Sala;
import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import com.backend.CineFlow.CineFlow.cartelera.model.EstadoButaca;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

public abstract class CinemaFunctionFactory {

    public Funcion create(Pelicula movie, Sala room, LocalDateTime startsAt, BigDecimal basePrice) {
        Funcion cinemaFunction = new Funcion();
        cinemaFunction.setPelicula(movie);
        cinemaFunction.setSala(room);
        cinemaFunction.setFormato(format());
        cinemaFunction.setFechaInicio(startsAt);
        cinemaFunction.setPrecio(adjustPrice(basePrice));
        cinemaFunction.setActiva(true);

        for (int rowIndex = 1; rowIndex <= room.getFilas(); rowIndex++) {
            String rowLabel = String.valueOf((char) ('A' + rowIndex - 1));
            for (int seatNumber = 1; seatNumber <= room.getButacasPorFila(); seatNumber++) {
                cinemaFunction.addSeat(new Butaca(rowLabel, seatNumber, EstadoButaca.AVAILABLE));
            }
        }

        return cinemaFunction;
    }

    protected BigDecimal adjustPrice(BigDecimal basePrice) {
        BigDecimal value = basePrice == null ? BigDecimal.valueOf(10.00) : basePrice;
        return value.multiply(priceMultiplier()).setScale(2, RoundingMode.HALF_UP);
    }

    protected BigDecimal priceMultiplier() {
        return BigDecimal.ONE;
    }

    protected abstract FormatoProyeccion format();
}