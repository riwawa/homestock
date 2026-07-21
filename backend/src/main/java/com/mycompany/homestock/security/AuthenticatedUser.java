package com.mycompany.homestock.security;

import java.util.UUID;

public record AuthenticatedUser(UUID id, String email) {}