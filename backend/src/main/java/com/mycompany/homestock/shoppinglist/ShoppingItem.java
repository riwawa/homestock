package com.mycompany.homestock.shoppinglist;

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
@Table(name = "shopping_list_items")
public class ShoppingItem {
    public ShoppingItem(){}
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;
    
    private int quantityNeeded;
    
    @ManyToOne
    @JoinColumn(name="shopping_list_id")
    private ShoppingList shoppingList;
    
    
    public ShoppingItem(Product product, int quantityNeeded, ShoppingList shoppingList) {
        this.product = product;
        this.quantityNeeded = quantityNeeded;
        this.shoppingList = shoppingList;
    }
    
    public ShoppingList getShoppingList() {
        return shoppingList;
    }

    public void setShoppingList(ShoppingList shoppingList) {
        this.shoppingList = shoppingList;
    }
    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantityNeeded() {
        return quantityNeeded;
    }

    public void setQuantityNeeded(int quantityNeeded) {
        if (quantityNeeded < 0 ) {
            throw new IllegalArgumentException(
            "Quantidade necessária não pode ser negativa"
            );
        }
        this.quantityNeeded = quantityNeeded;
    }
    
    
    
    
}
