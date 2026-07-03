package com.backend.CineFlow.CineFlow.cartelera.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor

@NoArgsConstructor
public class BillboardMovieResponse {
    private Long id;              // 1
    private String title;         // 2
    private String sinopsis;      // 3
    private String genero;        // 4
    private Integer duracion;     // 5
    private String clasificacion; // 6
    private BigDecimal price;     // 7
    private String imageSrc;      // 8
    private String bannerSrc;     // 9
    
    private boolean visible;      // 11
    private int someInt;          // 12

    // AQUÍ ES DONDE AGREGAS LA LISTA DE FUNCIONES
    private List<FunctionResponse> funciones; 
}