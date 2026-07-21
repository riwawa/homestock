import { useState } from "react";
import { useDeletePurchase } from "../hooks/useDeletePurchase";
import { getErrorMessage } from "../../../api/axios";
import type { PurchaseResponse } from "../types/purchase";

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  houseId: string;
  purchase: PurchaseResponse;
};

export function PurchaseHistoryItem({ houseId, purchase }: Props) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deletePurchase = useDeletePurchase();

  const handleConfirmDelete = () => {
    deletePurchase.mutate(
      { id: purchase.id, houseId },
      { onSettled: () => setIsConfirmingDelete(false) }
    );
  };

  return (
    <li>
      {formatDate(purchase.purchaseDate)} — {purchase.productName} —{" "}
      {purchase.quantity}x {formatCurrency(purchase.unitPrice)} ={" "}
      {formatCurrency(purchase.totalPrice)}
      {isConfirmingDelete ? (
        <>
          <button onClick={handleConfirmDelete} disabled={deletePurchase.isPending}>
            {deletePurchase.isPending ? "Removendo..." : "Confirmar remoção?"}
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(false)}
            disabled={deletePurchase.isPending}
          >
            Cancelar
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setIsConfirmingDelete(true)}>
          Remover
        </button>
      )}
      {deletePurchase.isError && (
        <p>Erro ao remover: {getErrorMessage(deletePurchase.error)}</p>
      )}
    </li>
  );
}