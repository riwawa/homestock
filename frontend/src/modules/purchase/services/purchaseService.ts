import { api } from "../../../api/axios";
import type { PurchasePageResponse, PurchaseResponse } from "../types/purchase";
import type { PurchaseCreateRequest } from "../schemas/purchase.schema";

export const purchaseService = {
    getByHouseId: async (
    houseId: string,
    page: number = 0,
    size: number = 10
    ): Promise<PurchasePageResponse> => {
    const { data } = await api.get<PurchasePageResponse>(
        `/api/houses/${houseId}/purchase`,
        { params: { page, size } }
    );
    return data;
    },

  create: async (
    houseId: string,
    payload: PurchaseCreateRequest
  ): Promise<PurchaseResponse> => {
    const { data } = await api.post<PurchaseResponse>(
      `/api/houses/${houseId}/purchase`,
      payload
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/purchases/${id}`);
  },
};