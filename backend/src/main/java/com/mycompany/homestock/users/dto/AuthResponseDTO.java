package com.mycompany.homestock.users.dto;

import java.util.UUID;

public record AuthResponseDTO(
    String token,
    UUID userId,
    String name,
    String email
) {}