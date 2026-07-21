// modules/inventory/pages/InventoryPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { useInventory } from "../hooks/useInventory";
import { useAddStock } from "../hooks/useAddStock";
import { useProducts } from "../../product/hooks/useProducts";
import { addStockSchema, type AddStockRequest } from "../schemas/inventory.schema";
import { InventoryItemRow } from "../components/InventoryItemRow";
import { getErrorMessage } from "../../../api/axios";

export function InventoryPage() {
  const { currentHouseId } = useCurrentHouse();

  if (!currentHouseId) {
    return (
      <div>
        <p>Nenhuma casa selecionada ainda.</p>
        <Link to="/houses">Ir para Casas</Link>
      </div>
    );
  }

  return <InventoryContent houseId={currentHouseId} />;
}

function InventoryContent({ houseId }: { houseId: string }) {
  const { data: inventory, isLoading, isError, error } = useInventory(houseId);
  const { data: products } = useProducts();
  const addStock = useAddStock();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddStockRequest>({
    resolver: zodResolver(addStockSchema),
    defaultValues: { productId: "", quantity: 1 },
  });

  if (isLoading) return <p>Carregando estoque...</p>;
  if (isError) return <p>Erro ao carregar estoque: {getErrorMessage(error)}</p>;
  if (!inventory) return <p>Estoque não encontrado.</p>;

  const activeProducts = products?.filter((p) => p.active) ?? [];

  const onSubmit = (data: AddStockRequest) => {
    addStock.mutate(
      { houseId, payload: data },
      { onSuccess: () => reset({ productId: "", quantity: 1 }) }
    );
  };

  return (
    <div>
      <h1>Estoque</h1>

      {inventory.items.length === 0 ? (
        <p>Nenhum item no estoque ainda.</p>
      ) : (
        <ul>
          {inventory.items.map((item) => (
            <InventoryItemRow key={item.productId} houseId={houseId} item={item} />
          ))}
        </ul>
      )}

      <h2>Adicionar ao estoque</h2>
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

        {addStock.isError && (
          <p>Erro ao adicionar: {getErrorMessage(addStock.error)}</p>
        )}

        <button type="submit" disabled={isSubmitting || addStock.isPending}>
          {addStock.isPending ? "Adicionando..." : "Adicionar"}
        </button>
      </form>
    </div>
  );
}