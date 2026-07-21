// modules/house/pages/HousesPage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../tests/test-utils";
import { HousesPage } from "./HousesPage";
import { houseService } from "../services/houseService";
vi.mock("../services/houseService");

describe("HousesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o estado de carregamento inicialmente", () => {
    vi.mocked(houseService.list).mockReturnValue(new Promise(() => {})); // nunca resolve

    render(<HousesPage />);

    expect(screen.getByText("Carregando casas...")).toBeInTheDocument();
  });

  it("mostra a lista quando os dados chegam", async () => {
    vi.mocked(houseService.list).mockResolvedValue([
      { id: "1", name: "Casa Bia" },
      { id: "2", name: "Casa Praia" },
    ]);

    render(<HousesPage />);

    expect(await screen.findByText("Casa Bia")).toBeInTheDocument();
    expect(screen.getByText("Casa Praia")).toBeInTheDocument();
  });

  it("mostra mensagem de vazio quando não há casas", async () => {
    vi.mocked(houseService.list).mockResolvedValue([]);

    render(<HousesPage />);

    expect(
      await screen.findByText("Nenhuma casa cadastrada ainda.")
    ).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    vi.mocked(houseService.list).mockRejectedValue(new Error("Falha na rede"));

    render(<HousesPage />);

    expect(
      await screen.findByText(/Erro ao carregar casas/)
    ).toBeInTheDocument();
  });
});