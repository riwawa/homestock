// modules/shoppinglist/hooks/useShoppingList.ts
import { useQuery } from "@tanstack/react-query";
import { shoppingListService } from "../services/shoppingListService";

export function useShoppingList(houseId: string) {
  return useQuery({
    queryKey: ["shoppingList", houseId],
    queryFn: () => shoppingListService.getByHouseId(houseId),
    enabled: !!houseId,
  });
}