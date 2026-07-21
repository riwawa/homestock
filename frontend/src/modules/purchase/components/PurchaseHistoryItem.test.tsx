import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { PurchaseHistoryItem } from "./PurchaseHistoryItem";
import { purchaseService } from "../services/purchaseService";

vi.mock("../services/purchaseService");

const purchase = {
  id: "purchase-1",
  houseId: "house-1",
  productId: "product-1",
  productName: "Arroz",
  quantity: 3,
  unitPrice: 5.5,
  totalPrice: 16.5,
  purchaseDate: "2026-07-20T19:27:45.857818",
};

describe("PurchaseHistoryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra os dados formatados da compra", () => {
    render(<PurchaseHistoryItem houseId="house-1" purchase={purchase} />);

    expect(screen.getByText(/20\/07\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/Arroz/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?16,50/)).toBeInTheDocument();
  });

  it("entra em modo de confirmação ao clicar em Remover, sem remover ainda", async () => {
    const user = userEvent.setup();
    render(<PurchaseHistoryItem houseId="house-1" purchase={purchase} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));

    expect(
      screen.getByRole("button", { name: "Confirmar remoção?" })
    ).toBeInTheDocument();
    expect(purchaseService.delete).not.toHaveBeenCalled();
  });

  it("cancela a remoção e volta ao estado normal", async () => {
    const user = userEvent.setup();
    render(<PurchaseHistoryItem houseId="house-1" purchase={purchase} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(purchaseService.delete).not.toHaveBeenCalled();
  });

  it("remove a compra ao confirmar", async () => {
    const user = userEvent.setup();
    vi.mocked(purchaseService.delete).mockResolvedValue(undefined);

    render(<PurchaseHistoryItem houseId="house-1" purchase={purchase} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Confirmar remoção?" }));

    await waitFor(() => {
      expect(purchaseService.delete).toHaveBeenCalledWith("purchase-1");
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    });
  });

  it("mostra mensagem de erro do backend se a remoção falhar", async () => {
    const user = userEvent.setup();
    vi.mocked(purchaseService.delete).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: "Compra não encontrada" } },
    });

    render(<PurchaseHistoryItem houseId="house-1" purchase={purchase} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Confirmar remoção?" }));

    expect(
      await screen.findByText(/Compra não encontrada/)
    ).toBeInTheDocument();
  });
});