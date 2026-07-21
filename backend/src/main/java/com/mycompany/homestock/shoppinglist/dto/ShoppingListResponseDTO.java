package com.mycompany.homestock.shoppinglist.dto;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.shoppinglist.ShoppingItem;
import java.util.List;
import java.util.UUID;

public record ShoppingListResponseDTO(
        UUID id,
        List<ShoppingItemResponseDTO> items    
) {}