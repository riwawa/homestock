import axios, { AxiosError } from "axios";
import { getToken, clearAuth } from "../modules/auth/authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const backendMessage = (error as AxiosError<{ message?: string }>).response
      ?.data?.message;
    if (backendMessage) return backendMessage;
  }
  if (error instanceof Error) return error.message;
  return "Erro desconhecido";
}