import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { usePurchaseHistory } from "../hooks/usePurchaseHistory";
import { getErrorMessage } from "../../../api/axios";
import { PurchaseHistoryItem } from "../components/PurchaseHistoryItem";
import { PurchaseCreateModal } from "../components/PurchaseCreateModal";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    data: purchaseData,
    isLoading,
    isError,
    error,
  } = usePurchaseHistory(houseId, page);

  if (isLoading) return <p>Carregando histórico de compras...</p>;
  if (isError) return <p>Erro ao carregar histórico: {getErrorMessage(error)}</p>;
  if (!purchaseData) return <p>Histórico não encontrado.</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Compras</h1>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          + Registrar compra
        </button>
      </div>

      <h2>Histórico</h2>
      {purchaseData.content.length === 0 ? (
        <p>Nenhuma compra registrada ainda.</p>
      ) : (
        <>
          <ul>
            {purchaseData.content.map((purchase) => (
              <PurchaseHistoryItem key={purchase.id} houseId={houseId} purchase={purchase} />
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              Anterior
            </button>
            <span className="mono">
              Página {page + 1} de {purchaseData.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={!purchaseData.hasNext}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {isCreateOpen && (
        <PurchaseCreateModal houseId={houseId} onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}