package com.mycompany.homestock.house.dto;

import com.mycompany.homestock.house.House;
import com.mycompany.homestock.house.Resident;
import com.mycompany.homestock.house.dto.HouseRequestDTO;
import com.mycompany.homestock.house.dto.HouseResponseDTO;
import com.mycompany.homestock.inventory.dto.InventoryMapper;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class HouseMapper {

    private final InventoryMapper inventoryMapper;

    public HouseMapper(InventoryMapper inventoryMapper) {
        this.inventoryMapper = inventoryMapper;
    }

    public House toEntity(HouseRequestDTO request) {
        House house = new House();
        house.setName(request.name());

        List<Resident> residents = request.residents().stream()
                .map(name -> new Resident(name, house))
                .toList();

        house.setResidents(residents);
        return house;
    }

    public HouseResponseDTO toResponseDTO(House house) {
        List<String> residentNames = house.getResidents().stream()
                .map(Resident::getName)
                .toList();

        return new HouseResponseDTO(
                house.getId(),
                house.getName(),
                inventoryMapper.toResponseDTO(house.getInventory()),
                residentNames
        );
    }
    public HouseSummaryDTO toSummaryDTO(House house) {
        return new HouseSummaryDTO(
                house.getId(),
                house.getName()
        );
    }
}