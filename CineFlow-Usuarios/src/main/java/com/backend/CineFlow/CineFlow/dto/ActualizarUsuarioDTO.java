package com.backend.CineFlow.CineFlow.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActualizarUsuarioDTO {

    @JsonAlias({"nombre"})
    private String nombre;

    @JsonAlias({"apellido"})
    private String apellido;

    @JsonAlias({"password", "contrasena"})
    private String contrasena;
    private String confirmarContrasena;


    
    // ✅ OPCIONAL: Si llega, se guarda; si no, se ignora.
    @JsonAlias({"metodoPago", "payment_method", "metodo_pago"})
    private String metodoPago; 
}
