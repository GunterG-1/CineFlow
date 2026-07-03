package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private boolean iniciadoSesion;
    private String mensaje;
    private UsuarioProfileResponse usuario;
}
