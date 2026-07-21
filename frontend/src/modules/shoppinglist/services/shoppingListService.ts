import { api } from "../../../api/axios";
import type { ShoppingListResponse } from "../types/shoppingList";
import type { AddShoppingItemRequest } from "../schemas/shoppingList.schema";

export const shoppingListService = {
  getByHouseId: async (houseId: string): Promise<ShoppingListResponse> => {
    const { data } = await api.get<ShoppingListResponse>(
      `/api/houses/${houseId}/shopping-list`
    );
    return data;
  },

  generate: async (houseId: string): Promise<ShoppingListResponse> => {
    const { data } = await api.post<ShoppingListResponse>(
      `/api/houses/${houseId}/shopping-list/generate`
    );
    return data;
  },

  addItem: async (
    houseId: string,
    payload: AddShoppingItemRequest
  ): Promise<ShoppingListResponse> => {
    const { data } = await api.post<ShoppingListResponse>(
      `/api/houses/${houseId}/shopping-list/items`,
      payload
    );
    return data;
  },

  removeItem: async (
    houseId: string,
    productId: string
  ): Promise<ShoppingListResponse> => {
    const { data } = await api.delete<ShoppingListResponse>(
      `/api/houses/${houseId}/shopping-list/items/${productId}`
    );
    return data;
  },
};