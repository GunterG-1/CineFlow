package com.backend.CineFlow.CineFlow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos_confiteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_ticket", unique = true, nullable = false)
    @NotNull
    @NonNull
    private String numeroTicket;
    
    @Column(name = "id_usuario", nullable = false)
    @NotNull
    @NonNull
    private Long idUsuario;
    
    @ManyToOne
    @JoinColumn(name = "combo_id", nullable = false)
    @NotNull
    @NonNull
    private Combo combo;
    
    @Column(name = "cantidad", nullable = false)
    @NotNull
    @NonNull
    private Integer cantidad;
    
    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    @NonNull
    private EstadoPedido estado;
    
    @Column(name = "precio_total", nullable = false)
    @NotNull
    @NonNull
    private Double precioTotal;
    
    @Column(name = "fecha_creacion", nullable = false)
    @NotNull
    @NonNull
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    @Column(name = "observaciones")
    private String observaciones;
    
    public enum EstadoPedido {
        PENDIENTE,
        CONFIRMADO,
        EN_PREPARACION,
        LISTO,
        ENTREGADO,
        CANCELADO
    }
}
