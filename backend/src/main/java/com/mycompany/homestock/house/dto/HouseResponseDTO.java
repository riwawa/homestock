package com.mycompany.homestock.house.dto;

import com.mycompany.homestock.inventory.dto.InventoryResponseDTO;
import com.mycompany.homestock.shoppinglist.dto.ShoppingListResponseDTO;
import java.util.List;
import java.util.UUID;

public record HouseResponseDTO(
        UUID id,
        String name,
        InventoryResponseDTO inventory,
        List<String> residents
) {}