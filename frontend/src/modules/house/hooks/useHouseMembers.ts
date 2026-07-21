import { useQuery } from "@tanstack/react-query";
import { houseMemberService } from "../services/houseMemberService";

export function useHouseMembers(houseId: string) {
  return useQuery({
    queryKey: ["houseMembers", houseId],
    queryFn: () => houseMemberService.getByHouseId(houseId),
    enabled: !!houseId,
  });
}