package com.mycompany.homestock.inventory.dto;

import java.util.List;
import java.util.UUID;

public record InventoryResponseDTO(
        UUID id,
        UUID houseId,
        List<InventoryItemResponseDTO> items
) {
}