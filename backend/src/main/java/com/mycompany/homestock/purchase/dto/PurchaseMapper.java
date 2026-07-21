package com.mycompany.homestock.purchase.dto;

import com.mycompany.homestock.purchase.Purchase;
import org.springframework.stereotype.Component;

@Component
public class PurchaseMapper {
    public PurchaseResponseDTO toResponseDTO(Purchase purchase) {
        if (purchase == null) {
            return null;
        }
        return new PurchaseResponseDTO(
                purchase.getId(),
                purchase.getHouse().getId(),
                purchase.getProduct().getId(),
                purchase.getProduct().getNome(),
                purchase.getQuantity(),
                purchase.getUnitPrice(),
                purchase.getTotalPrice(),
                purchase.getPurchaseDate()
        );
    }
}