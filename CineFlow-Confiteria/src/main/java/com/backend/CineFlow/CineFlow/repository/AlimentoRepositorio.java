package com.backend.CineFlow.CineFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.CineFlow.CineFlow.model.Alimento;

import java.util.List;

@Repository
public interface AlimentoRepositorio extends JpaRepository<Alimento, Long> {
    
    List<Alimento> findByActivoTrue();
    
    List<Alimento> findByCategoria(String categoria);
    
    List<Alimento> findByNombreContainingIgnoreCase(String nombre);
    
    List<Alimento> findByCategoriaAndActivoTrue(String categoria);
}
