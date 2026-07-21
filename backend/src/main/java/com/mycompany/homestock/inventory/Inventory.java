package com.mycompany.homestock.inventory;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.product.Product;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
/*
    o que realmente tem dentro de casa (estoque)
*/
@Entity
@Table(name = "inventory")
public class Inventory {
    public Inventory(){}
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToMany(
        mappedBy = "inventory",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<InventoryItem> items = new ArrayList<>();
    
    @OneToOne
    private House house;

    public UUID getId() {
        return id;
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<InventoryItem> getItems() {
        return items;
    }

    public void setItems(List<InventoryItem> items) {
        this.items = items;
    }

    InventoryItem findItemByProduct(UUID productId) {
        // percorre a lista e compara com productid, retorna item ou null
        if (items == null) {
            return null;
        }
        
        return items.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
    }

    
    public void addStock(Product product, int quantity) {
        InventoryItem item = findItemByProduct(product.getId());
        
        if( quantity <= 0 ) {
            throw new IllegalArgumentException("erro");
        }
        if (item == null) {
            item = new InventoryItem(product, quantity);
            item.setInventory(this);
            items.add(item);
        } else {
            item.increase(quantity);
        }
        
        
       
    }
    
    public void consumeStock(Product product, int quantity) {
        InventoryItem item = findItemByProduct(product.getId());
        
        if (item == null) {
            throw new IllegalArgumentException("erro");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }
        item.decrease(quantity);
    }
    public void removeItem(UUID productId) {
        InventoryItem item = findItemByProduct(productId);
        if (item == null) {
            throw new IllegalArgumentException("Item não encontrado no estoque");
        }
        items.remove(item);
    }

    
    
}
