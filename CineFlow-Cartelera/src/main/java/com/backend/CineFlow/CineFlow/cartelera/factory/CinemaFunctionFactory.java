package com.backend.CineFlow.CineFlow.cartelera.factory;

import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import com.backend.CineFlow.CineFlow.cartelera.model.Sala;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public abstract class CinemaFunctionFactory {

    // Ahora recibimos LocalDate y LocalTime por separado
    public Funcion create(Pelicula movie, Sala room, LocalDate date, LocalTime time, BigDecimal basePrice) {
        Funcion cinemaFunction = new Funcion();
        
        // Usamos los IDs en lugar de los objetos completos
        cinemaFunction.setPeliculaId(movie.getIdPelicula());
        cinemaFunction.setSalaId(room.getId());
        
        // Asignamos la fecha y hora separadas
        cinemaFunction.setFecha(date);
        cinemaFunction.setHora(time);
        
        // Calculamos el día de la semana automáticamente desde la fecha
        cinemaFunction.setDiaSemana(date.getDayOfWeek().getValue());
        
        // Nota: setFormato se eliminó porque el formato ahora depende de la Sala, no de la Función
        
        return cinemaFunction;
    }

    protected BigDecimal adjustPrice(BigDecimal basePrice) {
        BigDecimal value = basePrice == null ? BigDecimal.valueOf(5.990) : basePrice;
        return value.multiply(priceMultiplier());
    }

    protected BigDecimal priceMultiplier() {
        return BigDecimal.ONE;
    }

    protected abstract FormatoProyeccion format();
}