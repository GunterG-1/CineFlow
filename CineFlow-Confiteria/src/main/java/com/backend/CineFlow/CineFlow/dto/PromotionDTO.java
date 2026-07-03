package com.backend.CineFlow.CineFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionDTO {
    private Long id;
    private String title;
    private String description;
    private String discount;
    private String emoji;
}
