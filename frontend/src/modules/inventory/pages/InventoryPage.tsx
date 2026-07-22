import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { useInventory } from "../hooks/useInventory";
import { InventoryItemRow } from "../components/InventoryItemRow";
import { AddStockModal } from "../components/AddStockModal";
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isLoading) return <p>Carregando estoque...</p>;
  if (isError) return <p>Erro ao carregar estoque: {getErrorMessage(error)}</p>;
  if (!inventory) return <p>Estoque não encontrado.</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Estoque</h1>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          + Adicionar ao estoque
        </button>
      </div>

      {inventory.items.length === 0 ? (
        <p>Nenhum item no estoque ainda.</p>
      ) : (
        <ul>
          {inventory.items.map((item) => (
            <InventoryItemRow key={item.productId} houseId={houseId} item={item} />
          ))}
        </ul>
      )}

      {isAddOpen && <AddStockModal houseId={houseId} onClose={() => setIsAddOpen(false)} />}
    </div>
  );
}