import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../tests/test-utils";
import { ProductsPage } from "./ProductsPage";
import { productService } from "../services/productService";
vi.mock("../services/productService");

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o estado de carregamento inicialmente", () => {
    vi.mocked(productService.list).mockReturnValue(new Promise(() => {}));
    render(<ProductsPage />);
    expect(screen.getByText("Carregando produtos...")).toBeInTheDocument();
  });

  it("mostra a lista quando os dados chegam", async () => {
    vi.mocked(productService.list).mockResolvedValue([
      { id: "1", name: "Arroz", category: "Grãos", unitOfMeasure: "kg", minimumQuantity: 2, active: true },
    ]);

    render(<ProductsPage />);

    expect(await screen.findByText("Arroz")).toBeInTheDocument();
  });

  it("indica produtos inativos na listagem", async () => {
    vi.mocked(productService.list).mockResolvedValue([
      { id: "1", name: "Feijão", category: null, unitOfMeasure: null, minimumQuantity: 1, active: false },
    ]);

    render(<ProductsPage />);

    expect(await screen.findByText(/Feijão/)).toBeInTheDocument();
    expect(screen.getByText(/inativo/)).toBeInTheDocument();
  });

  it("mostra mensagem de vazio quando não há produtos", async () => {
    vi.mocked(productService.list).mockResolvedValue([]);
    render(<ProductsPage />);
    expect(
      await screen.findByText("Nenhum produto cadastrado ainda.")
    ).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    vi.mocked(productService.list).mockRejectedValue(new Error("Falha na rede"));
    render(<ProductsPage />);
    expect(await screen.findByText(/Erro ao carregar produtos/)).toBeInTheDocument();
  });
});