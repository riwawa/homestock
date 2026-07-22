// modules/purchase/components/RegisterPurchaseModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal/Modal";
import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { useRemoveShoppingItem } from "../../shoppinglist/hooks/useRemoveShoppingItem";
import { purchaseCreateSchema, type PurchaseCreateRequest } from "../schemas/purchase.schema";
import { getErrorMessage } from "../../../api/axios";
import type { ShoppingItemResponse } from "../../shoppinglist/types/shoppingList";

type Props = { houseId: string; item: ShoppingItemResponse; onClose: () => void };

export function RegisterPurchaseModal({ houseId, item, onClose }: Props) {
  const createPurchase = useCreatePurchase();
  const removeItem = useRemoveShoppingItem();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseCreateRequest>({
    resolver: zodResolver(purchaseCreateSchema),
    defaultValues: { productId: item.productId, quantity: item.quantityNeeded, unitPrice: 0 },
  });

  const isPending = createPurchase.isPending || removeItem.isPending;

  const onSubmit = (data: PurchaseCreateRequest) => {
    createPurchase.mutate(
      { houseId, payload: data },
      {
        onSuccess: () => {
          removeItem.mutate({ houseId, productId: item.productId }, { onSuccess: onClose });
        },
      }
    );
  };

  return (
    <Modal
      title={`Registrar compra: ${item.productName}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isPending}>
            Cancelar
          </button>
          <button
            type="submit"
            form="register-purchase-form"
            className="btn btn-primary"
            disabled={isSubmitting || isPending}
          >
            {isPending ? "Salvando..." : "Confirmar compra"}
          </button>
        </>
      }
    >
      <form id="register-purchase-form" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("productId")} />

        <div className="field">
          <label htmlFor="quantity">Quantidade comprada</label>
          <input id="quantity" type="number" {...register("quantity")} />
          {errors.quantity && <p className="field-error">{errors.quantity.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="unitPrice">Preço unitário (R$)</label>
          <input id="unitPrice" type="number" step="0.01" {...register("unitPrice")} />
          {errors.unitPrice && <p className="field-error">{errors.unitPrice.message}</p>}
        </div>

        {createPurchase.isError && (
          <p className="field-error">Erro: {getErrorMessage(createPurchase.error)}</p>
        )}
      </form>
    </Modal>
  );
}