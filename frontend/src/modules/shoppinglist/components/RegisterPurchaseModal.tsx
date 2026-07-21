import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePurchase } from "../../purchase/hooks/useCreatePurchase";
import { useRemoveShoppingItem } from "../hooks/useRemoveShoppingItem";
import { purchaseCreateSchema, type PurchaseCreateRequest } from "../../purchase/schemas/purchase.schema";
import { getErrorMessage } from "../../../api/axios";
import type { ShoppingItemResponse } from "../types/shoppingList";

type Props = {
  houseId: string;
  item: ShoppingItemResponse;
  onClose: () => void;
};

export function RegisterPurchaseModal({ houseId, item, onClose }: Props) {
  const createPurchase = useCreatePurchase();
  const removeItem = useRemoveShoppingItem();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseCreateRequest>({
    resolver: zodResolver(purchaseCreateSchema),
    defaultValues: {
      productId: item.productId,
      quantity: item.quantityNeeded,
      unitPrice: 0,
    },
  });

  const isPending = createPurchase.isPending || removeItem.isPending;

  const onSubmit = (data: PurchaseCreateRequest) => {
    createPurchase.mutate(
      { houseId, payload: data },
      {
        onSuccess: () => {
          removeItem.mutate(
            { houseId, productId: item.productId },
            { onSuccess: onClose }
          );
        },
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-labelledby="register-purchase-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "white", padding: "1.5rem", borderRadius: "8px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="register-purchase-title">Registrar compra: {item.productName}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("productId")} />

          <div>
            <label htmlFor="quantity">Quantidade comprada</label>
            <input id="quantity" type="number" {...register("quantity")} />
            {errors.quantity && <p>{errors.quantity.message}</p>}
          </div>

          <div>
            <label htmlFor="unitPrice">Preço unitário (R$)</label>
            <input
              id="unitPrice"
              type="number"
              step="0.01"
              {...register("unitPrice")}
            />
            {errors.unitPrice && <p>{errors.unitPrice.message}</p>}
          </div>

          {createPurchase.isError && (
            <p>Erro ao registrar: {getErrorMessage(createPurchase.error)}</p>
          )}

          <button type="button" onClick={onClose} disabled={isPending}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting || isPending}>
            {isPending ? "Salvando..." : "Confirmar compra"}
          </button>
        </form>
      </div>
    </div>
  );
}