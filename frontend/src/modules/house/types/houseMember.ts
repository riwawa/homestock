export type HouseMemberResponse = {
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER";
};