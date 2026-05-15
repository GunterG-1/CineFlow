package com.backend.CineFlow.CineFlow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlimentoDTO {
    
    private long id;
    @NotNull
    @NonNull
    private String nombre;
    private String descripcion;
    private double precio;
    private int cantidadDisponible;
    private String categoria;
    private boolean activo;
    private String rutaImagen;
}
