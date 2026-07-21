// modules/house/pages/HouseDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import { useHouse } from "../hooks/useHouse";
import { getErrorMessage } from "../../../api/axios";
export function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: house, isLoading, isError, error } = useHouse(id ?? "");

  if (isLoading) {
    return <p>Carregando casa...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar casa: {getErrorMessage(error)}</p>;
  }

  if (!house) {
    return <p>Casa não encontrada.</p>;
  }

  return (
    <div>
      <Link to="/houses">← Voltar</Link>
      <h1>{house.name}</h1>

      <section>
        <h2>Moradores</h2>
        {house.residents.length === 0 ? (
          <p>Nenhum morador cadastrado.</p>
        ) : (
          <ul>
            {house.residents.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Estoque</h2>
        {house.inventory ? (
          <p>Inventário existe (detalhe ainda não implementado nessa tela).</p>
        ) : (
          <p>Essa casa ainda não tem estoque configurado.</p>
        )}
      </section>
    </div>
  );
}