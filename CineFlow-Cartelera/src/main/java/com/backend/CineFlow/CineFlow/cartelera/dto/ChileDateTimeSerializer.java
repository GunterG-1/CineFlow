package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class ChileDateTimeSerializer extends StdSerializer<LocalDateTime> {

    private static final ZoneId CHILE_ZONE = ZoneId.of("America/Santiago");
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public ChileDateTimeSerializer() {
        super(LocalDateTime.class);
    }

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }

        // Convertir a zona horaria de Chile
        ZonedDateTime chileTime = value.atZone(ZoneId.systemDefault()).withZoneSameInstant(CHILE_ZONE);
        String formatted = chileTime.format(FORMATTER);
        
        gen.writeString(formatted);
    }
}
