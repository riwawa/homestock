package com.mycompany.homestock.users.dto;

public record LoginRequestDTO(
    String email,
    String password
) {}