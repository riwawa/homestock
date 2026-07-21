// modules/inventory/hooks/useConsumeStock.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import type { ConsumeStockRequest } from "../schemas/inventory.schema";

type ConsumeStockInput = { houseId: string; payload: ConsumeStockRequest };

export function useConsumeStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, payload }: ConsumeStockInput) =>
      inventoryService.consumeStock(houseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.houseId] });
    },
  });
}