package com.mycompany.homestock.inventory.dto;

import com.mycompany.homestock.inventory.Inventory;
import com.mycompany.homestock.inventory.InventoryItem;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponseDTO toResponseDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        List<InventoryItemResponseDTO> items =
                inventory.getItems()
                        .stream()
                        .map(this::toItemResponseDTO)
                        .toList();

        return new InventoryResponseDTO(
                inventory.getId(),
                inventory.getHouse().getId(),
                items
        );
    }

    private InventoryItemResponseDTO toItemResponseDTO(
            InventoryItem item
    ) {

        return new InventoryItemResponseDTO(
                item.getProduct().getId(),
                item.getProduct().getNome(),
                item.getQuantity()
        );
    }
}