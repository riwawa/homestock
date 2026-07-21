// modules/inventory/hooks/useAddStock.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import type { AddStockRequest } from "../schemas/inventory.schema";

type AddStockInput = { houseId: string; payload: AddStockRequest };

export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, payload }: AddStockInput) =>
      inventoryService.addStock(houseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.houseId] });
    },
  });
}