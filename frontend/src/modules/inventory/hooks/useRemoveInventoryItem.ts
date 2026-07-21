// modules/inventory/hooks/useRemoveInventoryItem.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";

type RemoveItemInput = { houseId: string; productId: string };

export function useRemoveInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, productId }: RemoveItemInput) =>
      inventoryService.removeItem(houseId, productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", data.houseId] });
    },
  });
}