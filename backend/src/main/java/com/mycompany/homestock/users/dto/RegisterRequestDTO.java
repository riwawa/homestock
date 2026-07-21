package com.mycompany.homestock.users.dto;

public record RegisterRequestDTO(
    String email,
    String password,
    String name
) {}