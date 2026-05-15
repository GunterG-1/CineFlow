package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UsuarioProfileResponse {
    private Long idUsuario;
    private String nombreUsuario;
    private String apellidoUsuario;
    private String correo;
    private LocalDate fechaNacimiento;
    private String metodoPago;
}
