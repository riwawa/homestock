// modules/house/services/houseService.ts
import { api } from "../../../api/axios";
import type { HouseSummary, HouseResponse, HouseUpdateRequest } from "../types/house";
import type { HouseCreateRequest } from "../schemas/house.schemas"; 

export const houseService = {
  list: async (): Promise<HouseSummary[]> => {
    const { data } = await api.get<HouseSummary[]>("/api/houses");
    return data;
  },

  getById: async (id: string): Promise<HouseResponse> => {
    const { data } = await api.get<HouseResponse>(`/api/houses/${id}`);
    return data;
  },

  create: async (payload: HouseCreateRequest): Promise<HouseResponse> => {
    const { data } = await api.post<HouseResponse>("/api/houses", payload);
    return data;
  },

  update: async (id: string, payload: HouseUpdateRequest): Promise<HouseResponse> => {
    const { data } = await api.put<HouseResponse>(`/api/houses/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/houses/${id}`);
  },
};