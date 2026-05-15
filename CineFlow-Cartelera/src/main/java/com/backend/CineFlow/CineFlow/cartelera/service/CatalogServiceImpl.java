package com.backend.CineFlow.CineFlow.cartelera.service;

import com.backend.CineFlow.CineFlow.cartelera.dto.BillboardMovieResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.CreateFunctionRequest;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionSeatsResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.SeatResponse;
import com.backend.CineFlow.CineFlow.cartelera.factory.CinemaFunctionFactory;
import com.backend.CineFlow.CineFlow.cartelera.factory.CinemaFunctionFactoryResolver;
import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import com.backend.CineFlow.CineFlow.cartelera.model.Sala;
import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import com.backend.CineFlow.CineFlow.cartelera.repository.CinemaFunctionRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.MovieRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class CatalogServiceImpl implements CatalogService {

    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaFunctionRepository cinemaFunctionRepository;
    private final CinemaFunctionFactoryResolver factoryResolver;

    public CatalogServiceImpl(MovieRepository movieRepository,
                              RoomRepository roomRepository,
                              CinemaFunctionRepository cinemaFunctionRepository,
                              CinemaFunctionFactoryResolver factoryResolver) {
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
        this.cinemaFunctionRepository = cinemaFunctionRepository;
        this.factoryResolver = factoryResolver;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardMovieResponse> obtenerCartelera() {
        return movieRepository.findByEnCarteleraTrue()
                .stream()
                .map(movie -> new BillboardMovieResponse(
                        movie.getIdPelicula(),
                        movie.getTitulo(),
                        movie.getSinopsis(),
                        movie.getGenero(),
                        movie.getDuracionMinutos(),
                        movie.getClasificacion()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FunctionSeatsResponse obtenerButacasFuncion(Long functionId) {
                Funcion cinemaFunction = cinemaFunctionRepository.findById(Objects.requireNonNull(functionId, "El id de la función es obligatorio"))
                .orElseThrow(() -> new CatalogNotFoundException("No existe la función con id " + functionId));

        List<SeatResponse> seats = cinemaFunction.getButacas().stream()
                .sorted(Comparator.comparing((Butaca seat) -> seat.getFila()).thenComparing(Butaca::getNumero))
                .map(seat -> new SeatResponse(seat.getFila(), seat.getNumero(), seat.getEstado().name()))
                .toList();

        return new FunctionSeatsResponse(
                cinemaFunction.getIdFuncion(),
                cinemaFunction.getPelicula().getTitulo(),
                cinemaFunction.getSala().getNombre(),
                cinemaFunction.getFormato().name(),
                cinemaFunction.getFechaInicio(),
                seats);
    }

    @Override
    public FunctionResponse crearFuncion(CreateFunctionRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }

        Long movieId = Objects.requireNonNull(request.movieId(), "El id de la película es obligatorio");
        Long roomId = Objects.requireNonNull(request.roomId(), "El id de la sala es obligatorio");
        String formatValue = Objects.requireNonNull(request.format(), "El formato es obligatorio");
        java.time.LocalDateTime startsAt = Objects.requireNonNull(request.startsAt(), "La fecha de inicio es obligatoria");

        Pelicula movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new CatalogNotFoundException("No existe la película con id " + movieId));

        Sala room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CatalogNotFoundException("No existe la sala con id " + roomId));

        FormatoProyeccion format = FormatoProyeccion.fromValue(formatValue);
        CinemaFunctionFactory factory = factoryResolver.resolve(format);
        Funcion cinemaFunction = factory.create(movie, room, startsAt, request.price());
        Funcion saved = cinemaFunctionRepository.save(Objects.requireNonNull(cinemaFunction, "La función no puede ser nula"));

        return toFunctionResponse(saved);
    }

    private FunctionResponse toFunctionResponse(Funcion cinemaFunction) {
        return new FunctionResponse(
                                cinemaFunction.getIdFuncion(),
                                cinemaFunction.getPelicula().getIdPelicula(),
                                cinemaFunction.getPelicula().getTitulo(),
                                cinemaFunction.getSala().getIdSala(),
                                cinemaFunction.getSala().getNombre(),
                                cinemaFunction.getFormato().name(),
                                cinemaFunction.getFechaInicio(),
                                cinemaFunction.getPrecio(),
                                cinemaFunction.getButacas().size());
    }
}