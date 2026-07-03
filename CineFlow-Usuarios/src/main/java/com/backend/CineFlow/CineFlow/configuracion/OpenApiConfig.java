package com.backend.CineFlow.CineFlow.configuracion;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "CineFlow - Microservicio de Usuarios",
        version = "1.0.0",
        description = "API para registro, autenticación y actualización de perfiles de usuario.",
        contact = @Contact(name = "CineFlow")
    ),
    servers = {
        @Server(url = "http://localhost:8081", description = "Servidor local")
    }
)
public class OpenApiConfig {
}