package com.mycompany.homestock.house;

import com.mycompany.homestock.house.dto.HouseRequestDTO;
import com.mycompany.homestock.house.dto.HouseResponseDTO;
import com.mycompany.homestock.house.dto.HouseMapper;
import com.mycompany.homestock.house.dto.HouseSummaryDTO;
import com.mycompany.homestock.security.AuthenticatedUser;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/houses")
public class HouseController {

    private final HouseService houseService;
    private final HouseMapper houseMapper;


    public HouseController(
            HouseService houseService,
            HouseMapper houseMapper
    ) {
        this.houseService = houseService;
        this.houseMapper = houseMapper;
    }


    @PostMapping
    public ResponseEntity<HouseResponseDTO> createHouse(
            @RequestBody HouseRequestDTO request,
            @AuthenticationPrincipal AuthenticatedUser currentUser
    ) {
        House house = houseMapper.toEntity(request);
        House savedHouse = houseService.createHouse(house, currentUser.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(houseMapper.toResponseDTO(savedHouse));
    }

    @GetMapping
    public ResponseEntity<List<HouseSummaryDTO>> getAllHouses(
            @AuthenticationPrincipal AuthenticatedUser currentUser
    ) {
        List<HouseSummaryDTO> houses = houseService.getHousesForUser(currentUser.id())
                .stream()
                .map(houseMapper::toSummaryDTO)
                .toList();
        return ResponseEntity.ok(houses);
    }

    // Buscar casa por ID
    @GetMapping("/{id}")
    public ResponseEntity<HouseResponseDTO> getHouseById(
            @PathVariable UUID id
    ) {

        House house = houseService.getHouseById(id);

        return ResponseEntity.ok(
                houseMapper.toResponseDTO(house)
        );
    }


    // Atualizar casa
    @PutMapping("/{id}")
    public ResponseEntity<HouseResponseDTO> updateHouse(
            @PathVariable UUID id,
            @RequestBody HouseRequestDTO request
    ) {

        House updatedHouse = houseMapper.toEntity(request);

        House house =
                houseService.updateHouse(id, updatedHouse);


        return ResponseEntity.ok(
                houseMapper.toResponseDTO(house)
        );
    }


    // Deletar casa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHouse(
            @PathVariable UUID id
    ) {

        houseService.deleteHouse(id);

        return ResponseEntity.noContent().build();
    }
}