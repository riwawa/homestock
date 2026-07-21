package com.mycompany.homestock.inventory.dto;

import java.util.UUID;

public record InventoryItemResponseDTO(
        UUID productId,
        String productName,
        int quantity
) {
}