package com.backend.CineFlow.CineFlow.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(unique = false, length = 25, nullable = false)
    @JsonAlias({"nombre"})
    @NotBlank
    private String nombreUsuario;

    @Column(unique = false, length = 25, nullable = false)
    @JsonAlias({"apellido"})
    @NotBlank
    private String apellidoUsuario; 

    @Column(unique = true, length = 50, nullable = false)
    @JsonAlias({"email"})
    @NotBlank
    private String correo;

    @Column(unique = false, length = 25, nullable = false)
    @JsonAlias({"password"})
    @NotBlank
    private String contrasena;

    @Column(nullable = false)
    @JsonAlias({"fechaNacimiento", "fecha_nacimiento"})
    @NotNull
    private LocalDate fechaNacimiento;

    @Column(length = 100, nullable = true)
    private String metodoPago;
}
