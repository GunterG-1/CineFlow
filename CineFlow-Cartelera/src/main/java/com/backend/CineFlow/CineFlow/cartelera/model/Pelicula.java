package com.backend.CineFlow.CineFlow.cartelera.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPelicula;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 1500)
    private String sinopsis;

    @Column(nullable = false)
    private String genero;

    @Column(nullable = false)
    private Integer duracionMinutos;

    @Column(nullable = false)
    private String clasificacion;

    @Column(nullable = false)
    private boolean enCartelera;

    @Column(length = 512)
    private String imagenUrl;

    @Column(length = 512)
    private String bannerUrl;

    @Column(length = 1500)
    private String actores;

    

    public Pelicula(String titulo, String sinopsis, String genero, Integer duracionMinutos, String clasificacion, boolean enCartelera) {
        this.titulo = titulo;
        this.sinopsis = sinopsis;
        this.genero = genero;
        this.duracionMinutos = duracionMinutos;
        this.clasificacion = clasificacion;
        this.enCartelera = enCartelera;
    }
}