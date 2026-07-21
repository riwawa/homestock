
package com.mycompany.homestock.inventory;

import com.mycompany.homestock.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "inventory_item")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;


    protected InventoryItem() {}

    public InventoryItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // comportamento: aumentar estoque
    public void increase(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Quantidade inválida");
        }
        this.quantity += amount;
    }

    // comportamento: consumir estoque
    public void decrease(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Quantidade inválida");
        }

        if (this.quantity < amount) {
            throw new IllegalStateException("Estoque insuficiente");
        }

        this.quantity -= amount;
    }

    // getters e setters
    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    public UUID getId() {
        return id;
    }
}