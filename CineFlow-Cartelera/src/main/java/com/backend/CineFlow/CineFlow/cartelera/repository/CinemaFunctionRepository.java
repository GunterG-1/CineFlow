package com.backend.CineFlow.CineFlow.cartelera.repository;

import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import java.util.List;
import java.time.LocalDate;


import org.springframework.data.jpa.repository.JpaRepository;

public interface CinemaFunctionRepository extends JpaRepository<Funcion, Long> {
List<Funcion> findByPeliculaIdAndFechaAfter(Long peliculaId, LocalDate fecha);
List<Funcion> findByPeliculaId(Long peliculaId);
}