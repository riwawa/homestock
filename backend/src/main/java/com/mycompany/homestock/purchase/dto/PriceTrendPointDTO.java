package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PriceTrendPointDTO(LocalDateTime purchaseDate, BigDecimal unitPrice) {}