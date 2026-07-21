package com.mycompany.homestock.purchase;

import com.mycompany.homestock.purchase.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/houses/{houseId}/purchase/analytics")
public class PurchaseAnalyticsController {
    private final PurchaseAnalyticsService analyticsService;

    public PurchaseAnalyticsController(PurchaseAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/monthly-spend")
    public ResponseEntity<List<MonthlySpendDTO>> getMonthlySpend(
            @PathVariable UUID houseId,
            @RequestParam(defaultValue = "3") int months
    ) {
        return ResponseEntity.ok(analyticsService.getMonthlySpend(houseId, months));
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<CategorySpendDTO>> getSpendByCategory(
            @PathVariable UUID houseId,
            @RequestParam(defaultValue = "3") int months
    ) {
        return ResponseEntity.ok(analyticsService.getSpendByCategory(houseId, months));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts(
            @PathVariable UUID houseId,
            @RequestParam(defaultValue = "3") int months,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(analyticsService.getTopProducts(houseId, months, limit));
    }

    @GetMapping("/price-trend/{productId}")
    public ResponseEntity<List<PriceTrendPointDTO>> getPriceTrend(
            @PathVariable UUID houseId,
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "3") int months
    ) {
        return ResponseEntity.ok(analyticsService.getPriceTrend(houseId, productId, months));
    }
}