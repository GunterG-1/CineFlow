package com.backend.CineFlow.CineFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.CineFlow.CineFlow.model.Combo;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboRepositorio extends JpaRepository<Combo, Long> {
    
    List<Combo> findByActivoTrue();
    
    List<Combo> findByNombreContainingIgnoreCase(String nombre);
    
    Optional<Combo> findByNombreIgnoreCase(String nombre);
    
    List<Combo> findByCantidadDisponibleGreaterThan(Integer cantidad);
}
