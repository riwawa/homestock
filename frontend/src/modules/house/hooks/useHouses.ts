import { useQuery } from "@tanstack/react-query";
import { houseService } from "../services/houseService";

export function useHouses() {
  return useQuery({
    queryKey: ["houses"],
    queryFn: houseService.list,
  });
}