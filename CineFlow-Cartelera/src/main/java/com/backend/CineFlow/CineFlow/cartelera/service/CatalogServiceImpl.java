package com.backend.CineFlow.CineFlow.cartelera.service;

import com.backend.CineFlow.CineFlow.cartelera.dto.*;
import com.backend.CineFlow.CineFlow.cartelera.factory.*;
import com.backend.CineFlow.CineFlow.cartelera.model.*;
import com.backend.CineFlow.CineFlow.cartelera.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

@Service
@Transactional
public class CatalogServiceImpl implements CatalogService {
    private static final Logger logger = LoggerFactory.getLogger(CatalogServiceImpl.class);
    public static final Path UPLOADS_DIR = Paths.get(System.getProperty("java.io.tmpdir"), "cineflow-cartelera-uploads");

    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaFunctionRepository cinemaFunctionRepository;
    private final SeatRepository seatRepository;

    public CatalogServiceImpl(MovieRepository movieRepository, RoomRepository roomRepository,
                              CinemaFunctionRepository cinemaFunctionRepository,
                              SeatRepository seatRepository) {
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
        this.cinemaFunctionRepository = cinemaFunctionRepository;
        this.seatRepository = seatRepository;
    }

    @Override
@Transactional(readOnly = true)
public List<BillboardMovieResponse> obtenerCartelera() {
    return movieRepository.findByEnCarteleraTrue().stream().map(m -> {
        List<Funcion> funciones = cinemaFunctionRepository.findByPeliculaId(m.getIdPelicula());
        return toBillboardMovieResponse(m, funciones);
    }).toList();
}

   @Override
@Transactional(readOnly = true)
public List<BillboardMovieResponse> obtenerTodasLasPeliculas() {
    return movieRepository.findAll().stream().map(m -> {
        List<Funcion> funciones = cinemaFunctionRepository.findByPeliculaId(m.getIdPelicula());
        return toBillboardMovieResponse(m, funciones);
    }).toList();
}

