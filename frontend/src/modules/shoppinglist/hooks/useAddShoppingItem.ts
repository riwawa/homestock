import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shoppingListService } from "../services/shoppingListService";
import type { AddShoppingItemRequest } from "../schemas/shoppingList.schema";

type AddItemInput = { houseId: string; payload: AddShoppingItemRequest };

export function useAddShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, payload }: AddItemInput) =>
      shoppingListService.addItem(houseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList", variables.houseId] });
    },
  });
}