import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type InviteMemberRequest = z.infer<typeof inviteMemberSchema>;