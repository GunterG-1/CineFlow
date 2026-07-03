package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioStatsResponse {
    private long totalUsuarios;
    private long usuariosAdmin;
    private long usuariosConMetodoPago;
}