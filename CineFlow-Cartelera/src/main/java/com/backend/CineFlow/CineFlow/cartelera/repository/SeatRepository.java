package com.backend.CineFlow.CineFlow.cartelera.repository;

import com.backend.CineFlow.CineFlow.cartelera.model.Butaca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeatRepository extends JpaRepository<Butaca, Long> {

    Optional<Butaca> findByFuncionIdFuncionAndFilaAndNumero(Long funcionId, String fila, Integer numero);
}
