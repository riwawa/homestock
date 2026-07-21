package com.mycompany.homestock.consumption.dto;

import com.mycompany.homestock.consumption.Consumption;
import org.springframework.stereotype.Component;

@Component
public class ConsumptionMapper {
    public ConsumptionResponseDTO toResponseDTO(Consumption consumption) {
        if (consumption == null) {
            return null;
        }
        
    return new ConsumptionResponseDTO(
            consumption.getId(),
            consumption.getHouse().getId(),
            consumption.getProduct().getId(),
            consumption.getQuantidadeConsumida(),
            consumption.getDate()
    );
}
}


