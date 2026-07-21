// modules/purchase/pages/PurchasePage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { PurchasePage } from "./PurchasePage";
import { purchaseService } from "../services/purchaseService";
import { productService } from "../../product/services/productService";

vi.mock("../services/purchaseService");
vi.mock("../../product/services/productService");

const mockUseCurrentHouse = vi.fn();
vi.mock("../../house/context/CurrentHouseContext", () => ({
  useCurrentHouse: () => mockUseCurrentHouse(),
}));

const arroz = {
  id: "product-1",
  name: "Arroz",
  category: "Grãos",
  unitOfMeasure: "kg",
  minimumQuantity: 5,
  active: true,
};

const purchase = {
  id: "purchase-1",
  houseId: "house-1",
  productId: "product-1",
  productName: "Arroz",
  quantity: 3,
  unitPrice: 5.5,
  totalPrice: 16.5,
  purchaseDate: "2026-07-17T14:48:53.205461",
};

describe("PurchasePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra mensagem quando nenhuma casa está selecionada", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: null });
    render(<PurchasePage />);
    expect(screen.getByText("Nenhuma casa selecionada ainda.")).toBeInTheDocument();
  });

  it("mostra o estado de carregamento", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockReturnValue(new Promise(() => {}));
    vi.mocked(productService.list).mockResolvedValue([]);

    render(<PurchasePage />);

    expect(screen.getByText("Carregando histórico de compras...")).toBeInTheDocument();
  });

  it("mostra mensagem quando não há compras", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockResolvedValue([]);
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    render(<PurchasePage />);

    expect(
      await screen.findByText("Nenhuma compra registrada ainda.")
    ).toBeInTheDocument();
  });

  it("mostra o histórico formatado em data e moeda brasileira", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockResolvedValue([purchase]);
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    render(<PurchasePage />);

    expect(await screen.findByText(/17\/07\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/Arroz/, { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?16,50/, { selector: "li" })).toBeInTheDocument();
  });

  it("registra uma compra e invalida o cache de compras e de estoque", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockResolvedValue([]);
    vi.mocked(productService.list).mockResolvedValue([arroz]);
    vi.mocked(purchaseService.create).mockResolvedValue(purchase);

    render(<PurchasePage />);

    await screen.findByText("Nenhuma compra registrada ainda.");

    await user.selectOptions(screen.getByLabelText("Produto"), "product-1");
    await user.clear(screen.getByLabelText("Quantidade"));
    await user.type(screen.getByLabelText("Quantidade"), "3");
    await user.clear(screen.getByLabelText("Preço unitário (R$)"));
    await user.type(screen.getByLabelText("Preço unitário (R$)"), "5.50");
    await user.click(screen.getByRole("button", { name: /registrar compra/i }));

    await waitFor(() => {
      expect(purchaseService.create).toHaveBeenCalledWith("house-1", {
        productId: "product-1",
        quantity: 3,
        unitPrice: 5.5,
      });
    });
  });

  it("valida produto obrigatório ao submeter sem selecionar", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockResolvedValue([]);
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    render(<PurchasePage />);

    await screen.findByText("Nenhuma compra registrada ainda.");
    await user.click(screen.getByRole("button", { name: /registrar compra/i }));

    expect(
      await screen.findByText("Selecione um produto", { selector: "p" })
    ).toBeInTheDocument();
    expect(purchaseService.create).not.toHaveBeenCalled();
  });

    it("mostra erro quando o registro da compra falha", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(purchaseService.getByHouseId).mockResolvedValue([]);
    vi.mocked(productService.list).mockResolvedValue([arroz]);
    vi.mocked(purchaseService.create).mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: "Produto não encontrado" } },
    });

    render(<PurchasePage />);

    await screen.findByText("Nenhuma compra registrada ainda.");

    await user.selectOptions(screen.getByLabelText("Produto"), "product-1");
    await user.clear(screen.getByLabelText("Quantidade"));
    await user.type(screen.getByLabelText("Quantidade"), "1");
    await user.clear(screen.getByLabelText("Preço unitário (R$)"));
    await user.type(screen.getByLabelText("Preço unitário (R$)"), "5.50");
    await user.click(screen.getByRole("button", { name: /registrar compra/i }));

    expect(
        await screen.findByText(/Produto não encontrado/)
    ).toBeInTheDocument();
    });
});