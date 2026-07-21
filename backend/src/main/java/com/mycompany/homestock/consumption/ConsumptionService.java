package com.mycompany.homestock.consumption;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.house.HouseRepository;
import com.mycompany.homestock.inventory.InventoryService;
import com.mycompany.homestock.product.Product;
import com.mycompany.homestock.product.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class ConsumptionService {

    private final ConsumptionRepository consumptionRepository;
    private final InventoryService inventoryService;
    private final ProductRepository productRepository;
    private final HouseRepository houseRepository;

    public ConsumptionService(
            ConsumptionRepository consumptionRepository,
            InventoryService inventoryService,
            ProductRepository productRepository,
            HouseRepository houseRepository
    ) {
        this.consumptionRepository = consumptionRepository;
        this.inventoryService = inventoryService;
        this.productRepository = productRepository;
        this.houseRepository = houseRepository;
    }

    // Registrar consumo
    public Consumption createConsumption(
            UUID houseId,
            UUID productId,
            int quantity
    ) {

        House house = houseRepository.findById(houseId)
                .orElseThrow(() ->
                        new RuntimeException("House not found: " + houseId)
                );

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found: " + productId)
                );

        Consumption consumption = new Consumption();
        consumption.setHouse(house);
        consumption.setProduct(product);
        consumption.setQuantidadeConsumida(quantity);
        consumption.setDate(LocalDateTime.now());

        Consumption savedConsumption =
                consumptionRepository.save(consumption);

        inventoryService.consumeStock(
                houseId,
                productId,
                quantity
        );

        return savedConsumption;
    }

    // Buscar consumo pelo ID
    public Consumption getById(UUID id) {

        return consumptionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Consumption not found: " + id)
                );
    }

    // Histórico de uma casa
    public List<Consumption> getHouseHistory(UUID houseId) {
        return consumptionRepository.findByHouseId(houseId);
    }

    // Histórico de um produto
    public List<Consumption> getProductHistory(UUID productId) {
        return consumptionRepository.findByProductId(productId);
    }

}