package com.backend.CineFlow.CineFlow.cartelera.configuracion;

import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import com.backend.CineFlow.CineFlow.cartelera.model.EstadoButaca;
import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import com.backend.CineFlow.CineFlow.cartelera.model.Sala;
import com.backend.CineFlow.CineFlow.cartelera.repository.CinemaFunctionRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.MovieRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.RoomRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaFunctionRepository functionRepository;
    private final SeatRepository seatRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos de cartelera...");

        // Verificar si ya existen datos
        if (movieRepository.count() > 0) {
            log.info("Datos ya existen en la base de datos. Saltando inicialización.");
            return;
        }

        // Crear películas basadas en los datos del frontend
        List<Pelicula> peliculas = new ArrayList<>();

        peliculas.add(new Pelicula(
            "Michael",
            "Una aventura de ciencia ficción cargada de tensión, misterio y visuales impactantes.",
            "Ciencia Ficción",
            120,
            "PG-13",
            true
        ));

        peliculas.add(new Pelicula(
            "El diablo viste a la moda",
            "Un drama elegante y agudo sobre la ambición, la moda y las decisiones que cambian una carrera.",
            "Drama",
            109,
            "PG",
            true
        ));

        peliculas.add(new Pelicula(
            "Ovejas Detectives",
            "Una historia divertida y distinta donde un grupo de ovejas resuelve un misterio inesperado.",
            "Drama",
            95,
            "G",
            true
        ));

        List<Pelicula> peliculasGuardadas = movieRepository.saveAll(peliculas);
        log.info("Se han creado {} películas", peliculasGuardadas.size());

        // Crear salas
        List<Sala> salas = new ArrayList<>();
        salas.add(new Sala("Sala 1 - 2D", 6, 8, true));
        salas.add(new Sala("Sala 2 - IMAX", 6, 8, true));
        salas.add(new Sala("Sala 3 - 3D", 6, 8, true));

        List<Sala> salasGuardadas = roomRepository.saveAll(salas);
        log.info("Se han creado {} salas", salasGuardadas.size());

        // Crear funciones y asientos
        List<Funcion> funciones = new ArrayList<>();
        LocalDateTime baseDateTime = LocalDateTime.now().plusDays(1);

        // Funciones para película 1 (Michael)
        for (int dia = 0; dia < 7; dia++) {
            LocalDateTime horaFuncion1 = baseDateTime.plusDays(dia).withHour(16).withMinute(30);
            Funcion funcion1 = createFunction(peliculasGuardadas.get(0), salasGuardadas.get(0), horaFuncion1, FormatoProyeccion.TWO_D, new BigDecimal("5.99"));
            funciones.add(funcion1);

            LocalDateTime horaFuncion2 = baseDateTime.plusDays(dia).withHour(21).withMinute(0);
            Funcion funcion2 = createFunction(peliculasGuardadas.get(0), salasGuardadas.get(1), horaFuncion2, FormatoProyeccion.IMAX, new BigDecimal("5.99"));
            funciones.add(funcion2);
        }

        // Funciones para película 2 (El diablo viste a la moda)
        for (int dia = 0; dia < 7; dia++) {
            LocalDateTime horaFuncion1 = baseDateTime.plusDays(dia).withHour(15).withMinute(0);
            Funcion funcion1 = createFunction(peliculasGuardadas.get(1), salasGuardadas.get(2), horaFuncion1, FormatoProyeccion.THREE_D, new BigDecimal("5.99"));
            funciones.add(funcion1);

            LocalDateTime horaFuncion2 = baseDateTime.plusDays(dia).withHour(20).withMinute(15);
            Funcion funcion2 = createFunction(peliculasGuardadas.get(1), salasGuardadas.get(0), horaFuncion2, FormatoProyeccion.TWO_D, new BigDecimal("5.99"));
            funciones.add(funcion2);
        }

        // Funciones para película 3 (Ovejas Detectives)
        for (int dia = 0; dia < 7; dia++) {
            LocalDateTime horaFuncion1 = baseDateTime.plusDays(dia).withHour(14).withMinute(45);
            Funcion funcion1 = createFunction(peliculasGuardadas.get(2), salasGuardadas.get(1), horaFuncion1, FormatoProyeccion.IMAX, new BigDecimal("5.99"));
            funciones.add(funcion1);

            LocalDateTime horaFuncion2 = baseDateTime.plusDays(dia).withHour(19).withMinute(30);
            Funcion funcion2 = createFunction(peliculasGuardadas.get(2), salasGuardadas.get(2), horaFuncion2, FormatoProyeccion.THREE_D, new BigDecimal("5.99"));
            funciones.add(funcion2);
        }

        List<Funcion> funcionesGuardadas = functionRepository.saveAll(funciones);
        log.info("Se han creado {} funciones", funcionesGuardadas.size());

        // Crear asientos para cada función
        for (Funcion funcion : funcionesGuardadas) {
            Sala sala = funcion.getSala();
            List<Butaca> butacas = new ArrayList<>();

            for (int fila = 0; fila < sala.getFilas(); fila++) {
                char letraFila = (char) ('A' + fila);
                for (int numero = 1; numero <= sala.getButacasPorFila(); numero++) {
                    Butaca butaca = new Butaca(String.valueOf(letraFila), numero, EstadoButaca.AVAILABLE);
                    butaca.setFuncion(funcion);
                    butacas.add(butaca);
                }
            }

            seatRepository.saveAll(butacas);
        }

        log.info("Se han creado asientos para todas las funciones");
        log.info("Inicialización de cartelera completada exitosamente");
    }

    private Funcion createFunction(Pelicula pelicula, Sala sala, LocalDateTime fechaInicio, FormatoProyeccion formato, BigDecimal precio) {
        Funcion funcion = new Funcion();
        funcion.setPelicula(pelicula);
        funcion.setSala(sala);
        funcion.setFechaInicio(fechaInicio);
        funcion.setFormato(formato);
        funcion.setPrecio(precio);
        funcion.setActiva(true);
        funcion.setButacas(new ArrayList<>());
        return funcion;
    }
}
