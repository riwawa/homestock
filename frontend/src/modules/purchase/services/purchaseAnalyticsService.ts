import { api } from "../../../api/axios";
import type { MonthlySpend, CategorySpend, TopProduct, PriceTrendPoint } from "../types/analytics";

export const purchaseAnalyticsService = {
  getMonthlySpend: async (houseId: string, months: number): Promise<MonthlySpend[]> => {
    const { data } = await api.get<MonthlySpend[]>(
      `/api/houses/${houseId}/purchase/analytics/monthly-spend`,
      { params: { months } }
    );
    return data;
  },

  getSpendByCategory: async (houseId: string, months: number): Promise<CategorySpend[]> => {
    const { data } = await api.get<CategorySpend[]>(
      `/api/houses/${houseId}/purchase/analytics/by-category`,
      { params: { months } }
    );
    return data;
  },

  getTopProducts: async (houseId: string, months: number, limit: number): Promise<TopProduct[]> => {
    const { data } = await api.get<TopProduct[]>(
      `/api/houses/${houseId}/purchase/analytics/top-products`,
      { params: { months, limit } }
    );
    return data;
  },

  getPriceTrend: async (houseId: string, productId: string, months: number): Promise<PriceTrendPoint[]> => {
    const { data } = await api.get<PriceTrendPoint[]>(
      `/api/houses/${houseId}/purchase/analytics/price-trend/${productId}`,
      { params: { months } }
    );
    return data;
  },
};