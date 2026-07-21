import { useQuery } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";

export function usePurchaseHistory(houseId: string, page: number, size: number = 10) {
  return useQuery({
    queryKey: ["purchases", houseId, page, size],
    queryFn: () => purchaseService.getByHouseId(houseId, page, size),
    enabled: !!houseId,
  });
}