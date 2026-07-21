package com.mycompany.homestock.consumption;

import com.mycompany.homestock.consumption.dto.ConsumptionMapper;
import com.mycompany.homestock.consumption.dto.ConsumptionResponseDTO;
import com.mycompany.homestock.consumption.dto.ConsumptionRequestDTO;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.UUID;

@RestController
@RequestMapping("/api/consumption")
public class ConsumptionController {
    private final ConsumptionService consumptionService;
    private final ConsumptionMapper consumptionMapper;

    public ConsumptionController(
            ConsumptionService consumptionService, 
            ConsumptionMapper consumptionMapper
    ) {
        this.consumptionService = consumptionService;
        this.consumptionMapper = consumptionMapper;
    }
    
    @PostMapping
    public ResponseEntity<ConsumptionResponseDTO> createConsumption(
            @RequestBody ConsumptionRequestDTO dto
    ) {

        Consumption consumption = consumptionService.createConsumption(
                dto.houseId(),
                dto.productId(),
                dto.quantity()
        );

        return ResponseEntity
                .status(201)
                .body(consumptionMapper.toResponseDTO(consumption));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumptionResponseDTO> getConsumption(
            @PathVariable UUID id
    ) {

        Consumption consumption =
                consumptionService.getById(id);

        return ResponseEntity.ok(
                consumptionMapper.toResponseDTO(consumption)
        );
    }
}
