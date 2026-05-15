package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.NotificationRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void sendUsaFromPorDefectoCuandoNoHayUsuarioConfigurado() {
        ReflectionTestUtils.setField(notificationService, "defaultFrom", "no-reply@cineflow.local");

        NotificationRequest request = new NotificationRequest();
        request.setTo("cliente@cineflow.com");
        request.setSubject("Compra confirmada");
        request.setBody("Tu compra fue procesada correctamente.");

        notificationService.send(request);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();
        assertEquals("cliente@cineflow.com", message.getTo()[0]);
        assertEquals("Compra confirmada", message.getSubject());
        assertEquals("Tu compra fue procesada correctamente.", message.getText());
        assertEquals("no-reply@cineflow.local", message.getFrom());
    }

    @Test
    void sendLanzaExcepcionCuandoFaltaDestinatario() {
        NotificationRequest request = new NotificationRequest();
        request.setSubject("Compra confirmada");
        request.setBody("Contenido");

        assertThrows(IllegalArgumentException.class, () -> notificationService.send(request));
    }
}