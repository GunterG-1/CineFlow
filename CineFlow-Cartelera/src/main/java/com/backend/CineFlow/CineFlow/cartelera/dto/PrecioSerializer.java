package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class PrecioSerializer extends StdSerializer<BigDecimal> {

    public PrecioSerializer() {
        super(BigDecimal.class);
    }

    @Override
    public void serialize(BigDecimal value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }

        // Formato chileno: 1.250,50 (punto para miles, coma para decimales)
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.forLanguageTag("es-CL"));
        DecimalFormat df = new DecimalFormat("#,##0.00", symbols);
        String formatted = df.format(value);
        
        gen.writeString(formatted);
    }
}
