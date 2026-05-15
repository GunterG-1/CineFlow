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
    private Long idSala;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Integer filas;

    @Column(nullable = false)
    private Integer butacasPorFila;

    @Column(nullable = false)
    private boolean activa;

    public Sala(String nombre, Integer filas, Integer butacasPorFila, boolean activa) {
        this.nombre = nombre;
        this.filas = filas;
        this.butacasPorFila = butacasPorFila;
        this.activa = activa;
    }
}