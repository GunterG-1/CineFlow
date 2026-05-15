package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.cartelera.dto.BillboardMovieResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionSeatsResponse;
import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import com.backend.CineFlow.CineFlow.cartelera.model.EstadoButaca;
import com.backend.CineFlow.CineFlow.cartelera.model.FormatoProyeccion;
import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import com.backend.CineFlow.CineFlow.cartelera.model.Sala;
import com.backend.CineFlow.CineFlow.cartelera.repository.CinemaFunctionRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.MovieRepository;
import com.backend.CineFlow.CineFlow.cartelera.repository.RoomRepository;
import com.backend.CineFlow.CineFlow.cartelera.factory.CinemaFunctionFactoryResolver;
import com.backend.CineFlow.CineFlow.cartelera.service.CatalogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogServiceImplTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private CinemaFunctionRepository cinemaFunctionRepository;

    @Mock
    private CinemaFunctionFactoryResolver factoryResolver;

    @InjectMocks
    private CatalogServiceImpl catalogService;

    private Pelicula pelicula;
    private Sala sala;
    private Funcion funcion;

    @BeforeEach
    void setUp() {
        pelicula = new Pelicula();
        pelicula.setIdPelicula(1L);
        pelicula.setTitulo("Prueba");
        pelicula.setEnCartelera(true);

        sala = new Sala();
        sala.setIdSala(1L);
        sala.setNombre("Sala 1");

        funcion = new Funcion();
        funcion.setIdFuncion(1L);
        funcion.setPelicula(pelicula);
        funcion.setSala(sala);
        funcion.setFormato(FormatoProyeccion.TWO_D);
        funcion.setFechaInicio(LocalDateTime.now());
        Butaca b = new Butaca();
        b.setFila("A");
        b.setNumero(1);
        b.setEstado(EstadoButaca.AVAILABLE);
        funcion.setButacas(List.of(b));
    }

    @Test
    void obtenerCartelera_returnsMovies() {
        when(movieRepository.findByEnCarteleraTrue()).thenReturn(List.of(pelicula));

        List<BillboardMovieResponse> result = catalogService.obtenerCartelera();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(pelicula.getTitulo(), result.get(0).title());
    }

    @Test
    void obtenerButacasFuncion_returnsSeats() {
        when(cinemaFunctionRepository.findById(1L)).thenReturn(Optional.of(funcion));

        FunctionSeatsResponse resp = catalogService.obtenerButacasFuncion(1L);

        assertNotNull(resp);
        assertEquals(funcion.getIdFuncion(), resp.functionId());
        assertEquals(funcion.getButacas().size(), resp.seats().size());
    }
}
