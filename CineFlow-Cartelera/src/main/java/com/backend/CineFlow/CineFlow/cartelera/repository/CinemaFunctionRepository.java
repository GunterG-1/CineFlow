package com.backend.CineFlow.CineFlow.cartelera.repository;

import com.backend.CineFlow.CineFlow.cartelera.model.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CinemaFunctionRepository extends JpaRepository<Funcion, Long> {
}