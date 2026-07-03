package com.backend.CineFlow.CineFlow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationRequest {

    private String to;
    private String subject;
    private String body;
}
