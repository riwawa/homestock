package com.mycompany.homestock.purchase;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.house.HouseMemberRepository;
import com.mycompany.homestock.house.HouseRepository;
import com.mycompany.homestock.inventory.InventoryService;
import com.mycompany.homestock.product.Product;
import com.mycompany.homestock.product.ProductRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final InventoryService inventoryService;
    private final HouseRepository houseRepository;
    private final ProductRepository productRepository;
    private final HouseMemberRepository houseMemberRepository;


    public PurchaseService(
            PurchaseRepository purchaseRepository,
            InventoryService inventoryService,
            HouseRepository houseRepository,
            ProductRepository productRepository,
            HouseMemberRepository houseMemberRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.inventoryService = inventoryService;
        this.houseRepository = houseRepository;
        this.productRepository = productRepository;
        this.houseMemberRepository = houseMemberRepository;
    }

    @Transactional
    public Purchase createPurchase(UUID houseId, UUID productId, int quantity, BigDecimal unitPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + productId));

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new IllegalArgumentException("Casa não encontrada: " + houseId));

        Purchase purchase = new Purchase();
        purchase.setHouse(house);
        purchase.setProduct(product);
        purchase.setQuantity(quantity);
        purchase.setUnitPrice(unitPrice);
        purchase.setPurchaseDate(LocalDateTime.now());

        Purchase savedPurchase = purchaseRepository.save(purchase);

        inventoryService.addStock(houseId, productId, quantity);

        return savedPurchase;
    }
    public Page<Purchase> getByHouseId(UUID houseId, Pageable pageable) {
        return purchaseRepository.findByHouseIdOrderByPurchaseDateDesc(houseId, pageable);
    }
    public void deletePurchase(UUID purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new IllegalArgumentException("Compra não encontrada: " + purchaseId));
        purchaseRepository.delete(purchase);
    }
    
    public void deletePurchase(UUID purchaseId, UUID currentUserId) throws AccessDeniedException {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new IllegalArgumentException("Compra não encontrada: " + purchaseId));

        UUID houseId = purchase.getHouse().getId();
        boolean isMember = houseMemberRepository.existsByUserIdAndHouseId(currentUserId, houseId);

        if (!isMember) {
            throw new AccessDeniedException("Você não tem acesso a essa compra");
        }

        purchaseRepository.delete(purchase);
    }
    
}