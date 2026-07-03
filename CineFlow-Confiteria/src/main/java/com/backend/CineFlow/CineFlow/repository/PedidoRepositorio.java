package com.backend.CineFlow.CineFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.CineFlow.CineFlow.model.Pedido;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {
    
    Optional<Pedido> findByNumeroTicket(String numeroTicket);
    
    List<Pedido> findByIdUsuario(Long idUsuario);
    
    List<Pedido> findByEstado(Pedido.EstadoPedido estado);

    List<Pedido> findByIdUsuarioAndEstadoIn(Long idUsuario, List<Pedido.EstadoPedido> estados);
    
    List<Pedido> findByIdUsuarioAndEstado(Long idUsuario, Pedido.EstadoPedido estado);
    
    List<Pedido> findByComboId(Long comboId);
}
