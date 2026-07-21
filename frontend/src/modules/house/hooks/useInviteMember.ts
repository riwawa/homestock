import { useMutation, useQueryClient } from "@tanstack/react-query";
import { houseMemberService } from "../services/houseMemberService";
import type { InviteMemberRequest } from "../schemas/houseMember.schema";

type InviteMemberInput = { houseId: string; payload: InviteMemberRequest };

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, payload }: InviteMemberInput) =>
      houseMemberService.invite(houseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["houseMembers", variables.houseId] });
    },
  });
}