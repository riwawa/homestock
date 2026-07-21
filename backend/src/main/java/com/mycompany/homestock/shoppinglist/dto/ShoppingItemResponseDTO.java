package com.mycompany.homestock.shoppinglist.dto;

import java.util.UUID;

public record ShoppingItemResponseDTO(
        UUID productId,
        String productName,
        int quantityNeeded
) {}