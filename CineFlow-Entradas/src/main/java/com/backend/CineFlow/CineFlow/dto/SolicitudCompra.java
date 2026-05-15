package com.backend.CineFlow.CineFlow.dto;

import java.util.List;

public class SolicitudCompra {
    private Long idFuncion;
    private String numeroPelicula;
    private String claveFuncion;
    private String nombrePelicula;
    private String horaPelicula;
    private String sala;
    private Long idUsuario;
    private List<String> asientosSeleccionados;
    private String emailComprador;
    private String codigoDescuento;
    private String numeroTarjeta;
    private String metodoPago;
    
    public SolicitudCompra() {
    }
    
    public SolicitudCompra(Long idFuncion, String numeroPelicula, Long idUsuario, List<String> asientosSeleccionados, 
                          String emailComprador, String codigoDescuento, String numeroTarjeta) {
        this.idFuncion = idFuncion;
        this.numeroPelicula = numeroPelicula;
        this.idUsuario = idUsuario;
        this.asientosSeleccionados = asientosSeleccionados;
        this.emailComprador = emailComprador;
        this.codigoDescuento = codigoDescuento;
        this.numeroTarjeta = numeroTarjeta;
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

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    public List<String> getAsientosSeleccionados() {
        return asientosSeleccionados;
    }
    
    public void setAsientosSeleccionados(List<String> asientosSeleccionados) {
        this.asientosSeleccionados = asientosSeleccionados;
    }
    
    public String getEmailComprador() {
        return emailComprador;
    }
    
    public void setEmailComprador(String emailComprador) {
        this.emailComprador = emailComprador;
    }
    
    public String getCodigoDescuento() {
        return codigoDescuento;
    }
    
    public void setCodigoDescuento(String codigoDescuento) {
        this.codigoDescuento = codigoDescuento;
    }
    
    public String getNumeroTarjeta() {
        return numeroTarjeta;
    }
    
    public void setNumeroTarjeta(String numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}