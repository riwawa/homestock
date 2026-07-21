package com.mycompany.homestock.house;

import com.mycompany.homestock.house.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/houses/{houseId}/members")
public class HouseMemberController {
    private final HouseMemberService houseMemberService;
    private final HouseMemberMapper houseMemberMapper;

    public HouseMemberController(HouseMemberService houseMemberService, HouseMemberMapper houseMemberMapper) {
        this.houseMemberService = houseMemberService;
        this.houseMemberMapper = houseMemberMapper;
    }

    @GetMapping
    public ResponseEntity<List<HouseMemberResponseDTO>> getMembers(@PathVariable UUID houseId) {
        List<HouseMemberResponseDTO> members = houseMemberService.getMembersByHouseId(houseId)
                .stream()
                .map(houseMemberMapper::toResponseDTO)
                .toList();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/invite")
    public ResponseEntity<HouseMemberResponseDTO> inviteMember(
            @PathVariable UUID houseId,
            @RequestBody InviteMemberRequestDTO dto
    ) {
        HouseMember member = houseMemberService.inviteByEmail(houseId, dto.email());
        return ResponseEntity.status(201).body(houseMemberMapper.toResponseDTO(member));
    }
}