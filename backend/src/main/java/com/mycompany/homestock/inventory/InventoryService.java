package com.mycompany.homestock.inventory;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.house.HouseRepository;
import com.mycompany.homestock.product.Product;
import com.mycompany.homestock.product.ProductRepository;
import jakarta.transaction.Transactional;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final HouseRepository houseRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            HouseRepository houseRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.houseRepository = houseRepository;
    }

    // Buscar ou criar estoque
    public Inventory getOrCreateInventory(UUID houseId) {

        return inventoryRepository.findByHouseId(houseId)
                .orElseGet(() -> {

                    House house = houseRepository.findById(houseId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "House not found: " + houseId
                                    )
                            );

                    Inventory inventory = new Inventory();
                    inventory.setHouse(house);

                    return inventoryRepository.save(inventory);
                });
    }

    // Adicionar estoque
    public Inventory addStock(
            UUID houseId,
            UUID productId,
            int quantity
    ) {

        Inventory inventory = getOrCreateInventory(houseId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: " + productId
                        )
                );

        inventory.addStock(product, quantity);

        return inventoryRepository.save(inventory);
    }

    // Consumir estoque
    public Inventory consumeStock(
            UUID houseId,
            UUID productId,
            int quantity
    ) {

        Inventory inventory = getOrCreateInventory(houseId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: " + productId
                        )
                );

        inventory.consumeStock(product, quantity);

        return inventoryRepository.save(inventory);
    }
    public Inventory removeItem(UUID houseId, UUID productId) {
        Inventory inventory = getOrCreateInventory(houseId);
        inventory.removeItem(productId);
        return inventoryRepository.save(inventory);
    }

}