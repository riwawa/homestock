import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";

type DeletePurchaseInput = { id: string; houseId: string };

export function useDeletePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeletePurchaseInput) => purchaseService.delete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchases", variables.houseId] });
    },
  });
}