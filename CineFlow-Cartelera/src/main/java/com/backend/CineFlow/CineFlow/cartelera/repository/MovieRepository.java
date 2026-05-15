package com.backend.CineFlow.CineFlow.cartelera.repository;

import com.backend.CineFlow.CineFlow.cartelera.model.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Pelicula, Long> {
    List<Pelicula> findByEnCarteleraTrue();
}