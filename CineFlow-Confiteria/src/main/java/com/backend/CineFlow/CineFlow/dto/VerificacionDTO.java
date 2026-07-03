package com.backend.CineFlow.CineFlow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificacionDTO {
    
    @NotNull
    @NonNull
    private String numeroTicket;
    private long idPedido;
    private boolean verificado;
    private String mensaje;
    private PedidoDTO pedido;
}
