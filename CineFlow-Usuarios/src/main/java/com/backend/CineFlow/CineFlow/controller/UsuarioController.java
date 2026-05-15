package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.ActualizarUsuarioDTO;
import com.backend.CineFlow.CineFlow.dto.LoginRequest;
import com.backend.CineFlow.CineFlow.dto.LoginResponse;
import com.backend.CineFlow.CineFlow.dto.RegistroDTO;
import com.backend.CineFlow.CineFlow.dto.UsuarioProfileResponse;
import com.backend.CineFlow.CineFlow.model.Usuario;
import com.backend.CineFlow.CineFlow.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Operaciones de registro, login y actualización de perfil")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET: Obtener todos los usuarios
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Devuelve todos los usuarios registrados.")
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        List<Usuario> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(usuarios);
    }

    // GET: Obtener usuario por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por id", description = "Busca un usuario por su identificador.")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable long id) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET: Obtener usuario por correo
    @GetMapping("/correo/{correo}")
    @Operation(summary = "Obtener usuario por correo", description = "Busca un usuario por su correo electrónico.")
    public ResponseEntity<Usuario> obtenerPorCorreo(@PathVariable String correo) {
        Optional<Usuario> usuario = usuarioService.obtenerPorCorreo(correo);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Register (crea usuario) - Nuevo método con DTO
    @PostMapping("/registrar")
    @Operation(summary = "Registrar usuario", description = "Crea un usuario nuevo con validación de contraseñas.")
    public ResponseEntity<?> register(@Valid @RequestBody RegistroDTO registroDTO) {
        try {
            Usuario usuarioCreado = usuarioService.registrarUsuario(registroDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.toProfile(usuarioCreado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // POST: Register (método antiguo para compatibilidad)
    @PostMapping("/registrar-completo")
    @Operation(summary = "Registrar usuario completo", description = "Crea un usuario usando la entidad completa para compatibilidad.")
    public ResponseEntity<UsuarioProfileResponse> registerCompleto(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.toProfile(usuarioCreado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST: Login
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Valida credenciales y devuelve el perfil del usuario autenticado.")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuario = usuarioService.autenticar(request.getCorreo(), request.getContrasena());
        if (usuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Credenciales invalidas", null));
        }

        UsuarioProfileResponse profile = usuarioService.toProfile(usuario.get());
        return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", profile));
    }

    // GET: Perfil por correo
    @GetMapping("/perfil")
    @Operation(summary = "Consultar perfil por correo", description = "Obtiene el perfil seguro de un usuario por correo.")
    public ResponseEntity<UsuarioProfileResponse> profile(@RequestParam String correo) {
        Optional<Usuario> usuario = usuarioService.obtenerPorCorreo(correo);
        return usuario.map(value -> ResponseEntity.ok(usuarioService.toProfile(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT: Actualizar usuario
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos principales del usuario.")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable long id, @Valid @RequestBody Usuario usuarioActualizado) {
        try {
            Usuario usuario = usuarioService.actualizarUsuario(id, usuarioActualizado);
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Actualizar usuario con método de pago (nuevo método con DTO)
    @PutMapping("/{id}/actualizar")
    @Operation(summary = "Actualizar perfil con método de pago", description = "Actualiza datos del perfil y método de pago desde el checkout.")
    public ResponseEntity<?> actualizarUsuarioConMetodoPago(@PathVariable long id, @Valid @RequestBody ActualizarUsuarioDTO dto) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuarioDesdeDTO(id, dto);
            return ResponseEntity.ok(usuarioService.toProfile(usuarioActualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    // DELETE: Eliminar usuario
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por su identificador.")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: Verificar si existe un correo
    @GetMapping("/existe-correo/{correo}")
    @Operation(summary = "Verificar correo", description = "Indica si un correo ya existe en la base de datos.")
    public ResponseEntity<Boolean> existeCorreo(@PathVariable String correo) {
        boolean existe = usuarioService.existeCorreo(correo);
        return ResponseEntity.ok(existe);
    }

    private record ErrorResponse(String message) {
    }
}

