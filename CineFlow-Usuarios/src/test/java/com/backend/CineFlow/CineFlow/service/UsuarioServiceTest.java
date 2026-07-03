package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.ActualizarUsuarioDTO;
import com.backend.CineFlow.CineFlow.model.Usuario;
import com.backend.CineFlow.CineFlow.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void actualizarUsuarioDesdeDTOActualizaMetodoDePagoYNombres() {
        Usuario existente = new Usuario(1L, "Ana", "Lopez", "ana@cineflow.com", "1234", LocalDate.of(1995, 5, 15), null);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActualizarUsuarioDTO dto = new ActualizarUsuarioDTO("Ana Maria", "Perez", null, null, "Tarjeta");

        Usuario actualizado = usuarioService.actualizarUsuarioDesdeDTO(1L, dto);

        assertEquals("Ana Maria", actualizado.getNombreUsuario());
        assertEquals("Perez", actualizado.getApellidoUsuario());
        assertEquals("Tarjeta", actualizado.getMetodoPago());
        verify(usuarioRepository).save(existente);
    }

    @Test
    void registrarUsuarioLanzaErrorSiLasContrasenasNoCoinciden() {
        com.backend.CineFlow.CineFlow.dto.RegistroDTO registro = new com.backend.CineFlow.CineFlow.dto.RegistroDTO();
        registro.setNombre("Ana");
        registro.setApellido("Lopez");
        registro.setCorreo("ana@cineflow.com");
        registro.setContrasena("1234");
        registro.setConfirmarContrasena("abcd");
        registro.setFechaNacimiento(LocalDate.of(1995, 5, 15));

        assertThrows(IllegalArgumentException.class, () -> usuarioService.registrarUsuario(registro));
    }

    @Test
    void toProfileMarcaAdminsPorDominioDeCorreo() {
        Usuario usuario = new Usuario(2L, "Ana", "Lopez", "ana@duocuc.cl", "1234", LocalDate.of(1995, 5, 15), "Tarjeta");

        assertTrue(usuarioService.toProfile(usuario).getIsAdmin());
    }

    @Test
    void obtenerEstadisticasCuentaAdminsYMetodosDePago() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(
                new Usuario(1L, "Ana", "Lopez", "ana@duocuc.cl", "1234", LocalDate.of(1995, 5, 15), "Tarjeta"),
                new Usuario(2L, "Luis", "Perez", "luis@cineflow.com", "1234", LocalDate.of(1993, 3, 10), "")
        ));

        var stats = usuarioService.obtenerEstadisticas();

        assertEquals(2, stats.getTotalUsuarios());
        assertEquals(1, stats.getUsuariosAdmin());
        assertEquals(1, stats.getUsuariosConMetodoPago());
    }
}