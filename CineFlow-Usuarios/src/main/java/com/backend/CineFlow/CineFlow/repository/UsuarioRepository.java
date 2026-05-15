package com.backend.CineFlow.CineFlow.repository;

import com.backend.CineFlow.CineFlow.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por correo
    Optional<Usuario> findByCorreo(String correo);

    // Buscar usuario para login
    Optional<Usuario> findByCorreoAndContrasena(String correo, String contrasena);
    
    // Verificar si existe un usuario por correo
    boolean existsByCorreo(String correo);
}
