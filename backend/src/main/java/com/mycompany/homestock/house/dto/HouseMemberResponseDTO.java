package com.mycompany.homestock.house.dto;

import java.util.UUID;

public record HouseMemberResponseDTO(
    UUID userId,
    String name,
    String email,
    String role
) {}