package com.backend.CineFlow.CineFlow.cartelera.repository;

import com.backend.CineFlow.CineFlow.cartelera.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Sala, Long> {
}