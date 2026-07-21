package com.mycompany.homestock.shoppinglist;

import com.mycompany.homestock.inventory.Inventory;
import com.mycompany.homestock.inventory.InventoryItem;
import com.mycompany.homestock.inventory.InventoryService;
import com.mycompany.homestock.product.Product;
import com.mycompany.homestock.product.ProductRepository;
import com.mycompany.homestock.house.HouseRepository;
import com.mycompany.homestock.house.House;
import jakarta.transaction.Transactional;


import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class ShoppingListService {

    private final ShoppingListRepository shoppingListRepository;
    private final InventoryService inventoryService;
    private final ProductRepository productRepository;
    private final HouseRepository houseRepository;

    public ShoppingListService(
            ShoppingListRepository shoppingListRepository,
            InventoryService inventoryService,
            ProductRepository productRepository,
            HouseRepository houseRepository
    ) {
        this.shoppingListRepository = shoppingListRepository;
        this.inventoryService = inventoryService;
        this.productRepository = productRepository;
        this.houseRepository = houseRepository;
    }

    public ShoppingList getOrCreate(UUID houseId) {
        return shoppingListRepository.findByHouseId(houseId)
                .orElseGet(() -> {

                    ShoppingList list = new ShoppingList();
                    House house = houseRepository.findById(houseId)        
                            .orElseThrow(() ->
                            new RuntimeException(
                                "House não encontrada: " + houseId
                            )
                        );
                    list.setHouse(house);
                    return shoppingListRepository.save(list);
                });
    }

    public ShoppingList generate(UUID houseId) {
        ShoppingList list = getOrCreate(houseId);
        Inventory inventory = inventoryService
                .getOrCreateInventory(houseId);

        /*
            A lista será reconstruída baseada no estoque.
            Se a regra mudar futuramente, pode remover esse clear.
        */
        list.getItems().clear();

        for (InventoryItem inventoryItem : inventory.getItems()) {
            Product product = inventoryItem.getProduct();
            int currentQuantity = inventoryItem.getQuantity();
            int minimumQuantity = product.getQuantidadeMinima();
            /*
                Exemplo:
                mínimo = 10
                estoque = 4
                precisa comprar = 6
            */
            if (currentQuantity < minimumQuantity) {

                int quantityNeeded =
                        minimumQuantity - currentQuantity;
                list.addItem(
                        product,
                        quantityNeeded
                );
            }
        }
        return shoppingListRepository.save(list);
    }
    
    public ShoppingList addItem(UUID houseId, UUID productId, int quantityNeeded) {
        ShoppingList list = getOrCreate(houseId);
        if (quantityNeeded <= 0) {
            throw new IllegalArgumentException(
                "Quantidade deve ser maior que zero"
            );
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Produto não encontrado: " + productId
                        )
                );
        list.addItem(
                product,
                quantityNeeded
        );
        return shoppingListRepository.save(list);
    }
    
    public ShoppingList removeItem(
        UUID houseId,
        UUID productId
    ) {
        ShoppingList list = getOrCreate(houseId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                            "Produto não encontrado"
                        )
                );


        list.removeItem(product);


        return shoppingListRepository.save(list);
    }
}