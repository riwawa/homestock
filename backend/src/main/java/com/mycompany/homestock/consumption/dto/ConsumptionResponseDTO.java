package com.mycompany.homestock.consumption.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsumptionResponseDTO(
    UUID id,
    UUID houseId,
    UUID productId,
    int quantity,
    LocalDateTime date
) {}