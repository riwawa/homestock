package com.mycompany.homestock.house;

import com.mycompany.homestock.house.House;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "residents")
public class Resident {
    public Resident() { }
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;


    @ManyToOne
    @JoinColumn(name = "house_id")
    private House house;

    public Resident(UUID id, String name, House house) {
        this.id = id;
        this.name = name;
        this.house = house;
    }

    // Criação de um Resident novo — id ainda não existe
    public Resident(String name, House house) {
        this.name = name;
        this.house = house;
    }



    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public House getHouse() {
        return house;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    
    
}