package com.mycompany.homestock.house.dto;

import com.mycompany.homestock.house.HouseMember;
import org.springframework.stereotype.Component;

@Component
public class HouseMemberMapper {
    public HouseMemberResponseDTO toResponseDTO(HouseMember member) {
        return new HouseMemberResponseDTO(
                member.getUser().getId(),
                member.getUser().getName(),
                member.getUser().getEmail(),
                member.getRole().name()
        );
    }
}