import { useMutation, useQueryClient } from "@tanstack/react-query";
import { houseService } from "../services/houseService";

export function useCreateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: houseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
}