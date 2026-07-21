// modules/house/pages/HouseDetailPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../tests/test-utils";
import { HouseDetailPage } from "./HouseDetailPage";
import { houseService } from "../services/houseService";

vi.mock("../services/houseService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "house-1" }),
  };
});

describe("HouseDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o estado de carregamento inicialmente", () => {
    vi.mocked(houseService.getById).mockReturnValue(new Promise(() => {}));

    render(<HouseDetailPage />);

    expect(screen.getByText("Carregando casa...")).toBeInTheDocument();
  });

  it("mostra o nome e os moradores quando os dados chegam", async () => {
    vi.mocked(houseService.getById).mockResolvedValue({
      id: "house-1",
      name: "Casa Bia",
      residents: ["Bia", "Maria"],
      inventory: null,
      shoppingList: null,
    });

    render(<HouseDetailPage />);

    expect(await screen.findByText("Casa Bia")).toBeInTheDocument();
    expect(screen.getByText("Bia")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("mostra mensagem quando não há moradores", async () => {
    vi.mocked(houseService.getById).mockResolvedValue({
      id: "house-1",
      name: "Casa Vazia",
      residents: [],
      inventory: null,
      shoppingList: null,
    });

    render(<HouseDetailPage />);

    expect(
      await screen.findByText("Nenhum morador cadastrado.")
    ).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    vi.mocked(houseService.getById).mockRejectedValue(new Error("Falha na rede"));

    render(<HouseDetailPage />);

    expect(await screen.findByText(/Erro ao carregar casa/)).toBeInTheDocument();
  });
});