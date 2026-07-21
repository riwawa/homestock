package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TopProductDTO(
    UUID productId,
    String productName,
    int totalQuantity,
    BigDecimal totalSpent
) {}