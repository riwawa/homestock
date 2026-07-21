package com.mycompany.homestock.shoppinglist.dto;

import java.util.UUID;

public record ShoppingItemRequestDTO(
        UUID productId,
        int quantityNeeded
) {}
