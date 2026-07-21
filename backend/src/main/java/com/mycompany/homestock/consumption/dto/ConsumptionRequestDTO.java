package com.mycompany.homestock.consumption.dto;

import java.util.UUID;


public record ConsumptionRequestDTO(
    UUID houseId,
    UUID productId,
    int quantity
) {}
        

