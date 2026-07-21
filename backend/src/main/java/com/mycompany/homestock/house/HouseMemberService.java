package com.mycompany.homestock.house;

import com.mycompany.homestock.users.User;
import com.mycompany.homestock.users.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class HouseMemberService {
    private final HouseMemberRepository houseMemberRepository;
    private final HouseRepository houseRepository;
    private final UserRepository userRepository;

    public HouseMemberService(
            HouseMemberRepository houseMemberRepository,
            HouseRepository houseRepository,
            UserRepository userRepository
    ) {
        this.houseMemberRepository = houseMemberRepository;
        this.houseRepository = houseRepository;
        this.userRepository = userRepository;
    }

    public HouseMember addOwner(UUID houseId, UUID userId) {
        return addMember(houseId, userId, HouseMemberRole.OWNER);
    }

    public HouseMember inviteByEmail(UUID houseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Essa pessoa ainda não tem conta no Homestock"
                ));
        return addMember(houseId, user.getId(), HouseMemberRole.MEMBER);
    }

    private HouseMember addMember(UUID houseId, UUID userId, HouseMemberRole role) {
        if (houseMemberRepository.existsByUserIdAndHouseId(userId, houseId)) {
            throw new IllegalArgumentException("Esse usuário já faz parte da casa");
        }

        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new IllegalArgumentException("Casa não encontrada"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        HouseMember member = new HouseMember(user, house, role);
        return houseMemberRepository.save(member);
    }

    public List<HouseMember> getMembersByHouseId(UUID houseId) {
        return houseMemberRepository.findByHouseId(houseId);
    }
}