package com.mycompany.homestock.purchase.dto;

import java.math.BigDecimal;

public record MonthlySpendDTO(String month, BigDecimal total) {}