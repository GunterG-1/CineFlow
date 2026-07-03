package com.backend.CineFlow.CineFlow.cartelera.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "funciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Funcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFuncion;

   @Column(name = "pelicula_id", nullable = false)
    private Long peliculaId;

    @Column(name = "sala_id", nullable = false)
    private Long salaId;

    // Separamos fecha y hora como pediste
    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    // Mantenemos diaSemana para facilitar tus consultas de "Agenda Semanal"
    @Column
    private Integer diaSemana; 

    // Eliminado el formato, ya que se asume que lo obtienes mediante el salaId
    
    @OneToMany(mappedBy = "funcion", cascade = CascadeType.ALL)
    private List<Butaca> butacas;
}