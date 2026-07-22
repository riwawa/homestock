import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal/Modal";
import { useAddShoppingItem } from "../hooks/useAddShoppingItem";
import { useProducts } from "../../product/hooks/useProducts";
import {
  addShoppingItemSchema,
  type AddShoppingItemRequest,
} from "../schemas/shoppingList.schema";
import { getErrorMessage } from "../../../api/axios";
import type { ShoppingItemResponse } from "../types/shoppingList";

type Props = {
  houseId: string;
  itemsInList: ShoppingItemResponse[];
  onClose: () => void;
};

export function AddShoppingItemModal({ houseId, itemsInList, onClose }: Props) {
  const { data: products } = useProducts();
  const addItem = useAddShoppingItem();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddShoppingItemRequest>({
    resolver: zodResolver(addShoppingItemSchema),
    defaultValues: { productId: "", quantityNeeded: 1 },
  });

  const idsInList = new Set(itemsInList.map((item) => item.productId));
  const availableProducts = products?.filter((p) => p.active && !idsInList.has(p.id)) ?? [];

  const onSubmit = (data: AddShoppingItemRequest) => {
    addItem.mutate({ houseId, payload: data }, { onSuccess: onClose });
  };

  return (
    <Modal
      title="Adicionar item à lista"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="add-shopping-item-form"
            className="btn btn-primary"
            disabled={isSubmitting || addItem.isPending}
          >
            {addItem.isPending ? "Adicionando..." : "Adicionar"}
          </button>
        </>
      }
    >
      <form id="add-shopping-item-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="productId">Produto</label>
          <select id="productId" {...register("productId")}>
            <option value="">Selecione um produto</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="field-error">{errors.productId.message}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="quantityNeeded">Quantidade necessária</label>
          <input id="quantityNeeded" type="number" {...register("quantityNeeded")} />
          {errors.quantityNeeded && (
            <p className="field-error">{errors.quantityNeeded.message}</p>
          )}
        </div>

        {addItem.isError && (
          <p className="field-error">Erro: {getErrorMessage(addItem.error)}</p>
        )}
      </form>
    </Modal>
  );
}