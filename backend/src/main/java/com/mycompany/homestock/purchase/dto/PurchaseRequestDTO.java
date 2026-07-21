package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseRequestDTO(
    UUID productId,
    int quantity,
    BigDecimal unitPrice
) {}