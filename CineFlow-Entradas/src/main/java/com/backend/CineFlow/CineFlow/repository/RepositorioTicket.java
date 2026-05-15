package com.backend.CineFlow.CineFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.CineFlow.CineFlow.model.EstadoTicket;
import com.backend.CineFlow.CineFlow.model.Ticket;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorioTicket extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findByNumeroPeliculaAndEstado(String numeroPelicula, EstadoTicket estado);
    
    Optional<Ticket> findByCodigoQR(String codigoQR);

    List<Ticket> findByClaveFuncionAndEstadoIn(String claveFuncion, List<EstadoTicket> estados);
    
    @Query("SELECT t FROM Ticket t WHERE t.numeroPelicula = :numeroPelicula AND t.numeroAsiento = :numeroAsiento")
    Optional<Ticket> buscarPorPeliculaYAsiento(@Param("numeroPelicula") String numeroPelicula, 
                                               @Param("numeroAsiento") String numeroAsiento);

    @Query("SELECT t FROM Ticket t WHERE t.claveFuncion = :claveFuncion AND t.numeroAsiento = :numeroAsiento")
    Optional<Ticket> buscarPorFuncionYAsiento(@Param("claveFuncion") String claveFuncion,
                                              @Param("numeroAsiento") String numeroAsiento);
    
    List<Ticket> findByEmailCompradorAndFechaCompraBetween(String email, java.time.LocalDateTime inicio, java.time.LocalDateTime fin);
}