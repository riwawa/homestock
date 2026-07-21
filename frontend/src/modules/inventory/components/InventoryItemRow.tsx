import { useState } from "react";
import { useConsumeStock } from "../hooks/useConsumeStock";
import { useRemoveInventoryItem } from "../hooks/useRemoveInventoryItem";
import type { InventoryItemResponse } from "../types/inventory";

type Props = {
  houseId: string;
  item: InventoryItemResponse;
};

export function InventoryItemRow({ houseId, item }: Props) {
  const [consumeAmount, setConsumeAmount] = useState(1);
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const consumeStock = useConsumeStock();
  const removeItem = useRemoveInventoryItem();

  const handleConsume = () => {
    consumeStock.mutate({
      houseId,
      payload: { productId: item.productId, quantity: consumeAmount },
    });
  };

  const handleConfirmRemove = () => {
    removeItem.mutate(
      { houseId, productId: item.productId },
      { onSettled: () => setIsConfirmingRemove(false) }
    );
  };

  return (
    <li>
      <span>
        {item.productName} — {item.quantity} unidade(s)
        {item.quantity === 0 && " (acabou)"}
      </span>

      <input
        type="number"
        min={1}
        value={consumeAmount}
        onChange={(e) => setConsumeAmount(Number(e.target.value))}
        aria-label={`Quantidade a consumir de ${item.productName}`}
      />
      <button
        onClick={handleConsume}
        disabled={consumeStock.isPending || item.quantity === 0}
      >
        Consumir
      </button>

      {isConfirmingRemove ? (
        <>
          <button onClick={handleConfirmRemove} disabled={removeItem.isPending}>
            {removeItem.isPending ? "Removendo..." : "Confirmar remoção?"}
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmingRemove(false)}
            disabled={removeItem.isPending}
          >
            Cancelar
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setIsConfirmingRemove(true)}>
          Remover
        </button>
      )}
    </li>
  );
}