import { api } from "../../../api/axios";
import type { AuthResponse } from "../types/auth";
import type { LoginRequest, RegisterRequest } from "../schemas/auth.schema";

export const authService = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
    return data;
  },
};