package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class EstadoButacaSerializer extends StdSerializer<String> {

    public EstadoButacaSerializer() {
        super(String.class);
    }

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }

        String estado = switch (value) {
            case "AVAILABLE" -> "DISPONIBLE";
            case "RESERVED" -> "RESERVADO";
            case "SOLD" -> "VENDIDO";
            default -> value;
        };

        gen.writeString(estado);
    }
}
