package com.mycompany.homestock.purchase;

import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
    Page<Purchase> findByHouseIdOrderByPurchaseDateDesc(UUID houseId, Pageable pageable);
    // PurchaseRepository.java — adicionar estes quatro métodos

    @Query(value = """
        SELECT to_char(p.purchase_date, 'YYYY-MM') as month,
               SUM(p.quantity * p.unit_price) as total
        FROM purchase p
        WHERE p.house_id = :houseId AND p.purchase_date >= :since
        GROUP BY month
        ORDER BY month
        """, nativeQuery = true)
    List<Object[]> findMonthlySpend(@Param("houseId") UUID houseId, @Param("since") LocalDateTime since);

    @Query(value = """
        SELECT pr.categoria as category,
               SUM(p.quantity * p.unit_price) as total
        FROM purchase p
        JOIN product pr ON pr.id = p.product_id
        WHERE p.house_id = :houseId AND p.purchase_date >= :since
        GROUP BY pr.categoria
        ORDER BY total DESC
        """, nativeQuery = true)
    List<Object[]> findSpendByCategory(@Param("houseId") UUID houseId, @Param("since") LocalDateTime since);

    @Query(value = """
        SELECT p.product_id, pr.nome,
               SUM(p.quantity) as totalQuantity,
               SUM(p.quantity * p.unit_price) as totalSpent
        FROM purchase p
        JOIN product pr ON pr.id = p.product_id
        WHERE p.house_id = :houseId AND p.purchase_date >= :since
        GROUP BY p.product_id, pr.nome
        ORDER BY totalSpent DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopProducts(@Param("houseId") UUID houseId, @Param("since") LocalDateTime since, @Param("limit") int limit);

    List<Purchase> findByHouseIdAndProductIdAndPurchaseDateGreaterThanEqualOrderByPurchaseDateAsc(
        UUID houseId, UUID productId, LocalDateTime since
    );
}