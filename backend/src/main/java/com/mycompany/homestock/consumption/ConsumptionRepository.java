package com.mycompany.homestock.consumption;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ConsumptionRepository
        extends JpaRepository<Consumption, UUID> {

    List<Consumption> findByHouseId(UUID houseId);

    List<Consumption> findByProductId(UUID productId);

}
