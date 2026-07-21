import { Link } from "react-router-dom";
import { useHouses } from "../hooks/useHouses";
import { getErrorMessage } from "../../../api/axios";
export function HousesPage() {
  const { data: houses, isLoading, isError, error } = useHouses();

  if (isLoading) return <p>Carregando casas...</p>;
  if (isError) return <p>Erro ao carregar casas: {getErrorMessage(error)}</p>;

  return (
    <div>
      <h1>Minhas Casas</h1>
      <Link to="/houses/new">+ Nova casa</Link>

      {!houses || houses.length === 0 ? (
        <p>Nenhuma casa cadastrada ainda.</p>
      ) : (
        <ul>
          {houses.map((house) => (
            <li key={house.id}>
              <Link to={`/houses/${house.id}`}>{house.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}