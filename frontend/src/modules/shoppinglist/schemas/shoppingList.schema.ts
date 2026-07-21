import { z } from "zod";

export const addShoppingItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantityNeeded: z.coerce
    .number()
    .int()
    .min(1, "Quantidade deve ser maior que zero"),
});

export type AddShoppingItemRequest = z.infer<typeof addShoppingItemSchema>;