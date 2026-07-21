package com.mycompany.homestock.shoppinglist.dto;


import com.mycompany.homestock.shoppinglist.ShoppingList;
import com.mycompany.homestock.shoppinglist.ShoppingItem;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShoppingListMapper {


    public ShoppingListResponseDTO toResponseDTO(
            ShoppingList shoppingList
    ) {
        List<ShoppingItemResponseDTO> items =
                shoppingList.getItems()
                        .stream()
                        .map(this::toItemResponseDTO)
                        .toList();

        return new ShoppingListResponseDTO(
                shoppingList.getId(),
                items
        );
    }

    private ShoppingItemResponseDTO toItemResponseDTO(
            ShoppingItem item
    ) {

        return new ShoppingItemResponseDTO(
                item.getProduct().getId(),
                item.getProduct().getNome(),
                item.getQuantityNeeded()
        );
    }
}