import { useQuery } from "@tanstack/react-query";
import { purchaseAnalyticsService } from "../services/purchaseAnalyticsService";

export function usePriceTrend(houseId: string, productId: string, months: number) {
  return useQuery({
    queryKey: ["analytics", "price-trend", houseId, productId, months],
    queryFn: () => purchaseAnalyticsService.getPriceTrend(houseId, productId, months),
    enabled: !!houseId && !!productId,
  });
}