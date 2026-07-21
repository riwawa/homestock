import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { ProductEditPage } from "./ProductEditPage";
import { productService } from "../services/productService";

const mockNavigate = vi.fn();

vi.mock("../services/productService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "product-1" }),
    useNavigate: () => mockNavigate,
  };
});

describe("ProductEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preenche o formulário com os dados existentes do produto", async () => {
    vi.mocked(productService.getById).mockResolvedValue({
      id: "product-1",
      name: "Arroz",
      category: "Grãos",
      unitOfMeasure: "kg",
      minimumQuantity: 2,
      active: true,
    });

    render(<ProductEditPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Nome do produto")).toHaveValue("Arroz");
    });
    expect(screen.getByLabelText("Categoria")).toHaveValue("Grãos");
    expect(screen.getByLabelText("Quantidade mínima")).toHaveValue(2);
  });

  it("preenche categoria como vazio quando vem null da API", async () => {
    vi.mocked(productService.getById).mockResolvedValue({
      id: "product-1",
      name: "Feijão",
      category: null,
      unitOfMeasure: null,
      minimumQuantity: 1,
      active: true,
    });

    render(<ProductEditPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Categoria")).toHaveValue("");
    });
  });

  it("salva as alterações e volta para o detalhe", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.getById).mockResolvedValue({
      id: "product-1",
      name: "Arroz",
      category: "Grãos",
      unitOfMeasure: "kg",
      minimumQuantity: 2,
      active: true,
    });
    vi.mocked(productService.update).mockResolvedValue({
      id: "product-1",
      name: "Arroz Integral",
      category: "Grãos",
      unitOfMeasure: "kg",
      minimumQuantity: 2,
      active: true,
    });

    render(<ProductEditPage />);

    const nameInput = await screen.findByLabelText("Nome do produto");
    await waitFor(() => expect(nameInput).toHaveValue("Arroz"));

    await user.clear(nameInput);
    await user.type(nameInput, "Arroz Integral");
    await user.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/products/product-1");
    });
  });
});