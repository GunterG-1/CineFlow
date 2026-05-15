package com.backend.CineFlow.CineFlow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboDTO {
    
    private long id;
    @NotNull
    @NonNull
    private String nombre;
    private String descripcion;
    private double precio;
    private int cantidadDisponible;
    private boolean activo;
    private String rutaImagen;
    @Builder.Default
    private List<AlimentoDTO> alimentos = Collections.emptyList();
}
