// modules/inventory/pages/InventoryPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { InventoryPage } from "./InventoryPage";
import { inventoryService } from "../services/inventoryService";
import { productService } from "../../product/services/productService";

vi.mock("../services/inventoryService");
vi.mock("../../product/services/productService");

const mockUseCurrentHouse = vi.fn();
vi.mock("../../house/context/CurrentHouseContext", () => ({
  useCurrentHouse: () => mockUseCurrentHouse(),
}));

const activeProduct = {
  id: "product-1",
  name: "Arroz",
  category: "Grãos",
  unitOfMeasure: "kg",
  minimumQuantity: 2,
  active: true,
};

const inactiveProduct = {
  id: "product-2",
  name: "Refrigerante Antigo",
  category: null,
  unitOfMeasure: null,
  minimumQuantity: 0,
  active: false,
};

describe("InventoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra mensagem quando nenhuma casa está selecionada", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: null });

    render(<InventoryPage />);

    expect(screen.getByText("Nenhuma casa selecionada ainda.")).toBeInTheDocument();
  });

  it("mostra o estado de carregamento", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockReturnValue(new Promise(() => {}));
    vi.mocked(productService.list).mockResolvedValue([]);

    render(<InventoryPage />);

    expect(screen.getByText("Carregando estoque...")).toBeInTheDocument();
  });

  it("mostra os itens do estoque quando carregados", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [{ productId: "product-1", productName: "Arroz", quantity: 5 }],
    });
    vi.mocked(productService.list).mockResolvedValue([activeProduct]);

    render(<InventoryPage />);

    expect(await screen.findByText(/Arroz — 5 unidade\(s\)/)).toBeInTheDocument();
  });

  it("mostra mensagem quando o estoque está vazio", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([activeProduct]);

    render(<InventoryPage />);

    expect(await screen.findByText("Nenhum item no estoque ainda.")).toBeInTheDocument();
  });

  it("lista apenas produtos ativos no seletor de adicionar", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([activeProduct, inactiveProduct]);

    render(<InventoryPage />);

    await screen.findByText("Nenhum item no estoque ainda.");

    expect(screen.getByRole("option", { name: "Arroz" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Refrigerante Antigo" })
    ).not.toBeInTheDocument();
  });

    it("valida produto obrigatório ao submeter sem selecionar", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockResolvedValue({
        id: "inv-1",
        houseId: "house-1",
        items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([activeProduct]);

    render(<InventoryPage />);

    await screen.findByText("Nenhum item no estoque ainda.");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    expect(
        await screen.findByText("Selecione um produto", { selector: "p" })
    ).toBeInTheDocument();
    expect(inventoryService.addStock).not.toHaveBeenCalled();
    });

  it("adiciona estoque com sucesso", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(inventoryService.getByHouseId).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([activeProduct]);
    vi.mocked(inventoryService.addStock).mockResolvedValue({
      id: "inv-1",
      houseId: "house-1",
      items: [{ productId: "product-1", productName: "Arroz", quantity: 3 }],
    });

    render(<InventoryPage />);

    await screen.findByText("Nenhum item no estoque ainda.");

    await user.selectOptions(screen.getByLabelText("Produto"), "product-1");
    await user.clear(screen.getByLabelText("Quantidade"));
    await user.type(screen.getByLabelText("Quantidade"), "3");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    await waitFor(() => {
        expect(inventoryService.addStock).toHaveBeenCalledWith(
        "house-1",
        { productId: "product-1", quantity: 3 }
        );
    });
});
});