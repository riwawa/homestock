// modules/shoppinglist/pages/ShoppingListPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { useShoppingList } from "../hooks/useShoppingList";
import { useGenerateShoppingList } from "../hooks/useGenerateShoppingList";
import { useRemoveShoppingItem } from "../hooks/useRemoveShoppingItem";
import { getErrorMessage } from "../../../api/axios";
import { AddShoppingItemModal } from "../components/AddShoppingItemModal";
import { RegisterPurchaseModal } from "../../purchase/components/RegisterPurchaseModal";
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
  const generateList = useGenerateShoppingList();
  const removeItem = useRemoveShoppingItem();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [itemBeingPurchased, setItemBeingPurchased] = useState<ShoppingItemResponse | null>(null);

  if (isLoading) return <p>Carregando lista de compras...</p>;
  if (isError) return <p>Erro ao carregar lista: {getErrorMessage(error)}</p>;
  if (!list) return <p>Lista não encontrada.</p>;

  const handleGenerate = () => {
    generateList.mutate(houseId);
  };

  const handleRemove = (productId: string) => {
    removeItem.mutate({ houseId, productId });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Lista de Compras</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGenerate}
            disabled={generateList.isPending}
          >
            {generateList.isPending ? "Gerando..." : "Gerar automaticamente"}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            + Adicionar item
          </button>
        </div>
      </div>

      {generateList.isError && (
        <p className="field-error">Erro ao gerar lista: {getErrorMessage(generateList.error)}</p>
      )}

      {list.items.length === 0 ? (
        <p>Nenhum item na lista de compras.</p>
      ) : (
        <ul>
          {list.items.map((item) => (
            <li key={item.productId} className="item-row">
              <span>
                {item.productName} — {item.quantityNeeded} unidade(s)
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setItemBeingPurchased(item)}
                >
                  Comprei
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.productId)}
                  disabled={removeItem.isPending}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddShoppingItemModal
          houseId={houseId}
          itemsInList={list.items}
          onClose={() => setIsAddOpen(false)}
        />
      )}

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