package com.mycompany.homestock.house.dto;

import java.util.List;

public record HouseRequestDTO(
        String name,
        List<String> residents
) {}