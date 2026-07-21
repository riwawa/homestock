// modules/shoppinglist/pages/ShoppingListPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { useShoppingList } from "../hooks/useShoppingList";
import { useGenerateShoppingList } from "../hooks/useGenerateShoppingList";
import { useAddShoppingItem } from "../hooks/useAddShoppingItem";
import { useRemoveShoppingItem } from "../hooks/useRemoveShoppingItem";
import { useProducts } from "../../product/hooks/useProducts";
import {
  addShoppingItemSchema,
  type AddShoppingItemRequest,
} from "../schemas/shoppingList.schema";
import { getErrorMessage } from "../../../api/axios";
import { RegisterPurchaseModal } from "../components/RegisterPurchaseModal";
import type { ShoppingItemResponse } from "../types/shoppingList";

export function ShoppingListPage() {
  const { currentHouseId } = useCurrentHouse();

  if (!currentHouseId) {
    return (
      <div>
        <p>Nenhuma casa selecionada ainda.</p>
        <Link to="/houses">Ir para Casas</Link>
      </div>
    );
  }

  return <ShoppingListContent houseId={currentHouseId} />;
}

function ShoppingListContent({ houseId }: { houseId: string }) {
  const { data: list, isLoading, isError, error } = useShoppingList(houseId);
  const { data: products } = useProducts();
  const generateList = useGenerateShoppingList();
  const addItem = useAddShoppingItem();
  const removeItem = useRemoveShoppingItem();

  const [itemBeingPurchased, setItemBeingPurchased] =
    useState<ShoppingItemResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddShoppingItemRequest>({
    resolver: zodResolver(addShoppingItemSchema),
    defaultValues: { productId: "", quantityNeeded: 1 },
  });

  if (isLoading) return <p>Carregando lista de compras...</p>;
  if (isError) return <p>Erro ao carregar lista: {getErrorMessage(error)}</p>;
  if (!list) return <p>Lista não encontrada.</p>;

  const idsInList = new Set(list.items.map((item) => item.productId));
  const availableProducts =
    products?.filter((p) => p.active && !idsInList.has(p.id)) ?? [];

  const handleGenerate = () => {
    generateList.mutate(houseId);
  };

  const onSubmit = (data: AddShoppingItemRequest) => {
    addItem.mutate(
      { houseId, payload: data },
      { onSuccess: () => reset({ productId: "", quantityNeeded: 1 }) }
    );
  };

  const handleRemove = (productId: string) => {
    removeItem.mutate({ houseId, productId });
  };

  return (
    <div>
      <h1>Lista de Compras</h1>

      <button onClick={handleGenerate} disabled={generateList.isPending}>
        {generateList.isPending ? "Gerando..." : "Gerar lista automaticamente"}
      </button>
      {generateList.isError && (
        <p>Erro ao gerar lista: {getErrorMessage(generateList.error)}</p>
      )}

      {list.items.length === 0 ? (
        <p>Nenhum item na lista de compras.</p>
      ) : (
        <ul>
          {list.items.map((item) => (
            <li key={item.productId}>
              {item.productName} — {item.quantityNeeded} unidade(s)
              <button onClick={() => setItemBeingPurchased(item)}>
                Comprei
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                disabled={removeItem.isPending}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Adicionar item manualmente</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="productId">Produto</label>
          <select id="productId" {...register("productId")}>
            <option value="">Selecione um produto</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && <p>{errors.productId.message}</p>}
        </div>

        <div>
          <label htmlFor="quantityNeeded">Quantidade necessária</label>
          <input
            id="quantityNeeded"
            type="number"
            {...register("quantityNeeded")}
          />
          {errors.quantityNeeded && <p>{errors.quantityNeeded.message}</p>}
        </div>

        {addItem.isError && (
          <p>Erro ao adicionar: {getErrorMessage(addItem.error)}</p>
        )}

        <button type="submit" disabled={isSubmitting || addItem.isPending}>
          {addItem.isPending ? "Adicionando..." : "Adicionar"}
        </button>
      </form>

      {itemBeingPurchased && (
        <RegisterPurchaseModal
          houseId={houseId}
          item={itemBeingPurchased}
          onClose={() => setItemBeingPurchased(null)}
        />
      )}
    </div>
  );
}