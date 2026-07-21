package com.mycompany.homestock.inventory;

import com.mycompany.homestock.inventory.dto.InventoryItemRequestDTO;
import com.mycompany.homestock.inventory.dto.InventoryMapper;
import com.mycompany.homestock.inventory.dto.InventoryResponseDTO;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/houses/{houseId}/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    private final InventoryMapper inventoryMapper;

    public InventoryController(InventoryService inventoryService, InventoryMapper inventoryMapper) {
        this.inventoryService = inventoryService;
        this.inventoryMapper = inventoryMapper;
    }

    @GetMapping
    public ResponseEntity<InventoryResponseDTO> getInventory(@PathVariable UUID houseId) {
        Inventory inventory = inventoryService.getOrCreateInventory(houseId);
        return ResponseEntity.ok(inventoryMapper.toResponseDTO(inventory));
    }

    @PostMapping("/add")
    public ResponseEntity<InventoryResponseDTO> addStock(
            @PathVariable UUID houseId,
            @RequestBody InventoryItemRequestDTO dto
    ) {
        Inventory inventory = inventoryService.addStock(houseId, dto.productId(), dto.quantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryMapper.toResponseDTO(inventory));
    }

    @PutMapping("/consume")
    public ResponseEntity<InventoryResponseDTO> consumeStock(
            @PathVariable UUID houseId,
            @RequestBody InventoryItemRequestDTO dto
    ) {
        Inventory inventory = inventoryService.consumeStock(houseId, dto.productId(), dto.quantity());
        return ResponseEntity.ok(inventoryMapper.toResponseDTO(inventory));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<InventoryResponseDTO> removeItem(
            @PathVariable UUID houseId,
            @PathVariable UUID productId
    ) {
        Inventory inventory = inventoryService.removeItem(houseId, productId);
        return ResponseEntity.ok(inventoryMapper.toResponseDTO(inventory));
    }
}