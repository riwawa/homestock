import { z } from "zod";

export const purchaseCreateSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().int().min(1, "Quantidade deve ser maior que zero"),
  unitPrice: z.coerce.number().positive("Preço deve ser maior que zero"),
});

export type PurchaseCreateRequest = z.infer<typeof purchaseCreateSchema>;