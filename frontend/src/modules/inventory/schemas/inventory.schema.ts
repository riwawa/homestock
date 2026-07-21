import { z } from "zod";

export const addStockSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().int().min(1, "Quantidade deve ser maior que zero"),
});

export const consumeStockSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().int().min(1, "Quantidade deve ser maior que zero"),
});

export type AddStockRequest = z.infer<typeof addStockSchema>;
export type ConsumeStockRequest = z.infer<typeof consumeStockSchema>;