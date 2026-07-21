package com.mycompany.homestock.purchase.dto;

import java.util.List;

public record PurchasePageResponseDTO(
    List<PurchaseResponseDTO> content,
    int page,
    int totalPages,
    long totalElements,
    boolean hasNext
) {}