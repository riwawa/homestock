import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../tests/test-utils";
import { HouseCreatePage } from "./HouseCreatePage";
import { houseService } from "../services/houseService";

const mockNavigate = vi.fn();

vi.mock("../services/houseService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("HouseCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra erro de validação ao submeter nome vazio", async () => {
    const user = userEvent.setup();
    render(<HouseCreatePage />);

    await user.click(screen.getByRole("button", { name: /criar casa/i }));

    expect(
      await screen.findByText("Nome da casa é obrigatório")
    ).toBeInTheDocument();
    expect(houseService.create).not.toHaveBeenCalled();
  });

    it("adiciona e remove campos de morador dinamicamente", async () => {
    const user = userEvent.setup();
    render(<HouseCreatePage />);

    await user.click(screen.getByText("+ Adicionar morador"));
    await user.click(screen.getByText("+ Adicionar morador"));

    expect(screen.getByLabelText("Morador 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Morador 2")).toBeInTheDocument();

    const removeButtons = screen.getAllByText("Remover");
    expect(removeButtons).toHaveLength(2);

    await user.click(removeButtons[0]);

    expect(screen.getAllByText("Remover")).toHaveLength(1);
    });

  it("submete o formulário com sucesso e navega para o detalhe", async () => {
    const user = userEvent.setup();
    vi.mocked(houseService.create).mockResolvedValue({
      id: "new-house-id",
      name: "Casa Nova",
      residents: [],
      inventory: null,
      shoppingList: null,
    });

    render(<HouseCreatePage />);

    await user.type(screen.getByLabelText("Nome da casa"), "Casa Nova");
    await user.click(screen.getByRole("button", { name: /criar casa/i }));

    await waitFor(() => {
    expect(houseService.create).toHaveBeenCalledWith(
        { name: "Casa Nova", residents: [] },
        expect.anything()
    );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/houses/new-house-id");
    });
  });

  it("mostra mensagem de erro quando a criação falha", async () => {
    const user = userEvent.setup();
    vi.mocked(houseService.create).mockRejectedValue(new Error("Falha na rede"));

    render(<HouseCreatePage />);

    await user.type(screen.getByLabelText("Nome da casa"), "Casa Nova");
    await user.click(screen.getByRole("button", { name: /criar casa/i }));

    expect(
      await screen.findByText(/Erro ao criar casa/)
    ).toBeInTheDocument();
  });
});