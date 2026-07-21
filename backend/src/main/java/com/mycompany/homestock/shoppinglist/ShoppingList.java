package com.mycompany.homestock.shoppinglist;
import com.mycompany.homestock.house.House;
import com.mycompany.homestock.product.Product;
import jakarta.persistence.CascadeType;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.UUID;
/*
    o que precisa comprar
*/
@Entity
@Table(name = "shopping_list")
public class ShoppingList {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne
    private House house;
    
    @OneToMany(mappedBy = "shoppingList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShoppingItem> items = new ArrayList<>();
    
    public ShoppingList(){}

    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }

    public List<ShoppingItem> getItems() {
        return items;
    }


    
    // metodos
    
    //├── findItemByProduct(...)
    public ShoppingItem findItemByProduct(Product product) {
        for (ShoppingItem item : items) {
            if (
                item.getProduct().getId()
                .equals(product.getId())) {
            return item;
            }
        }
        return null;
    }
    //├── containsProduct(...)
    public boolean containsProduct(Product product) {
        return findItemByProduct(product) != null;
    }
    //├── addItem(...)
    public ShoppingItem addItem(Product product, int quantityNeeded) {
        if (containsProduct(product) == true) {
            throw new IllegalArgumentException("Produto já existe na lista de compras");
        }
        ShoppingItem shoppingItem = new ShoppingItem(    
            product,
            quantityNeeded,
            this
        );

        items.add(shoppingItem);

        return shoppingItem;
    }
    //├── removeItem(...)
    public ShoppingItem removeItem(Product product) {
        ShoppingItem item = findItemByProduct(product);

        if (item == null) {
            throw new IllegalArgumentException("Produto não existe na lista de compras");
        }

        items.remove(item);

        return item;
    }

    
}
