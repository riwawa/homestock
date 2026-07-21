package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PurchaseResponseDTO(
    UUID id,
    UUID houseId,
    UUID productId,
    String productName,
    int quantity,
    BigDecimal unitPrice,
    BigDecimal totalPrice,
    LocalDateTime purchaseDate
) {}