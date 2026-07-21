import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shoppingListService } from "../services/shoppingListService";

export function useGenerateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shoppingListService.generate,
    onSuccess: (_data, houseId) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", houseId] });
    },
  });
}