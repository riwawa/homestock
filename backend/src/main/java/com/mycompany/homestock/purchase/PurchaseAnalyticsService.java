package com.mycompany.homestock.purchase;

import com.mycompany.homestock.purchase.dto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseAnalyticsService {
    private final PurchaseRepository purchaseRepository;

    public PurchaseAnalyticsService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    public List<MonthlySpendDTO> getMonthlySpend(UUID houseId, int months) {
        LocalDateTime since = LocalDateTime.now().minusMonths(months);
        return purchaseRepository.findMonthlySpend(houseId, since).stream()
                .map(row -> new MonthlySpendDTO((String) row[0], (BigDecimal) row[1]))
                .toList();
    }

    public List<CategorySpendDTO> getSpendByCategory(UUID houseId, int months) {
        LocalDateTime since = LocalDateTime.now().minusMonths(months);
        return purchaseRepository.findSpendByCategory(houseId, since).stream()
                .map(row -> new CategorySpendDTO(
                        row[0] != null ? (String) row[0] : "Sem categoria",
                        (BigDecimal) row[1]
                ))
                .toList();
    }

    public List<TopProductDTO> getTopProducts(UUID houseId, int months, int limit) {
        LocalDateTime since = LocalDateTime.now().minusMonths(months);
        return purchaseRepository.findTopProducts(houseId, since, limit).stream()
                .map(row -> new TopProductDTO(
                        (UUID) row[0],
                        (String) row[1],
                        ((Number) row[2]).intValue(),
                        (BigDecimal) row[3]
                ))
                .toList();
    }

    public List<PriceTrendPointDTO> getPriceTrend(UUID houseId, UUID productId, int months) {
        LocalDateTime since = LocalDateTime.now().minusMonths(months);
        return purchaseRepository
                .findByHouseIdAndProductIdAndPurchaseDateGreaterThanEqualOrderByPurchaseDateAsc(houseId, productId, since)
                .stream()
                .map(p -> new PriceTrendPointDTO(p.getPurchaseDate(), p.getUnitPrice()))
                .toList();
    }
}