package com.mycompany.homestock.house;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@Transactional
public class HouseService {
    private final HouseRepository houseRepository;
    private final HouseMemberService houseMemberService;
    private final HouseMemberRepository houseMemberRepository;

    public HouseService(
            HouseRepository houseRepository,
            HouseMemberService houseMemberService,
            HouseMemberRepository houseMemberRepository
    ) {
        this.houseRepository = houseRepository;
        this.houseMemberService = houseMemberService;
        this.houseMemberRepository = houseMemberRepository;
    }
    
    public House createHouse(House house, UUID creatorUserId) {
        if (house.getName() == null || house.getName().isBlank()) {
            throw new IllegalArgumentException("Nome da casa é obrigatório.");
        }
        House saved = houseRepository.save(house);
        houseMemberService.addOwner(saved.getId(), creatorUserId);
        return saved;
    }

    public List<House> getHousesForUser(UUID userId) {
        return houseMemberRepository.findByUserId(userId)
                .stream()
                .map(HouseMember::getHouse)
                .toList();
    }
    // Buscar uma casa pelo ID
    public House getHouseById(UUID houseId) {

        return houseRepository.findById(houseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Casa não encontrada: " + houseId
                        )
                );
    }

    // Listar todas as casas
    public List<House> getAllHouses() {
        return houseRepository.findAll();
    }

    // Atualizar uma casa
    public House updateHouse(UUID houseId, House updatedHouse) {

        House house = getHouseById(houseId);

        house.setName(updatedHouse.getName());

        return houseRepository.save(house);
    }

    // Excluir uma casa
    public void deleteHouse(UUID houseId) {

        House house = getHouseById(houseId);

        houseRepository.delete(house);
    }

}