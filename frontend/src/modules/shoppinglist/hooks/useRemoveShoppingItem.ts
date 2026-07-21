import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shoppingListService } from "../services/shoppingListService";

type RemoveItemInput = { houseId: string; productId: string };

export function useRemoveShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, productId }: RemoveItemInput) =>
      shoppingListService.removeItem(houseId, productId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", variables.houseId] });
    },
  });
}