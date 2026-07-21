package com.mycompany.homestock.house;

import com.mycompany.homestock.users.User;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "house_members")
public class HouseMember {
    protected HouseMember() {}

    public HouseMember(User user, House house, HouseMemberRole role) {
        this.user = user;
        this.house = house;
        this.role = role;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "house_id")
    private House house;

    @Enumerated(EnumType.STRING)
    private HouseMemberRole role;

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public House getHouse() { return house; }
    public HouseMemberRole getRole() { return role; }
}