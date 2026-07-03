package com.backend.CineFlow.CineFlow.cartelera.configuracion;

import com.backend.CineFlow.CineFlow.cartelera.model.*;
import com.backend.CineFlow.CineFlow.cartelera.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaFunctionRepository functionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (movieRepository.count() > 0) return;

        log.info("Inicializando catálogo desde el Backend...");

        // 1. Crear Salas
        // IMPORTANTE: Asegúrate de tener este constructor en tu clase Sala.java
        Sala s2d = new Sala("Sala 1 - 2D", "2D", 5990.0, 6, 8);
        Sala sImax = new Sala("Sala 2 - IMAX", "IMAX", 11990.0, 6, 8);
        Sala s3d = new Sala("Sala 3 - 3D", "3D", 7990.0, 6, 8);
        List<Sala> salas = roomRepository.saveAll(List.of(s2d, sImax, s3d));

        // 2. Crear Películas
        Pelicula m = createMovie("Michael", "Ciencia Ficción", "PG-13", 120, "https://th.bing.com/th/id/OIP.UxNfVf7JbK5BpkAzEM2gSwHaJQ", "https://img.lalr.co/cms/2025/11/07094546/Michael.jpg");
        Pelicula d = createMovie("El diablo viste a la moda", "Drama", "PG", 109, "https://th.bing.com/th/id/OSK.VMb5JcDT6zlIdslHDZwZecN2LhhuNUuin6gnseLGZko", "https://www.diariopanorama.com/fotos/notas/2026/04/30/diablo-viste-moda-2-550722-094256.jpg");
        Pelicula o = createMovie("Ovejas Detectives", "Animación", "G", 95, "https://es.web.img3.acsta.net/img/0b/b2/0bb2e9ca24499b7043610b36d5cdcd57.jpg", "https://es.web.img2.acsta.net/img/ca/77/ca7743756c6f8c5d3a8971405a8a86cc.jpg");
        movieRepository.saveAll(List.of(m, d, o));

        // 3. Crear Agenda
        addFunctionsForDay(m, salas.get(0), 1, new int[][]{{16, 30}, {21, 0}});
        addFunctionsForDay(m, salas.get(0), 2, new int[][]{{16, 30}, {21, 0}});
        
        log.info("Inicialización completada.");
    }

    private void addFunctionsForDay(Pelicula p, Sala s, int diaSemana, int[][] horarios) {
        for (int[] h : horarios) {
            Funcion f = new Funcion();
            // CORRECCIÓN: Usamos IDs, no los objetos completos
            f.setPeliculaId(p.getIdPelicula()); 
            f.setSalaId(s.getId()); 
            
            f.setDiaSemana(diaSemana);
            // CORRECCIÓN: Usamos fecha y hora por separado
            f.setFecha(LocalDate.now()); 
            f.setHora(LocalTime.of(h[0], h[1])); 
            
            functionRepository.save(f);
        }
    }

    private Pelicula createMovie(String t, String g, String c, int dur, String img, String ban) {
        Pelicula p = new Pelicula(t, "Sinopsis...", g, dur, c, true);
        p.setImagenUrl(img);
        p.setBannerUrl(ban);
        return p;
    }
}