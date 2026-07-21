import { api } from "../../../api/axios";
import type { InventoryResponse } from "../types/inventory";
import type { AddStockRequest, ConsumeStockRequest } from "../schemas/inventory.schema";

export const inventoryService = {
  getByHouseId: async (houseId: string): Promise<InventoryResponse> => {
    const { data } = await api.get<InventoryResponse>(`/api/houses/${houseId}/inventory`);
    return data;
  },

  addStock: async (houseId: string, payload: AddStockRequest): Promise<InventoryResponse> => {
    const { data } = await api.post<InventoryResponse>(
      `/api/houses/${houseId}/inventory/add`,
      payload
    );
    return data;
  },

  consumeStock: async (houseId: string, payload: ConsumeStockRequest): Promise<InventoryResponse> => {
    const { data } = await api.put<InventoryResponse>(
      `/api/houses/${houseId}/inventory/consume`,
      payload
    );
    return data;
  },

  removeItem: async (houseId: string, productId: string): Promise<InventoryResponse> => {
    const { data } = await api.delete<InventoryResponse>(
      `/api/houses/${houseId}/inventory/items/${productId}`
    );
    return data;
  },
};