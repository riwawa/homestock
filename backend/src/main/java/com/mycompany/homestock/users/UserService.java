package com.mycompany.homestock.users;

import com.mycompany.homestock.security.JwtService;
import com.mycompany.homestock.users.dto.AuthResponseDTO;
import com.mycompany.homestock.users.dto.LoginRequestDTO;
import com.mycompany.homestock.users.dto.RegisterRequestDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Este email já está cadastrado");
        }
        if (request.password() == null || request.password().length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres");
        }

        String hash = passwordEncoder.encode(request.password());
        User user = new User(request.email(), hash, request.name());
        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getEmail());
        return new AuthResponseDTO(token, saved.getId(), saved.getName(), saved.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email ou senha inválidos");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(token, user.getId(), user.getName(), user.getEmail());
    }
}