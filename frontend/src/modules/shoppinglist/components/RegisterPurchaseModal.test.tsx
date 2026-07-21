import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { RegisterPurchaseModal } from "./RegisterPurchaseModal";
import { purchaseService } from "../../purchase/services/purchaseService";
import { shoppingListService } from "../services/shoppingListService";

vi.mock("../../purchase/services/purchaseService");
vi.mock("../services/shoppingListService");

const item = { productId: "product-1", productName: "Arroz", quantityNeeded: 3 };

const purchaseResponse = {
  id: "purchase-1",
  houseId: "house-1",
  productId: "product-1",
  productName: "Arroz",
  quantity: 3,
  unitPrice: 5.5,
  totalPrice: 16.5,
  purchaseDate: "2026-07-20T19:27:45.857818",
};

describe("RegisterPurchaseModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o nome do produto e a quantidade pré-preenchida", () => {
    const onClose = vi.fn();
    render(<RegisterPurchaseModal houseId="house-1" item={item} onClose={onClose} />);

    expect(screen.getByText(/Registrar compra: Arroz/)).toBeInTheDocument();
    expect(screen.getByLabelText("Quantidade comprada")).toHaveValue(3);
  });

  it("cancela sem chamar nenhuma mutation", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<RegisterPurchaseModal houseId="house-1" item={item} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalled();
    expect(purchaseService.create).not.toHaveBeenCalled();
  });

  it("fecha ao clicar fora do card (overlay)", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<RegisterPurchaseModal houseId="house-1" item={item} onClose={onClose} />);

    await user.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalled();
  });

  it("registra a compra, remove o item da lista e fecha o modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.mocked(purchaseService.create).mockResolvedValue(purchaseResponse);
    vi.mocked(shoppingListService.removeItem).mockResolvedValue({
      id: "list-1",
      items: [],
    });

    render(<RegisterPurchaseModal houseId="house-1" item={item} onClose={onClose} />);

    await user.clear(screen.getByLabelText("Preço unitário (R$)"));
    await user.type(screen.getByLabelText("Preço unitário (R$)"), "5.50");
    await user.click(screen.getByRole("button", { name: /confirmar compra/i }));

    await waitFor(() => {
      expect(purchaseService.create).toHaveBeenCalledWith("house-1", {
        productId: "product-1",
        quantity: 3,
        unitPrice: 5.5,
      });
    });

    await waitFor(() => {
      expect(shoppingListService.removeItem).toHaveBeenCalledWith(
        "house-1",
        "product-1"
      );
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("mostra erro e não remove o item da lista se a compra falhar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.mocked(purchaseService.create).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: "Produto não encontrado" } },
    });

    render(<RegisterPurchaseModal houseId="house-1" item={item} onClose={onClose} />);

    await user.clear(screen.getByLabelText("Preço unitário (R$)"));
    await user.type(screen.getByLabelText("Preço unitário (R$)"), "5.50");
    await user.click(screen.getByRole("button", { name: /confirmar compra/i }));

    expect(
      await screen.findByText(/Produto não encontrado/)
    ).toBeInTheDocument();
    expect(shoppingListService.removeItem).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});