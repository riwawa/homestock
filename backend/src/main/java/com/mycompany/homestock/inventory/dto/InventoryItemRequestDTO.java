package com.mycompany.homestock.inventory.dto;

import java.util.UUID;

public record InventoryItemRequestDTO(
        UUID productId,
        int quantity
) {}