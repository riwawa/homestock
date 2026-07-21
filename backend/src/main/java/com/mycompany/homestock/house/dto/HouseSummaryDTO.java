package com.mycompany.homestock.house.dto;

import java.util.UUID;

public record HouseSummaryDTO(
        UUID id,
        String name
) {}