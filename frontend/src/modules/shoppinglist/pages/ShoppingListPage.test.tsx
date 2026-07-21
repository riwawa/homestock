import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { ShoppingListPage } from "./ShoppingListPage";
import { shoppingListService } from "../services/shoppingListService";
import { productService } from "../../product/services/productService";

vi.mock("../services/shoppingListService");
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

const feijao = {
  id: "product-2",
  name: "Feijão",
  category: "Grãos",
  unitOfMeasure: "kg",
  minimumQuantity: 3,
  active: true,
};

describe("ShoppingListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra mensagem quando nenhuma casa está selecionada", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: null });
    render(<ShoppingListPage />);
    expect(screen.getByText("Nenhuma casa selecionada ainda.")).toBeInTheDocument();
  });

  it("mostra o estado de carregamento", () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockReturnValue(new Promise(() => {}));
    vi.mocked(productService.list).mockResolvedValue([]);

    render(<ShoppingListPage />);

    expect(screen.getByText("Carregando lista de compras...")).toBeInTheDocument();
  });

  it("mostra mensagem quando a lista está vazia", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    render(<ShoppingListPage />);

    expect(
      await screen.findByText("Nenhum item na lista de compras.")
    ).toBeInTheDocument();
  });

  it("mostra os itens da lista quando carregados", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [{ productId: "product-1", productName: "Arroz", quantityNeeded: 3 }],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    render(<ShoppingListPage />);

    expect(await screen.findByText(/Arroz — 3 unidade\(s\)/)).toBeInTheDocument();
  });

  it("exclui do dropdown produtos que já estão na lista", async () => {
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [{ productId: "product-1", productName: "Arroz", quantityNeeded: 3 }],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz, feijao]);

    render(<ShoppingListPage />);

    await screen.findByText(/Arroz — 3 unidade\(s\)/);

    expect(screen.getByRole("option", { name: "Feijão" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Arroz" })).not.toBeInTheDocument();
  });

  it("gera a lista automaticamente ao clicar no botão", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);
    vi.mocked(shoppingListService.generate).mockResolvedValue({
      id: "list-1",
      items: [{ productId: "product-1", productName: "Arroz", quantityNeeded: 5 }],
    });

    render(<ShoppingListPage />);

    await screen.findByText("Nenhum item na lista de compras.");
    await user.click(
      screen.getByRole("button", { name: /gerar lista automaticamente/i })
    );

    await waitFor(() => {
      expect(shoppingListService.generate).toHaveBeenCalledWith(
        "house-1",
        expect.anything()
      );
    });
  });

  it("adiciona item manualmente com sucesso", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);
    vi.mocked(shoppingListService.addItem).mockResolvedValue({
      id: "list-1",
      items: [{ productId: "product-1", productName: "Arroz", quantityNeeded: 2 }],
    });

    render(<ShoppingListPage />);

    await screen.findByText("Nenhum item na lista de compras.");

    await user.selectOptions(screen.getByLabelText("Produto"), "product-1");
    await user.clear(screen.getByLabelText("Quantidade necessária"));
    await user.type(screen.getByLabelText("Quantidade necessária"), "2");
    await user.click(screen.getByRole("button", { name: /^adicionar$/i }));

    await waitFor(() => {
        expect(shoppingListService.addItem).toHaveBeenCalledWith(
        "house-1",
        { productId: "product-1", quantityNeeded: 2 }
        );
    });
  });

  it("mostra a mensagem específica do backend ao tentar adicionar duplicata", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);

    const axiosError = {
      isAxiosError: true,
      response: { data: { message: "Produto já existe na lista de compras" } },
    };
    vi.mocked(shoppingListService.addItem).mockRejectedValue(axiosError);

    render(<ShoppingListPage />);

    await screen.findByText("Nenhum item na lista de compras.");

    await user.selectOptions(screen.getByLabelText("Produto"), "product-1");
    await user.click(screen.getByRole("button", { name: /^adicionar$/i }));

    expect(
      await screen.findByText(/Produto já existe na lista de compras/)
    ).toBeInTheDocument();
  });

  it("remove um item da lista", async () => {
    const user = userEvent.setup();
    mockUseCurrentHouse.mockReturnValue({ currentHouseId: "house-1" });
    vi.mocked(shoppingListService.getByHouseId).mockResolvedValue({
      id: "list-1",
      items: [{ productId: "product-1", productName: "Arroz", quantityNeeded: 3 }],
    });
    vi.mocked(productService.list).mockResolvedValue([arroz]);
    vi.mocked(shoppingListService.removeItem).mockResolvedValue({
      id: "list-1",
      items: [],
    });

    render(<ShoppingListPage />);

    await user.click(await screen.findByRole("button", { name: "Remover" }));

    await waitFor(() => {
        expect(shoppingListService.removeItem).toHaveBeenCalledWith(
        "house-1",
        "product-1"
        );
    });
  });
});