import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";

export function useInventory(houseId: string) {
  return useQuery({
    queryKey: ["inventory", houseId],
    queryFn: () => inventoryService.getByHouseId(houseId),
    enabled: !!houseId,
  });
}