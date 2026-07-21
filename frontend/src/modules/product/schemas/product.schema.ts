import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  category: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  minimumQuantity: z.coerce
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade mínima não pode ser negativa")
    .default(0),
});

export type ProductCreateRequest = z.infer<typeof productCreateSchema>;