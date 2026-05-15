package com.backend.CineFlow.CineFlow.configuracion;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "CineFlow - Microservicio de Confitería",
        version = "1.0.0",
        description = "API para menú, pedidos, estados y verificación de tickets de confitería.",
        contact = @Contact(name = "CineFlow")
    ),
    servers = {
        @Server(url = "http://localhost:8083", description = "Servidor local")
    }
)
public class OpenApiConfig {
}