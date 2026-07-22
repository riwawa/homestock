import { useQuery } from "@tanstack/react-query";
import { purchaseAnalyticsService } from "../services/purchaseAnalyticsService";

export function useMonthlySpend(houseId: string, months: number) {
  return useQuery({
    queryKey: ["analytics", "monthly-spend", houseId, months],
    queryFn: () => purchaseAnalyticsService.getMonthlySpend(houseId, months),
    enabled: !!houseId,
  });
}