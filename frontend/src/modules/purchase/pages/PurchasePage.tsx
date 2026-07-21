import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { usePurchaseHistory } from "../hooks/usePurchaseHistory";
import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { useProducts } from "../../product/hooks/useProducts";
import {
  purchaseCreateSchema,
  type PurchaseCreateRequest,
} from "../schemas/purchase.schema";
import { getErrorMessage } from "../../../api/axios";
import { PurchaseHistoryItem } from "../components/PurchaseHistoryItem";

export function PurchasePage() {
  const { currentHouseId } = useCurrentHouse();

  if (!currentHouseId) {
    return (
      <div>
        <p>Nenhuma casa selecionada ainda.</p>
        <Link to="/houses">Ir para Casas</Link>
      </div>
    );
  }

  return <PurchaseContent houseId={currentHouseId} />;
}

function PurchaseContent({ houseId }: { houseId: string }) {
  const [page, setPage] = useState(0);
  const {
    data: purchaseData,
    isLoading,
    isError,
    error,
  } = usePurchaseHistory(houseId, page);
  const { data: products } = useProducts();
  const createPurchase = useCreatePurchase();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseCreateRequest>({
    resolver: zodResolver(purchaseCreateSchema),
    defaultValues: { productId: "", quantity: 1, unitPrice: 0 },
  });

  if (isLoading) return <p>Carregando histórico de compras...</p>;
  if (isError) return <p>Erro ao carregar histórico: {getErrorMessage(error)}</p>;
  if (!purchaseData) return <p>Histórico não encontrado.</p>;

  const activeProducts = products?.filter((p) => p.active) ?? [];

  const onSubmit = (data: PurchaseCreateRequest) => {
    createPurchase.mutate(
      { houseId, payload: data },
      { onSuccess: () => reset({ productId: "", quantity: 1, unitPrice: 0 }) }
    );
  };

  return (
    <div>
      <h1>Compras</h1>

      <h2>Registrar compra</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="productId">Produto</label>
          <select id="productId" {...register("productId")}>
            <option value="">Selecione um produto</option>
            {activeProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && <p>{errors.productId.message}</p>}
        </div>

        <div>
          <label htmlFor="quantity">Quantidade</label>
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
          <p>Erro ao registrar compra: {getErrorMessage(createPurchase.error)}</p>
        )}

        <button type="submit" disabled={isSubmitting || createPurchase.isPending}>
          {createPurchase.isPending ? "Registrando..." : "Registrar compra"}
        </button>
      </form>

      <h2>Histórico</h2>
      {purchaseData.content.length === 0 ? (
        <p>Nenhuma compra registrada ainda.</p>
      ) : (
        <>
          <ul>
            {purchaseData.content.map((purchase) => (
              <PurchaseHistoryItem
                key={purchase.id}
                houseId={houseId}
                purchase={purchase}
              />
            ))}
          </ul>

          <div>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
              Anterior
            </button>
            <span>
              {" "}
              Página {page + 1} de {purchaseData.totalPages}{" "}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!purchaseData.hasNext}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}