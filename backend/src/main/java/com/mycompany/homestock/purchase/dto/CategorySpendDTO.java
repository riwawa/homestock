package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;

public record CategorySpendDTO(String category, BigDecimal total) {}