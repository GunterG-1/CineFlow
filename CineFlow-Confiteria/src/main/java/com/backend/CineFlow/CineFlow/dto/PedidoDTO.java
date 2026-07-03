package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
 
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {
    
    private Long id;
    private String numeroTicket;
    private Long idUsuario;
    private Long comboId;
    private ComboDTO combo;
    private Integer cantidad;
    private String estado;
    private Double precioTotal;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaEntrega;
    private String observaciones;
}
