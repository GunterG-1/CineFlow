package com.backend.CineFlow.CineFlow.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroDTO {

    @NotBlank(message = "El nombre es requerido")
    @JsonAlias({"nombre"})
    private String nombre;

    @NotBlank(message = "El apellido es requerido")
    @JsonAlias({"apellido"})
    private String apellido;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "El correo debe ser válido")
    @JsonAlias({"email", "correo"})
    private String correo;

    @NotBlank(message = "La contraseña es requerida")
    @JsonAlias({"password", "contrasena"})
    private String contrasena;

    @NotBlank(message = "Debe confirmar la contraseña")
    @JsonAlias({"passwordConfirm", "confirmarContrasena", "repetirContrasena"})
    private String confirmarContrasena;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @JsonAlias({"fechaNacimiento", "fecha_nacimiento", "birthDate"})
    private LocalDate fechaNacimiento;
}
