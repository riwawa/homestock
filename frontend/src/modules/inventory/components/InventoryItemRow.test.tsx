// modules/inventory/components/InventoryItemRow.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { InventoryItemRow } from "./InventoryItemRow";
import { inventoryService } from "../services/inventoryService";

vi.mock("../services/inventoryService");

const item = { productId: "product-1", productName: "Arroz", quantity: 5 };
const emptyItem = { productId: "product-2", productName: "Feijão", quantity: 0 };

describe("InventoryItemRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra os dados do item", () => {
    render(<InventoryItemRow houseId="house-1" item={item} />);
    expect(screen.getByText(/Arroz — 5 unidade\(s\)/)).toBeInTheDocument();
  });

  it("indica quando o item acabou", () => {
    render(<InventoryItemRow houseId="house-1" item={emptyItem} />);
    expect(screen.getByText(/\(acabou\)/)).toBeInTheDocument();
  });

  it("desabilita o botão de consumir quando a quantidade é zero", () => {
    render(<InventoryItemRow houseId="house-1" item={emptyItem} />);
    expect(screen.getByRole("button", { name: "Consumir" })).toBeDisabled();
  });

  it("consome estoque ao clicar em Consumir", async () => {
    const user = userEvent.setup();
    vi.mocked(inventoryService.consumeStock).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [{ ...item, quantity: 3 }],
    });

    render(<InventoryItemRow houseId="house-1" item={item} />);

    await user.click(screen.getByRole("button", { name: "Consumir" }));

    await waitFor(() => {
      expect(inventoryService.consumeStock).toHaveBeenCalledWith(
        "house-1",
        { productId: "product-1", quantity: 1 }
      );
    });
  });

  it("entra em modo de confirmação ao clicar em Remover, sem remover ainda", async () => {
    const user = userEvent.setup();
    render(<InventoryItemRow houseId="house-1" item={item} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));

    expect(
      screen.getByRole("button", { name: "Confirmar remoção?" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(inventoryService.removeItem).not.toHaveBeenCalled();
  });

  it("cancela a remoção e volta ao estado normal", async () => {
    const user = userEvent.setup();
    render(<InventoryItemRow houseId="house-1" item={item} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirmar remoção?" })
    ).not.toBeInTheDocument();
  });

  it("remove o item ao confirmar, e volta ao estado normal depois", async () => {
    const user = userEvent.setup();
    vi.mocked(inventoryService.removeItem).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [],
    });

    render(<InventoryItemRow houseId="house-1" item={item} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Confirmar remoção?" }));

    await waitFor(() => {
      expect(inventoryService.removeItem).toHaveBeenCalledWith("house-1", "product-1");
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    });
  });
});