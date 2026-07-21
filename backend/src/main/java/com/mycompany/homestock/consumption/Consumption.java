package com.mycompany.homestock.consumption;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.product.Product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
/*
    historico de consumo
*/

@Entity
@Table(name = "consumption")
public class Consumption {
    public Consumption() { }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    @ManyToOne
    private Product product;

    @ManyToOne
    private House house;
    
    private int quantidadeConsumida;
    private LocalDateTime date;
    

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

    public int getQuantidadeConsumida() {
        return quantidadeConsumida;
    }

    public void setQuantidadeConsumida(int quantidadeConsumida) {
        this.quantidadeConsumida = quantidadeConsumida;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }
    

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    
}
