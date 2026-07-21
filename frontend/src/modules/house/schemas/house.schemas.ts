import { z } from "zod";

export const houseFormSchema = z.object({
  name: z.string().min(1, "Nome da casa é obrigatório"),
  residents: z
    .array(
      z.object({
        name: z.string().min(1, "Nome do morador não pode ser vazio"),
      })
    )
    .default([]),
});

export type HouseFormValues = z.infer<typeof houseFormSchema>;

export type HouseCreateRequest = {
  name: string;
  residents: string[];
};