package com.mycompany.homestock.product.dto;

public record ProductRequestDTO(
    String name,
    String category,
    String unitOfMeasure,
    int minimumQuantity
) {}