import { useQuery } from "@tanstack/react-query";
import { purchaseAnalyticsService } from "../services/purchaseAnalyticsService";

export function useTopProducts(houseId: string, months: number, limit: number) {
  return useQuery({
    queryKey: ["analytics", "top-products", houseId, months, limit],
    queryFn: () => purchaseAnalyticsService.getTopProducts(houseId, months, limit),
    enabled: !!houseId,
  });
}