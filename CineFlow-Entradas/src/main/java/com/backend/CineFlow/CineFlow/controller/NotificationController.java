package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.NotificationRequest;
import com.backend.CineFlow.CineFlow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")

@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(@RequestBody NotificationRequest request) {
        try {
            notificationService.send(request);
            return ResponseEntity.ok(Map.of(
                "exito", true,
                "mensaje", "Notificacion enviada"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "exito", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "exito", false,
                "error", "No se pudo enviar la notificacion"
            ));
        }
    }
}
