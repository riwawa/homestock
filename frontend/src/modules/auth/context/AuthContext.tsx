import { createContext, useContext, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { getToken, getStoredUser, setAuth, clearAuth, type StoredUser } from "../authStorage";
import type { LoginRequest, RegisterRequest } from "../schemas/auth.schema";

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  const login = async (payload: LoginRequest) => {
    const response = await authService.login(payload);
    const storedUser = { id: response.userId, name: response.name, email: response.email };
    setAuth(response.token, storedUser);
    setUser(storedUser);
  };

  const register = async (payload: RegisterRequest) => {
    const response = await authService.register(payload);
    const storedUser = { id: response.userId, name: response.name, email: response.email };
    setAuth(response.token, storedUser);
    setUser(storedUser);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!getToken(), login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro de AuthProvider");
  }
  return context;
}