import { useQuery } from "@tanstack/react-query";
import { purchaseAnalyticsService } from "../services/purchaseAnalyticsService";

export function useSpendByCategory(houseId: string, months: number) {
  return useQuery({
    queryKey: ["analytics", "by-category", houseId, months],
    queryFn: () => purchaseAnalyticsService.getSpendByCategory(houseId, months),
    enabled: !!houseId,
  });
}