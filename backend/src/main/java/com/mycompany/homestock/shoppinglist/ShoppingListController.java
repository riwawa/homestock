package com.mycompany.homestock.shoppinglist;

import com.mycompany.homestock.shoppinglist.dto.ShoppingItemRequestDTO;
import com.mycompany.homestock.shoppinglist.dto.ShoppingListMapper;
import com.mycompany.homestock.shoppinglist.dto.ShoppingListResponseDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/houses/{houseId}/shopping-list")
public class ShoppingListController {
    private final ShoppingListService shoppingListService;
    private final ShoppingListMapper shoppingListMapper;

    public ShoppingListController(
            ShoppingListService shoppingListService,
            ShoppingListMapper shoppingListMapper
    ) {
        this.shoppingListService = shoppingListService;
        this.shoppingListMapper = shoppingListMapper;
    }

    @GetMapping
    public ResponseEntity<ShoppingListResponseDTO> getShoppingList(@PathVariable UUID houseId) {
        ShoppingList list = shoppingListService.getOrCreate(houseId);
        return ResponseEntity.ok(shoppingListMapper.toResponseDTO(list));
    }

    @PostMapping("/generate")
    public ResponseEntity<ShoppingListResponseDTO> generateList(@PathVariable UUID houseId) {
        ShoppingList list = shoppingListService.generate(houseId);
        return ResponseEntity.ok(shoppingListMapper.toResponseDTO(list));
    }

    @PostMapping("/items")
    public ResponseEntity<ShoppingListResponseDTO> adicionarItem(
            @PathVariable UUID houseId,
            @RequestBody ShoppingItemRequestDTO dto
    ) {
        ShoppingList list = shoppingListService.addItem(houseId, dto.productId(), dto.quantityNeeded());
        return ResponseEntity.status(201).body(shoppingListMapper.toResponseDTO(list));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ShoppingListResponseDTO> removerItem(
            @PathVariable UUID houseId,
            @PathVariable UUID productId
    ) {
        ShoppingList list = shoppingListService.removeItem(houseId, productId);
        return ResponseEntity.ok(shoppingListMapper.toResponseDTO(list));
    }
}