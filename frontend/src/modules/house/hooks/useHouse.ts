import { useQuery } from "@tanstack/react-query";
import { houseService } from "../services/houseService";

export function useHouse(id: string) {
  return useQuery({
    queryKey: ["houses", id],
    queryFn: () => houseService.getById(id),
    enabled: !!id,
  });
}