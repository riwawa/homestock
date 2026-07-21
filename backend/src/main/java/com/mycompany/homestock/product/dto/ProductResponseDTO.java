package com.mycompany.homestock.product.dto;

import java.util.UUID;

public record ProductResponseDTO(
    UUID id,
    String name,
    String category,
    String unitOfMeasure,
    int minimumQuantity,
    boolean active
) {}