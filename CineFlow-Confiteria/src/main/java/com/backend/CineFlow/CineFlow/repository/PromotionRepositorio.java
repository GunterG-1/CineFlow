package com.backend.CineFlow.CineFlow.repository;

import com.backend.CineFlow.CineFlow.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepositorio extends JpaRepository<Promotion, Long> {
    List<Promotion> findByActivoTrue();
    Optional<Promotion> findByTitle(String title);
}
