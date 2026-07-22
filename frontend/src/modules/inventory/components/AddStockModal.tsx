import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal/Modal";
import { useAddStock } from "../hooks/useAddStock";
import { useProducts } from "../../product/hooks/useProducts";
import { addStockSchema, type AddStockRequest } from "../schemas/inventory.schema";
import { getErrorMessage } from "../../../api/axios";

type Props = { houseId: string; onClose: () => void };

export function AddStockModal({ houseId, onClose }: Props) {
  const { data: products } = useProducts();
  const addStock = useAddStock();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddStockRequest>({
    resolver: zodResolver(addStockSchema),
    defaultValues: { productId: "", quantity: 1 },
  });

  const activeProducts = products?.filter((p) => p.active) ?? [];

  const onSubmit = (data: AddStockRequest) => {
    addStock.mutate({ houseId, payload: data }, { onSuccess: onClose });
  };

  return (
    <Modal
      title="Adicionar ao estoque"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="add-stock-form"
            className="btn btn-primary"
            disabled={isSubmitting || addStock.isPending}
          >
            {addStock.isPending ? "Adicionando..." : "Adicionar"}
          </button>
        </>
      }
    >
      <form id="add-stock-form" onSubmit={handleSubmit(onSubmit)}>
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

        {addStock.isError && (
          <p className="field-error">Erro: {getErrorMessage(addStock.error)}</p>
        )}
      </form>
    </Modal>
  );
}