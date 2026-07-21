// modules/product/pages/ProductCreatePage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { ProductCreatePage } from "./ProductCreatePage";
import { productService } from "../services/productService";

const mockNavigate = vi.fn();

vi.mock("../services/productService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("ProductCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra erro de validação ao submeter nome vazio", async () => {
    const user = userEvent.setup();
    render(<ProductCreatePage />);

    await user.click(screen.getByRole("button", { name: /criar produto/i }));

    expect(
      await screen.findByText("Nome do produto é obrigatório")
    ).toBeInTheDocument();
    expect(productService.create).not.toHaveBeenCalled();
  });

  it("bloqueia quantidade mínima negativa", async () => {
    const user = userEvent.setup();
    render(<ProductCreatePage />);

    await user.type(screen.getByLabelText("Nome do produto"), "Arroz");
    await user.clear(screen.getByLabelText("Quantidade mínima"));
    await user.type(screen.getByLabelText("Quantidade mínima"), "-5");
    await user.click(screen.getByRole("button", { name: /criar produto/i }));

    expect(
      await screen.findByText("Quantidade mínima não pode ser negativa")
    ).toBeInTheDocument();
  });

  it("cria o produto e navega para o detalhe", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.create).mockResolvedValue({
      id: "new-product-id",
      name: "Arroz",
      category: null,
      unitOfMeasure: null,
      minimumQuantity: 0,
      active: true,
    });

    render(<ProductCreatePage />);

    await user.type(screen.getByLabelText("Nome do produto"), "Arroz");
    await user.click(screen.getByRole("button", { name: /criar produto/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/products/new-product-id");
    });
  });
});