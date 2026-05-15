package com.backend.CineFlow.CineFlow.configuracion;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "CineFlow - Microservicio de Entradas",
        version = "1.0.0",
        description = "API para reserva, pago, disponibilidad de asientos y notificaciones de entradas.",
        contact = @Contact(name = "CineFlow")
    ),
    servers = {
        @Server(url = "http://localhost:8084", description = "Servidor local")
    }
)
public class OpenApiConfig {
}