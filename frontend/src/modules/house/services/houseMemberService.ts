import { api } from "../../../api/axios";
import type { HouseMemberResponse } from "../types/houseMember";
import type { InviteMemberRequest } from "../schemas/houseMember.schema";

export const houseMemberService = {
  getByHouseId: async (houseId: string): Promise<HouseMemberResponse[]> => {
    const { data } = await api.get<HouseMemberResponse[]>(
      `/api/houses/${houseId}/members`
    );
    return data;
  },

  invite: async (
    houseId: string,
    payload: InviteMemberRequest
  ): Promise<HouseMemberResponse> => {
    const { data } = await api.post<HouseMemberResponse>(
      `/api/houses/${houseId}/members/invite`,
      payload
    );
    return data;
  },
};