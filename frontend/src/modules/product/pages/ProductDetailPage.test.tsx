// modules/product/pages/ProductDetailPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { ProductDetailPage } from "./ProductDetailPage";
import { productService } from "../services/productService";

vi.mock("../services/productService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "product-1" }),
  };
});

const activeProduct = {
  id: "product-1",
  name: "Arroz",
  category: "Grãos",
  unitOfMeasure: "kg",
  minimumQuantity: 2,
  active: true,
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra os dados do produto quando carregado", async () => {
    vi.mocked(productService.getById).mockResolvedValue(activeProduct);

    render(<ProductDetailPage />);

    expect(await screen.findByText(/Arroz/)).toBeInTheDocument();
    expect(screen.getByText("Grãos")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("mostra 'Não informada' quando categoria é null", async () => {
    vi.mocked(productService.getById).mockResolvedValue({
      ...activeProduct,
      category: null,
    });

    render(<ProductDetailPage />);

    expect(await screen.findByText("Não informada")).toBeInTheDocument();
  });

  it("mostra botão de desativar apenas se o produto estiver ativo", async () => {
    vi.mocked(productService.getById).mockResolvedValue(activeProduct);

    render(<ProductDetailPage />);

    expect(
      await screen.findByRole("button", { name: /desativar produto/i })
    ).toBeInTheDocument();
  });

  it("não mostra botão de desativar se o produto já estiver inativo", async () => {
    vi.mocked(productService.getById).mockResolvedValue({
      ...activeProduct,
      active: false,
    });

    render(<ProductDetailPage />);

    await screen.findByText(/Arroz/);
    expect(
      screen.queryByRole("button", { name: /desativar produto/i })
    ).not.toBeInTheDocument();
  });

  it("desativa o produto ao clicar no botão", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.getById).mockResolvedValue(activeProduct);
    vi.mocked(productService.delete).mockResolvedValue(undefined);

    render(<ProductDetailPage />);

    const button = await screen.findByRole("button", { name: /desativar produto/i });
    await user.click(button);

    await waitFor(() => {
        expect(productService.delete).toHaveBeenCalledWith(
        "product-1",
        expect.anything()
        );
    });
  });
});
