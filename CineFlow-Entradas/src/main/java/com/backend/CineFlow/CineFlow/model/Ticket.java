package com.backend.CineFlow.CineFlow.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
@Table(name = "tickets")
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String numeroAsiento;
    
    @Column(nullable = false)
    private String numeroPelicula;

    @Column(nullable = false)
    private String claveFuncion;

    @Column(nullable = false)
    private String nombrePelicula;

    @Column(nullable = false)
    private String horaPelicula;

    @Column(nullable = false)
    private String sala;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTicket estado;
    
    @Column(nullable = false)
    private Double precio;
    
    private LocalDateTime fechaCompra;
    
    @Column(unique = true)
    private String codigoQR;
    
    @Column
    private String emailComprador;
    
    @Column
    private Double descuentoAplicado;
    
    public Ticket() {
        this.estado = EstadoTicket.DISPONIBLE;
    }

    public void setClaveFuncion(String claveFuncion) {
        this.claveFuncion = claveFuncion;
    }

}