   @Override
    @Transactional(readOnly = true)
    public List<FunctionResponse> obtenerTodasLasFunciones() {
        return cinemaFunctionRepository.findAll().stream().map(f -> {
            // Buscamos manualmente la película y la sala para cada función
            Pelicula p = movieRepository.findById(f.getPeliculaId())
                    .orElseThrow(() -> new CatalogNotFoundException("Película no encontrada"));
            Sala s = roomRepository.findById(f.getSalaId())
                    .orElseThrow(() -> new CatalogNotFoundException("Sala no encontrada"));
            
            // Ahora llamamos al método con los 3 argumentos requeridos
            return toFunctionResponse(f, p, s);
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> obtenerTodasLasSalas() {
        return roomRepository.findAll().stream()
            .map(sala -> new RoomResponse(
                sala.getId(),
                sala.getNombre(),
                resolveRoomType(sala),
                BigDecimal.valueOf(sala.getPrecioBase())
            ))
            .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public BillboardMovieResponse obtenerPeliculaPorId(Long id) {
        Pelicula movie = movieRepository.findById(Objects.requireNonNull(id)).orElseThrow(() -> new CatalogNotFoundException("No existe"));
        return toBillboardMovieResponse(movie);
    }

    @Override
@Transactional(readOnly = true)
public List<FunctionResponse> obtenerFuncionesPorPelicula(Long peliculaId) {
    // 1. Buscamos la película una sola vez
    Pelicula movie = movieRepository.findById(peliculaId)
            .orElseThrow(() -> new CatalogNotFoundException("Pelicula no encontrada"));
            
    // 2. Buscamos todas las funciones de esa película
    List<Funcion> funciones = cinemaFunctionRepository.findByPeliculaId(peliculaId);

    // 3. Mapeamos cada función buscando su sala
    return funciones.stream().map(f -> {
        Sala sala = roomRepository.findById(f.getSalaId())
                .orElseThrow(() -> new CatalogNotFoundException("Sala no encontrada"));
        
        return toFunctionResponse(f, movie, sala);
    }).toList();
}
@Override
@Transactional(readOnly = true)
public FunctionResponse obtenerFuncionPorId(Long id) {
    Funcion f = cinemaFunctionRepository.findById(id)
            .orElseThrow(() -> new CatalogNotFoundException("Función no encontrada"));

    Pelicula p = movieRepository.findById(f.getPeliculaId())
            .orElseThrow(() -> new CatalogNotFoundException("Película no encontrada"));

    Sala s = roomRepository.findById(f.getSalaId())
            .orElseThrow(() -> new CatalogNotFoundException("Sala no encontrada"));

    return toFunctionResponse(f, p, s);
}
@Override
@Transactional(readOnly = true)
public FunctionSeatsResponse obtenerButacasFuncion(Long functionId) {
    Funcion f = cinemaFunctionRepository.findById(functionId)
            .orElseThrow(() -> new CatalogNotFoundException("Función no encontrada"));

    Pelicula p = movieRepository.findById(f.getPeliculaId())
            .orElseThrow(() -> new CatalogNotFoundException("Película no encontrada"));

    Sala s = roomRepository.findById(f.getSalaId())
            .orElseThrow(() -> new CatalogNotFoundException("Sala no encontrada"));

    List<SeatResponse> seats = f.getButacas().stream()
            .sorted(Comparator.comparing(Butaca::getFila).thenComparing(Butaca::getNumero))
            .map(seat -> new SeatResponse(seat.getFila(), seat.getNumero(), seat.getEstado().name()))
            .toList();

    return new FunctionSeatsResponse(
            f.getIdFuncion(),
            p.getTitulo(),
            s.getNombre(),
            resolveRoomType(s),
            s.getTipo(),
            f.getFecha(),
            f.getHora(),
            seats
    );
}

  @Override
@Transactional
public FunctionResponse crearFuncion(CreateFunctionRequest request) {
    if (request == null || request.peliculaId() == null || request.salaId() == null || request.fecha() == null || request.hora() == null) {
        throw new IllegalArgumentException("La función requiere peliculaId, salaId, fecha y hora");
    }

    Pelicula movie = movieRepository.findById(request.peliculaId()).orElseThrow();
    Sala room = roomRepository.findById(request.salaId()).orElseThrow();

    Funcion f = new Funcion();
    f.setPeliculaId(request.peliculaId());
    f.setSalaId(request.salaId());
    f.setFecha(request.fecha());
    f.setHora(request.hora());
    f.setDiaSemana(request.fecha().getDayOfWeek().getValue());

    Funcion saved = cinemaFunctionRepository.save(f);

    // Generar butacas físicas de la función según el layout de la sala (filas x butacasPorFila)
    List<Butaca> butacas = new ArrayList<>();
    for (int i = 0; i < room.getFilas(); i++) {
        String letraFila = String.valueOf((char) ('A' + i));
        for (int numero = 1; numero <= room.getButacasPorFila(); numero++) {
            Butaca butaca = new Butaca(letraFila, numero, EstadoButaca.AVAILABLE);
            butaca.setFuncion(saved);
            butacas.add(butaca);
        }
    }
    seatRepository.saveAll(butacas);
    saved.setButacas(butacas);

    if (!movie.isEnCartelera()) {
        movie.setEnCartelera(true);
        movieRepository.save(movie);
    }

    return toFunctionResponse(saved, movie, room);
}
    @Override
    @Transactional
    public boolean reservarButaca(Long funcionId, String fila, Integer numero) {
        var opt = seatRepository.findByFuncionIdFuncionAndFilaAndNumero(funcionId, fila, numero);
        var seat = opt.orElseThrow(() -> new CatalogNotFoundException("Butaca no encontrada"));
        if (seat.getEstado() != EstadoButaca.AVAILABLE) {
            return false; // ya está RESERVED o SOLD
        }
        seat.setEstado(EstadoButaca.RESERVED);
        seatRepository.save(seat);
        return true;
    }

    @Override
    @Transactional
    public boolean liberarButaca(Long funcionId, String fila, Integer numero) {
        var opt = seatRepository.findByFuncionIdFuncionAndFilaAndNumero(funcionId, fila, numero);
        var seat = opt.orElseThrow(() -> new CatalogNotFoundException("Butaca no encontrada"));
        if (seat.getEstado() == EstadoButaca.RESERVED) {
            seat.setEstado(EstadoButaca.AVAILABLE);
            seatRepository.save(seat);
            return true;
        }
        return false;
    }

    @Override
    public BillboardMovieResponse crearPelicula(Map<String, Object> request) {
        Pelicula movie = new Pelicula((String)request.get("titulo"), (String)request.get("sinopsis"), (String)request.get("genero"), (Integer)request.get("duracionMinutos"), (String)request.get("calificacion"), true);
        return toBillboardMovieResponse(movieRepository.save(movie));
    }

    @Override
    public BillboardMovieResponse actualizarPelicula(Long id, Map<String, Object> request) {
        logger.info("Actualizar película {} - request={}", id, request);
        Pelicula movie = movieRepository.findById(id).orElseThrow();
        logger.info("Estado previo de película (BD): titulo='{}' sinopsis='{}' bannerUrl='{}' clasificacion='{}'", movie.getTitulo(), movie.getSinopsis(), movie.getBannerUrl(), movie.getClasificacion());

        if (request.containsKey("titulo")) movie.setTitulo(String.valueOf(request.get("titulo")));
        if (request.containsKey("sinopsis")) movie.setSinopsis(String.valueOf(request.get("sinopsis")));
        if (request.containsKey("genero")) movie.setGenero(String.valueOf(request.get("genero")));
        if (request.containsKey("duracionMinutos")) {
            Object v = request.get("duracionMinutos");
            try {
                movie.setDuracionMinutos(((Number) v).intValue());
            } catch (Exception e) {
                logger.warn("No se pudo parsear duracionMinutos: {}", v);
            }
        }
        // Aceptar tanto 'clasificacion' como 'calificacion' enviados por el cliente
        if (request.containsKey("clasificacion")) movie.setClasificacion(String.valueOf(request.get("clasificacion")));
        if (request.containsKey("calificacion")) movie.setClasificacion(String.valueOf(request.get("calificacion")));
        if (request.containsKey("imagenUrl")) movie.setImagenUrl(String.valueOf(request.get("imagenUrl")));
        if (request.containsKey("bannerUrl")) movie.setBannerUrl(String.valueOf(request.get("bannerUrl")));
        if (request.containsKey("actores")) movie.setActores(String.valueOf(request.get("actores")));
        if (request.containsKey("enCartelera")) {
            Object v = request.get("enCartelera");
            if (v instanceof Boolean) movie.setEnCartelera((Boolean) v); else movie.setEnCartelera(Boolean.parseBoolean(String.valueOf(v)));
        }

        Pelicula saved = movieRepository.save(movie);
        logger.info("Estado luego de guardar: titulo='{}' sinopsis='{}' bannerUrl='{}' clasificacion='{}'", saved.getTitulo(), saved.getSinopsis(), saved.getBannerUrl(), saved.getClasificacion());

        return toBillboardMovieResponse(saved);
    }

    @Override
    public void eliminarPelicula(Long id) { movieRepository.deleteById(id); }

    @Override
    public BillboardMovieResponse toggleVisibilidadPelicula(Long id) {
        Pelicula m = movieRepository.findById(id).orElseThrow();
        m.setEnCartelera(!m.isEnCartelera());
        return toBillboardMovieResponse(movieRepository.save(m));
    }

    @Override
    public String guardarArchivo(String type, String originalFilename, byte[] content) {
        try {
            if (!Files.exists(UPLOADS_DIR)) Files.createDirectories(UPLOADS_DIR);
            // Sanitizar nombre
            String safeName = System.currentTimeMillis() + "-" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path target = UPLOADS_DIR.resolve(safeName);
            Files.write(target, content, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);
            logger.info("Archivo guardado en {}", target.toAbsolutePath());
            // Retornamos la URL pública relativa que serviremos en /uploads/{file}
            return "/uploads/" + safeName;
        } catch (Exception e) {
            logger.error("Error guardando archivo: {}", e.getMessage(), e);
            throw new RuntimeException("No se pudo guardar el archivo", e);
        }
    }

    private String resolveRoomType(Sala s) { 
    // Aquí accedes al formato o tipo que tengas en tu entidad Sala
    // Ejemplo: si en Sala tienes un campo 'tipo', úsalo aquí
    return s.getTipo(); 
}
    private FunctionResponse toFunctionResponse(Funcion f, Pelicula p, Sala s) {
    return new FunctionResponse(
        f.getIdFuncion(), 
        f.getPeliculaId(), 
        p.getTitulo(),
        f.getSalaId(), 
        s.getNombre(),
        s.getTipo(),
        s.getTipo(),
        f.getFecha(), // <-- CAMBIADO: Pasa directamente el LocalDate
        f.getDiaSemana(), 
        f.getHora(),  // <-- CAMBIADO: Pasa directamente el LocalTime (sin el .toString())
        BigDecimal.valueOf(s.getPrecioBase()),
        f.getButacas() != null ? f.getButacas().size() : 0
    );
}
   private BillboardMovieResponse toBillboardMovieResponse(Pelicula m, List<Funcion> funciones) {
        List<FunctionResponse> functionResponses = funciones.stream()
            .map(f -> {
                Sala s = roomRepository.findById(f.getSalaId())
                         .orElse(new Sala("Sin Sala", "N/A", 0.0, 0, 0));
                return toFunctionResponse(f, m, s);
            })
            .toList();

        return BillboardMovieResponse.builder()
            .id(m.getIdPelicula())
            .title(m.getTitulo())
            .sinopsis(m.getSinopsis())
            .genero(m.getGenero())
            .duracion(m.getDuracionMinutos())
            .clasificacion(m.getClasificacion())
            .price(BigDecimal.ZERO)
            .imageSrc(m.getImagenUrl())
            .bannerSrc(m.getBannerUrl())
            .funciones(functionResponses)
            .visible(m.isEnCartelera())
            .someInt(0) 
            .build();
    }

    // 2. MÉTODO SOBRECARGADO (El que soluciona los errores en los otros métodos)
    // Este método toma la película, busca sus funciones automáticamente y llama al método de arriba
    private BillboardMovieResponse toBillboardMovieResponse(Pelicula m) {
        List<Funcion> funciones = cinemaFunctionRepository.findByPeliculaId(m.getIdPelicula());
        return toBillboardMovieResponse(m, funciones);
    }
    @Override
@Transactional
public boolean sembrarButacasSiFaltan(Long funcionId) {
    Funcion f = cinemaFunctionRepository.findById(funcionId)
        .orElseThrow(() -> new CatalogNotFoundException("Función no encontrada"));
    if (f.getButacas() != null && !f.getButacas().isEmpty()) {
        return false;
    }
    Sala room = roomRepository.findById(f.getSalaId())
        .orElseThrow(() -> new CatalogNotFoundException("Sala no encontrada"));

    List<Butaca> butacas = new ArrayList<>();
    for (int i = 0; i < room.getFilas(); i++) {
        String letraFila = String.valueOf((char) ('A' + i));
        for (int numero = 1; numero <= room.getButacasPorFila(); numero++) {
            Butaca butaca = new Butaca(letraFila, numero, EstadoButaca.AVAILABLE);
            butaca.setFuncion(f);
            butacas.add(butaca);
        }
    }
    seatRepository.saveAll(butacas);
    return true;
}

}