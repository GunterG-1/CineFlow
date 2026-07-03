package com.backend.CineFlow.CineFlow.dto;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SolicitudReserva {
    @NotNull(message = "idFuncion es obligatorio")
    private Long idFuncion;
    private String numeroPelicula;
    private String claveFuncion;
    private String nombrePelicula;
    private String horaPelicula;
    private String sala;
    private List<String> asientosSeleccionados;
    private Double precio;
    
    public SolicitudReserva() {
    }
    
    public SolicitudReserva(Long idFuncion, String numeroPelicula, List<String> asientosSeleccionados) {
        this.idFuncion = idFuncion;
        this.numeroPelicula = numeroPelicula;
        this.asientosSeleccionados = asientosSeleccionados;
    }

    public Long getIdFuncion() {
        return idFuncion;
    }

    public void setIdFuncion(Long idFuncion) {
        this.idFuncion = idFuncion;
    }
    
    public String getNumeroPelicula() {
        return numeroPelicula;
    }
    
    public void setNumeroPelicula(String numeroPelicula) {
        this.numeroPelicula = numeroPelicula;
    }

    public String getClaveFuncion() {
        return claveFuncion;
    }

    public void setClaveFuncion(String claveFuncion) {
        this.claveFuncion = claveFuncion;
    }

    public String getNombrePelicula() {
        return nombrePelicula;
    }

    public void setNombrePelicula(String nombrePelicula) {
        this.nombrePelicula = nombrePelicula;
    }

    public String getHoraPelicula() {
        return horaPelicula;
    }

    public void setHoraPelicula(String horaPelicula) {
        this.horaPelicula = horaPelicula;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }
    
    public List<String> getAsientosSeleccionados() {
        return asientosSeleccionados;
    }
    
    public void setAsientosSeleccionados(List<String> asientosSeleccionados) {
        this.asientosSeleccionados = asientosSeleccionados;
    }
     public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
}
