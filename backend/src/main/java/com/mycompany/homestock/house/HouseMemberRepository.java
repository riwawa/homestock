package com.mycompany.homestock.house;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HouseMemberRepository extends JpaRepository<HouseMember, UUID> {
    List<HouseMember> findByHouseId(UUID houseId);
    List<HouseMember> findByUserId(UUID userId);
    Optional<HouseMember> findByUserIdAndHouseId(UUID userId, UUID houseId);
    boolean existsByUserIdAndHouseId(UUID userId, UUID houseId);
}