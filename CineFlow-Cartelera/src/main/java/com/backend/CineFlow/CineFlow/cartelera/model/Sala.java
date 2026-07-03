package com.backend.CineFlow.CineFlow.cartelera.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "salas")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Sala {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String tipo; // "2D", "3D", "IMAX"
    private Double precioBase;
    @Column(nullable = false)
    private Integer filas;
    
    @Column(nullable = false)
 
    private Integer butacasPorFila;
    public Sala(String nombre, String tipo, Double precioBase, Integer filas, Integer butacasPorFila) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.precioBase = precioBase;
    this.filas = filas;
    this.butacasPorFila = butacasPorFila;
}
}


