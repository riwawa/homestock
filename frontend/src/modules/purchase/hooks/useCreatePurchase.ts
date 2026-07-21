import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";
import type { PurchaseCreateRequest } from "../schemas/purchase.schema";

type CreatePurchaseInput = { houseId: string; payload: PurchaseCreateRequest };

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, payload }: CreatePurchaseInput) =>
      purchaseService.create(houseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchases", variables.houseId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.houseId] });
    },
  });
}