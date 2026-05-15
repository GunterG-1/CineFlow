package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PromocionDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String descuento;
    private boolean activa;
}
