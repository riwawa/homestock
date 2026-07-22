// modules/purchase/components/PurchaseCreateModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal/Modal";
import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { useProducts } from "../../product/hooks/useProducts";
import { purchaseCreateSchema, type PurchaseCreateRequest } from "../schemas/purchase.schema";
import { getErrorMessage } from "../../../api/axios";

type Props = { houseId: string; onClose: () => void };

export function PurchaseCreateModal({ houseId, onClose }: Props) {
  const { data: products } = useProducts();
  const createPurchase = useCreatePurchase();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseCreateRequest>({
    resolver: zodResolver(purchaseCreateSchema),
    defaultValues: { productId: "", quantity: 1, unitPrice: 0 },
  });

  const activeProducts = products?.filter((p) => p.active) ?? [];

  const onSubmit = (data: PurchaseCreateRequest) => {
    createPurchase.mutate({ houseId, payload: data }, { onSuccess: onClose });
  };

  return (
    <Modal
      title="Registrar compra"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="purchase-create-form"
            className="btn btn-primary"
            disabled={isSubmitting || createPurchase.isPending}
          >
            {createPurchase.isPending ? "Registrando..." : "Registrar compra"}
          </button>
        </>
      }
    >
      <form id="purchase-create-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="productId">Produto</label>
          <select id="productId" {...register("productId")}>
            <option value="">Selecione um produto</option>
            {activeProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && <p className="field-error">{errors.productId.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="quantity">Quantidade</label>
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