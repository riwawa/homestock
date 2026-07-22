import { useState } from "react";
import { Link } from "react-router-dom";
import { useHouses } from "../hooks/useHouses";
import { getErrorMessage } from "../../../api/axios";
import { HouseCreateModal } from "../components/HouseCreateModal";

export function HousesPage() {
  const { data: houses, isLoading, isError, error } = useHouses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) return <p>Carregando casas...</p>;
  if (isError) return <p>Erro ao carregar casas: {getErrorMessage(error)}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Minhas Casas</h1>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          + Nova casa
        </button>
      </div>

      {!houses || houses.length === 0 ? (
        <p>Nenhuma casa cadastrada ainda.</p>
      ) : (
        <ul>
          {houses.map((house) => (
            <li key={house.id} className="item-row">
              <Link to={`/houses/${house.id}`}>{house.name}</Link>
            </li>
          ))}
        </ul>
      )}

      {isCreateOpen && <HouseCreateModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}