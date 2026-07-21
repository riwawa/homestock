import { api } from "../../../api/axios";
import type { ProductResponse } from "../types/product";
import type { ProductCreateRequest } from "../schemas/product.schema";

export const productService = {
  list: async (): Promise<ProductResponse[]> => {
    const { data } = await api.get<ProductResponse[]>("/api/products");
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await api.get<ProductResponse>(`/api/products/${id}`);
    return data;
  },

  create: async (payload: ProductCreateRequest): Promise<ProductResponse> => {
    const { data } = await api.post<ProductResponse>("/api/products", payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },
    update: async (id: string, payload: ProductCreateRequest): Promise<ProductResponse> => {
    const { data } = await api.put<ProductResponse>(`/api/products/${id}`, payload);
    return data;
    },
};