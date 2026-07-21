package com.mycompany.homestock.purchase;

import com.mycompany.homestock.security.AuthenticatedUser;
import java.nio.file.AccessDeniedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseDeleteController {
    private final PurchaseService purchaseService;

    public PurchaseDeleteController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser currentUser
    ) throws AccessDeniedException {
        purchaseService.deletePurchase(id, currentUser.id());
        return ResponseEntity.noContent().build();
    }
}