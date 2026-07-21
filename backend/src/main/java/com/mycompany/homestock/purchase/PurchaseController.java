package com.mycompany.homestock.purchase;

import com.mycompany.homestock.purchase.dto.PurchaseMapper;
import com.mycompany.homestock.purchase.dto.PurchasePageResponseDTO;
import com.mycompany.homestock.purchase.dto.PurchaseRequestDTO;
import com.mycompany.homestock.purchase.dto.PurchaseResponseDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/houses/{houseId}/purchase")
public class PurchaseController {
    private final PurchaseService purchaseService;
    private final PurchaseMapper purchaseMapper;

    public PurchaseController(PurchaseService purchaseService, PurchaseMapper purchaseMapper) {
        this.purchaseService = purchaseService;
        this.purchaseMapper = purchaseMapper;
    }

    @PostMapping
    public ResponseEntity<PurchaseResponseDTO> createPurchase(
            @PathVariable UUID houseId,
            @RequestBody PurchaseRequestDTO dto
    ) {
        Purchase purchase = purchaseService.createPurchase(
                houseId, dto.productId(), dto.quantity(), dto.unitPrice()
        );
        return ResponseEntity.status(201).body(purchaseMapper.toResponseDTO(purchase));
    }

    @GetMapping
    public ResponseEntity<PurchasePageResponseDTO> getPurchaseHistory(
            @PathVariable UUID houseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Purchase> result = purchaseService.getByHouseId(houseId, PageRequest.of(page, size));
        List<PurchaseResponseDTO> content = result.getContent()
                .stream()
                .map(purchaseMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(new PurchasePageResponseDTO(
                content,
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.hasNext()
        ));
    }
}